// Aegis - Main Application Controller
// Orchestrates Leaflet GIS, GEE Simulation, Gemini 3.7 Flash, and Advisory Dispatcher

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { BRICS_BASINS } from "./data/brics_scenarios.js";
import { SurgePhysicsEngine } from "./engine/surge_physics.js";
import { GeminiReasoningEngine } from "./engine/gemini_reasoning.js";
import { AdvisoryDispatcher } from "./engine/advisory_dispatcher.js";
import { ReportGenerator } from "./engine/report_generator.js";
import { NationalSystemAdapter } from "./engine/national_adapter.js";

class AegisApp {
  constructor() {
    this.currentBasinKey = "india";
    this.currentStepIdx = 2; // Default to T-24h (Critical pre-landfall window)
    this.isPlaying = false;
    this.playInterval = null;
    this.customBasins = {};
    this.isLowBandwidthMode = false;

    this.activeLayers = {
      track: true,
      cone: true,
      surge: true,
      gee: true,
      infrastructure: true
    };

    // Engines
    this.nationalAdapter = new NationalSystemAdapter();
    this.physics = new SurgePhysicsEngine();
    this.gemini = new GeminiReasoningEngine();
    this.dispatcher = new AdvisoryDispatcher(this.nationalAdapter);
    this.reporter = new ReportGenerator();

    // Map & Layer References
    this.map = null;
    this.mapLayers = {
      base: null,
      trackPolyline: null,
      eyeMarker: null,
      conePolygon: null,
      surgePolygon: null,
      geeRasterOverlay: null,
      infraGroup: L.layerGroup()
    };

    this.init();
  }

  get currentBasin() {
    return this.customBasins[this.currentBasinKey] || BRICS_BASINS[this.currentBasinKey] || BRICS_BASINS.india;
  }

  get currentStep() {
    return this.currentBasin.timeSteps[this.currentStepIdx];
  }

  get exposedAssets() {
    return this.currentBasin.infrastructure.map(asset => {
      const exposure = this.physics.assessAssetExposure(
        asset,
        this.currentStep.eyeCoord,
        this.currentStep.surgeHeightM,
        this.currentStep.maxWindSpeedKmph
      );
      const currentStatus = asset.statusByStep[this.currentStep.step] || "NORMAL";
      return {
        ...asset,
        ...exposure,
        currentStatus
      };
    });
  }

  init() {
    this.initMap();
    this.bindEvents();
    this.loadBasin(this.currentBasinKey);
  }

  initMap() {
    const basin = this.currentBasin;
    this.map = L.map("gisMap", {
      center: basin.center,
      zoom: basin.zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Custom tactical zoom control on top-left
    L.control.zoom({ position: "topleft" }).addTo(this.map);

    // Tactical Dark Gray Basemap (Esri World Dark Gray - crisp EOC basemap with zero watermarks)
    this.mapLayers.base = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
        attribution: "Tiles &copy; Esri"
      }
    ).addTo(this.map);

    this.mapLayers.labels = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
        opacity: 0.85
      }
    ).addTo(this.map);

    this.mapLayers.infraGroup.addTo(this.map);
  }

  bindEvents() {
    // Basin Dropdown
    const basinSelect = document.getElementById("basinSelect");
    basinSelect.addEventListener("change", (e) => {
      this.loadBasin(e.target.value);
    });

    // Time Slider
    const timeSlider = document.getElementById("timeSlider");
    timeSlider.addEventListener("input", (e) => {
      this.setTimeStep(parseInt(e.target.value, 10));
    });

    // Timeline Markers Click
    document.querySelectorAll(".timeline-markers .marker").forEach(marker => {
      marker.addEventListener("click", () => {
        const step = parseInt(marker.getAttribute("data-step"), 10);
        this.setTimeStep(step);
      });
    });

    // Auto-Simulate Play/Pause Button
    const btnPlayPause = document.getElementById("btnPlayPause");
    btnPlayPause.addEventListener("click", () => {
      this.togglePlayback();
    });

    // Layer Checkboxes
    document.getElementById("layerTrack").addEventListener("change", (e) => {
      this.activeLayers.track = e.target.checked;
      this.renderTrack();
    });
    document.getElementById("layerCone").addEventListener("change", (e) => {
      this.activeLayers.cone = e.target.checked;
      this.renderCone();
    });
    document.getElementById("layerSurge").addEventListener("change", (e) => {
      this.activeLayers.surge = e.target.checked;
      this.renderSurge();
    });
    document.getElementById("layerGee").addEventListener("change", (e) => {
      this.activeLayers.gee = e.target.checked;
      this.renderGeeRaster();
    });
    document.getElementById("layerInfrastructure").addEventListener("change", (e) => {
      this.activeLayers.infrastructure = e.target.checked;
      this.renderInfrastructure();
    });

    // Gemini Run Button
    document.getElementById("btnRunGemini").addEventListener("click", () => {
      this.triggerGeminiAnalysis();
    });

    // Advisory Language Switcher
    const langSelect = document.getElementById("advisoryLangSelect");
    langSelect.addEventListener("change", (e) => {
      this.updateAdvisoryDisplay(e.target.value);
    });

    // Play Voice Warning Audio
    const btnPlayAudio = document.getElementById("btnPlayAudio");
    btnPlayAudio.addEventListener("click", () => {
      this.toggleAudioBroadcast();
    });

    // SITREP Report Generator
    document.getElementById("btnSitrep").addEventListener("click", () => {
      this.generateSitrepDownload();
    });

    // API Key Modal Controls
    const apiKeyModal = document.getElementById("apiKeyModal");
    document.getElementById("btnApiKey").addEventListener("click", () => {
      document.getElementById("inputApiKey").value = this.gemini.apiKey || "";
      apiKeyModal.classList.remove("hidden");
    });
    document.getElementById("btnCloseModal").addEventListener("click", () => {
      apiKeyModal.classList.add("hidden");
    });
    document.getElementById("btnSaveApiKey").addEventListener("click", () => {
      const key = document.getElementById("inputApiKey").value.trim();
      this.gemini.setApiKey(key);
      apiKeyModal.classList.add("hidden");
      alert(key ? "Gemini API Key saved successfully!" : "API Key cleared. Using built-in reasoning engine.");
    });
    document.getElementById("btnClearApiKey").addEventListener("click", () => {
      this.gemini.setApiKey("");
      document.getElementById("inputApiKey").value = "";
      apiKeyModal.classList.add("hidden");
    });

    // National Systems & OASIS CAP v1.2 Gateway Modal
    const natSysModal = document.getElementById("nationalSystemsModal");
    document.getElementById("btnNationalSystems").addEventListener("click", () => {
      this.populateNationalSystemsModal();
      natSysModal.classList.remove("hidden");
    });
    document.getElementById("btnCloseNatSysModal").addEventListener("click", () => {
      natSysModal.classList.add("hidden");
    });
    document.getElementById("btnCloseNatSysModalFooter").addEventListener("click", () => {
      natSysModal.classList.add("hidden");
    });

    // Modal Tabs Navigation
    document.querySelectorAll(".modal-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetTab = e.currentTarget.getAttribute("data-tab");
        document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".modal-tab-content").forEach(c => c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const activeContent = document.getElementById(targetTab);
        if (activeContent) activeContent.classList.add("active");
      });
    });

    // CAP Download & Copy Actions
    document.getElementById("btnDownloadCapXml").addEventListener("click", () => {
      this.downloadCapXml();
    });
    document.getElementById("btnCopyCapJson").addEventListener("click", () => {
      this.copyCapJson();
    });
    document.getElementById("btnCopySatcomPacket").addEventListener("click", () => {
      this.copySatcomPacket();
    });

    // Low-Bandwidth / Satcom Mode Toggle
    document.getElementById("btnToggleBandwidth").addEventListener("click", () => {
      this.toggleBandwidthMode();
    });

    // Custom Country GeoJSON / Scenario Upload
    const fileInput = document.getElementById("inputGeoJsonFile");
    document.getElementById("btnBrowseGeoJson").addEventListener("click", () => {
      fileInput.click();
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleGeoJsonUpload(e.target.files[0]);
      }
    });

    const dropZone = document.getElementById("dropZoneGeoJson");
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--accent-cyan)";
    });
    dropZone.addEventListener("dragleave", () => {
      dropZone.style.borderColor = "var(--border-tactical)";
    });
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--border-tactical)";
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleGeoJsonUpload(e.dataTransfer.files[0]);
      }
    });
  }

  loadBasin(basinKey) {
    this.currentBasinKey = basinKey;
    const basin = this.currentBasin;

    // Center map
    this.map.setView(basin.center, basin.zoom);

    // Reset step to T-24h
    this.currentStepIdx = 2;
    document.getElementById("timeSlider").value = 2;

    // Update Header
    document.getElementById("stormNameHeading").textContent = basin.stormName;
    document.getElementById("targetCorridorDesc").textContent = basin.regionDescription;
    document.getElementById("stormCategoryBadge").textContent = basin.category.toUpperCase();
    document.getElementById("valPopulation").textContent = basin.populationAtRisk;

    // Populate Language Dropdown
    const langSelect = document.getElementById("advisoryLangSelect");
    langSelect.innerHTML = "";
    basin.languages.forEach(lang => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = `${lang}${lang === basin.defaultLanguage ? " (Primary)" : ""}`;
      langSelect.appendChild(opt);
    });

    this.updateUI();
    this.triggerGeminiAnalysis();
  }

  setTimeStep(stepIdx) {
    this.currentStepIdx = stepIdx;
    document.getElementById("timeSlider").value = stepIdx;

    // Update active marker styling
    document.querySelectorAll(".timeline-markers .marker").forEach((m, idx) => {
      if (idx === stepIdx) {
        m.classList.add("active");
      } else {
        m.classList.remove("active");
      }
    });

    this.updateUI();
  }

  togglePlayback() {
    if (this.isPlaying) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
      document.getElementById("playIcon").innerHTML = '<i class="ti ti-player-play"></i>';
      document.getElementById("playText").textContent = "Simulate";
    } else {
      this.isPlaying = true;
      document.getElementById("playIcon").innerHTML = '<i class="ti ti-player-pause"></i>';
      document.getElementById("playText").textContent = "Pause";

      this.playInterval = setInterval(() => {
        let next = (this.currentStepIdx + 1) % this.currentBasin.timeSteps.length;
        this.setTimeStep(next);
      }, 3500);
    }
  }

  updateUI() {
    const step = this.currentStep;

    // Update Timeline readout badge
    document.getElementById("activeTimeStepLabel").textContent = `${step.step} (${step.label})`;
    document.getElementById("stepTimestamp").textContent = step.timestamp;
    document.getElementById("headerStatusText").textContent = `ALERT: ${step.alertLevel} · ${step.step}`;

    // Telemetry Numbers
    document.getElementById("valPressure").textContent = step.centralPressureHpa;
    document.getElementById("valWind").textContent = step.maxWindSpeedKmph;
    document.getElementById("valSurge").textContent = step.surgeHeightM;
    document.getElementById("valRain").textContent = step.rainfallForecastMm24h;

    // Render Map Layers
    this.renderTrack();
    this.renderCone();
    this.renderSurge();
    this.renderGeeRaster();
    this.renderInfrastructure();

    // Update Infrastructure Mini-List
    this.updateInfrastructureList();

    // Update Advisory
    const currentLang = document.getElementById("advisoryLangSelect").value;
    this.updateAdvisoryDisplay(currentLang);
  }

  renderTrack() {
    if (this.mapLayers.trackPolyline) {
      this.map.removeLayer(this.mapLayers.trackPolyline);
      this.mapLayers.trackPolyline = null;
    }
    if (this.mapLayers.eyeMarker) {
      this.map.removeLayer(this.mapLayers.eyeMarker);
      this.mapLayers.eyeMarker = null;
    }

    if (!this.activeLayers.track) return;

    const coords = this.currentBasin.timeSteps.map(s => s.eyeCoord);
    this.mapLayers.trackPolyline = L.polyline(coords, {
      color: "#ff2a5f",
      weight: 3,
      opacity: 0.75,
      dashArray: "6, 8"
    }).addTo(this.map);

    // Animated Pulsing Vortex Marker
    const eyeIcon = L.divIcon({
      className: "cyclone-vortex-marker",
      html: `
        <div class="cyclone-vortex-ring"></div>
        <div class="cyclone-vortex-center"></div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    this.mapLayers.eyeMarker = L.marker(this.currentStep.eyeCoord, { icon: eyeIcon })
      .addTo(this.map)
      .bindPopup(`
        <div style="font-family: 'Outfit', sans-serif; font-size: 13px; color: #000; min-width: 180px;">
          <strong style="color: #ff2a5f; font-size: 14px;">${this.currentBasin.stormName}</strong><br/>
          <strong>Horizon:</strong> ${this.currentStep.label}<br/>
          <strong>Winds:</strong> ${this.currentStep.maxWindSpeedKmph} km/h<br/>
          <strong>Surge:</strong> ${this.currentStep.surgeHeightM}m<br/>
          <strong>Pressure:</strong> ${this.currentStep.centralPressureHpa} hPa
        </div>
      `);
  }

  renderCone() {
    if (this.mapLayers.conePolygon) {
      this.map.removeLayer(this.mapLayers.conePolygon);
      this.mapLayers.conePolygon = null;
    }

    if (!this.activeLayers.cone) return;

    const radiusMeters = this.currentStep.coneRadiusKm * 1000;
    this.mapLayers.conePolygon = L.circle(this.currentStep.eyeCoord, {
      radius: radiusMeters,
      color: "rgba(255, 132, 0, 0.4)",
      weight: 1,
      fillColor: "rgba(255, 132, 0, 0.12)",
      fillOpacity: 0.25
    }).addTo(this.map);
  }

  renderSurge() {
    if (this.mapLayers.surgePolygon) {
      this.map.removeLayer(this.mapLayers.surgePolygon);
      this.mapLayers.surgePolygon = null;
    }

    if (!this.activeLayers.surge) return;

    const isSouth = this.currentBasin.center[0] < 0;
    const surgePoints = this.physics.generateSurgePolygon(
      this.currentStep.eyeCoord,
      this.currentStep.surgeHeightM,
      310,
      isSouth
    );

    this.mapLayers.surgePolygon = L.polygon(surgePoints, {
      color: "#00f0ff",
      weight: 2,
      fillColor: "#0077ff",
      fillOpacity: 0.38,
      dashArray: "3, 5"
    }).addTo(this.map);
  }

  renderGeeRaster() {
    if (this.mapLayers.geeRasterOverlay) {
      this.map.removeLayer(this.mapLayers.geeRasterOverlay);
      this.mapLayers.geeRasterOverlay = null;
    }

    if (!this.activeLayers.gee || this.isLowBandwidthMode) return;

    // Simulate Sentinel-1 SAR flood imagery overlay
    const [cLat, cLng] = this.currentBasin.center;
    const bounds = [
      [cLat - 0.45, cLng - 0.55],
      [cLat + 0.45, cLng + 0.55]
    ];

    this.mapLayers.geeRasterOverlay = L.rectangle(bounds, {
      color: "#00ffaa",
      weight: 1,
      dashArray: "4, 6",
      fillColor: "#00f0ff",
      fillOpacity: 0.15
    }).addTo(this.map);
  }

  renderInfrastructure() {
    this.mapLayers.infraGroup.clearLayers();

    if (!this.activeLayers.infrastructure) return;

    this.exposedAssets.forEach(asset => {
      let pinClass = "pin-safe";
      if (asset.currentStatus.includes("FAIL") || asset.currentStatus.includes("SUBMERG")) {
        pinClass = "pin-critical";
      } else if (asset.currentStatus.includes("CUT") || asset.currentStatus.includes("HIGH") || asset.currentStatus.includes("PARTIAL")) {
        pinClass = "pin-high";
      } else if (asset.currentStatus.includes("PREP") || asset.currentStatus.includes("STOCK") || asset.currentStatus.includes("MONITOR")) {
        pinClass = "pin-warning";
      }

      let iconHtml = '<i class="ti ti-bolt"></i>';
      if (asset.type === "hospital") iconHtml = '<i class="ti ti-building-hospital"></i>';
      if (asset.type === "shelter") iconHtml = '<i class="ti ti-shield"></i>';
      if (asset.type === "road" || asset.type === "bridge") iconHtml = '<i class="ti ti-bridge"></i>';
      if (asset.type === "port" || asset.type === "marine") iconHtml = '<i class="ti ti-anchor"></i>';

      const pinIcon = L.divIcon({
        className: "custom-pin-wrapper",
        html: `<div class="tactical-pin ${pinClass}">${iconHtml}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(asset.coords, { icon: pinIcon })
        .addTo(this.mapLayers.infraGroup)
        .bindPopup(`
          <div style="font-family: 'Outfit', sans-serif; font-size: 13px; color: #000; min-width: 220px;">
            <strong style="font-size: 14px; color: #0f172a;">${asset.name}</strong><br/>
            <span style="display:inline-block; margin: 4px 0; padding: 2px 6px; border-radius: 4px; font-weight: bold; background: #e2e8f0; font-size: 11px;">
              STATUS: ${asset.currentStatus}
            </span><br/>
            <strong>Elevation:</strong> ${asset.elevationM}m MSL<br/>
            <strong>Surge Exposure:</strong> Depth +${asset.inundationDepthM}m<br/>
            <strong>Capacity:</strong> ${asset.capacity}<br/>
            <p style="margin-top: 6px; font-size: 12px; color: #334155;">${asset.impactDescription}</p>
          </div>
        `);
    });
  }

  updateInfrastructureList() {
    const list = document.getElementById("assetSummaryList");
    list.innerHTML = "";

    const assets = this.exposedAssets;
    const threatened = assets.filter(a => !a.currentStatus.includes("NORMAL") && !a.currentStatus.includes("SAFE"));
    document.getElementById("threatCountBadge").textContent = `${threatened.length} At Risk`;

    assets.forEach(asset => {
      let statusClass = "status-safe";
      if (asset.currentStatus.includes("FAIL") || asset.currentStatus.includes("SUBMERG")) {
        statusClass = "status-critical";
      } else if (asset.currentStatus.includes("CUT") || asset.currentStatus.includes("HIGH") || asset.currentStatus.includes("PARTIAL")) {
        statusClass = "status-high";
      } else if (asset.currentStatus.includes("PREP") || asset.currentStatus.includes("MONITOR") || asset.currentStatus.includes("STOCK")) {
        statusClass = "status-warning";
      }

      const item = document.createElement("div");
      item.className = "asset-list-item";
      item.innerHTML = `
        <div class="asset-item-top">
          <span class="asset-name" title="${asset.name}">${asset.name}</span>
          <span class="asset-status-pill ${statusClass}">${asset.currentStatus}</span>
        </div>
        <div class="asset-desc">${asset.impactDescription}</div>
      `;

      item.addEventListener("click", () => {
        this.map.flyTo(asset.coords, 12, { duration: 1.2 });
      });

      list.appendChild(item);
    });
  }

  async triggerGeminiAnalysis() {
    const loader = document.getElementById("geminiLoader");
    const content = document.getElementById("geminiContent");

    loader.classList.remove("hidden");
    content.innerHTML = "";

    const result = await this.gemini.runMultimodalAnalysis(
      this.currentBasin,
      this.currentStep,
      this.exposedAssets,
      this.activeLayers.gee
    );

    loader.classList.add("hidden");

    // Convert Markdown-style syntax to clean HTML
    let formatted = result.analysis
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n-/g, "<br/>•");

    content.innerHTML = `
      <div style="font-size: 0.68rem; color: #00f0ff; font-family: var(--text-mono); margin-bottom: 8px;">
        ENGINE: ${result.source} | ${result.timestamp}
      </div>
      <p>${formatted}</p>
    `;
  }

  updateAdvisoryDisplay(langKey) {
    const adv = this.dispatcher.getAdvisories(this.currentBasinKey, this.currentStep, langKey);
    const data = adv.data;

    document.getElementById("advisorySource").textContent = data.source;
    document.getElementById("advisoryTitle").textContent = data.title;
    document.getElementById("advisoryMessage").textContent = data.message;

    document.getElementById("statSms").textContent = data.channelStats.smsCount;
    document.getElementById("statRadio").textContent = data.channelStats.radio;
    document.getElementById("statVoice").textContent = data.channelStats.voiceCall;
  }

  toggleAudioBroadcast() {
    const btn = document.getElementById("btnPlayAudio");
    const wave = document.getElementById("audioWaveform");
    const langSelect = document.getElementById("advisoryLangSelect");

    if (this.dispatcher.isPlayingAudio) {
      this.dispatcher.stopSpeaking();
      document.getElementById("audioIcon").innerHTML = '<i class="ti ti-volume"></i>';
      document.getElementById("audioText").textContent = "Voice Warning";
      wave.classList.add("hidden");
    } else {
      const adv = this.dispatcher.getAdvisories(this.currentBasinKey, this.currentStep, langSelect.value);
      const textToSpeak = `${adv.data.title}. ${adv.data.message}`;

      document.getElementById("audioIcon").innerHTML = '<i class="ti ti-player-stop"></i>';
      document.getElementById("audioText").textContent = "Stop Broadcast";
      wave.classList.remove("hidden");

      this.dispatcher.speakAdvisory(textToSpeak, adv.data.langCode, () => {
        document.getElementById("audioIcon").innerHTML = '<i class="ti ti-volume"></i>';
        document.getElementById("audioText").textContent = "Voice Warning";
        wave.classList.add("hidden");
      });
    }
  }

  generateSitrepDownload() {
    const analysisText = document.getElementById("geminiContent").innerText || "Initial Spatial Diagnostics Pending";
    const report = this.reporter.generateSitrep(
      this.currentBasin,
      this.currentStep,
      this.exposedAssets,
      analysisText
    );
    const filename = `Aegis_${this.currentBasin.country}_${this.currentStep.step}_SITREP.txt`;
    this.reporter.downloadReport(report, filename);
  }

  // Populate and render National Systems & Global CAP Gateway modal
  populateNationalSystemsModal() {
    const profile = this.nationalAdapter.getProfile(this.currentBasinKey);
    const langSelect = document.getElementById("advisoryLangSelect");
    const activeLang = langSelect ? langSelect.value : "default";
    const adv = this.dispatcher.getAdvisories(this.currentBasinKey, this.currentStep, activeLang, this.currentBasin);

    // Update Subtitle and Specification Cards
    document.getElementById("natSysCountrySubtitle").textContent = 
      `Configured for ${profile.countryName} (${profile.agencyAcronym}) · ITU-T X.1303 & OASIS CAP v1.2 Compliant`;
    document.getElementById("specAgency").textContent = profile.agencyName;
    document.getElementById("specCapStd").textContent = `Standard: ${profile.capStandard}`;
    document.getElementById("specCellBroadcast").textContent = `${profile.cellBroadcast.standard} — ${profile.cellBroadcast.primaryChannel}`;
    document.getElementById("specCbStatus").textContent = profile.cellBroadcast.status;
    document.getElementById("specMarineVhf").textContent = `${profile.marineVHF.primaryEmergencyChannel} (GMDSS ${profile.marineVHF.gmdssSeaArea})`;
    document.getElementById("specNavtex").textContent = `NAVTEX: ${profile.marineVHF.navtexStation}`;
    document.getElementById("specHotlines").textContent = `Unified: ${profile.emergencyHotlines.unified} · EOC: ${profile.emergencyHotlines.disasterSpecific}`;
    document.getElementById("specDatum").textContent = `National Datum: ${profile.spatialDatum}`;

    // Generate OASIS CAP v1.2 XML
    const capXml = this.nationalAdapter.generateCapXml({
      basin: this.currentBasin,
      timeStep: this.currentStep,
      exposedAssets: this.exposedAssets,
      advisory: adv.data
    });
    document.getElementById("capXmlPreview").textContent = capXml;

    // Generate Tactical Satcom / Low-Bandwidth Packet
    const satcomPacket = this.nationalAdapter.getCompactSatcomPacket(
      this.currentBasin,
      this.currentStep,
      this.exposedAssets
    );
    document.getElementById("satcomPacketPreview").value = satcomPacket;
  }

  downloadCapXml() {
    const capXml = document.getElementById("capXmlPreview").textContent;
    const blob = new Blob([capXml], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAP1.2_${this.currentBasin.country}_${this.currentStep.step}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  copyCapJson() {
    const langSelect = document.getElementById("advisoryLangSelect");
    const activeLang = langSelect ? langSelect.value : "default";
    const adv = this.dispatcher.getAdvisories(this.currentBasinKey, this.currentStep, activeLang, this.currentBasin);
    const capJson = this.nationalAdapter.generateCapJson({
      basin: this.currentBasin,
      timeStep: this.currentStep,
      exposedAssets: this.exposedAssets,
      advisory: adv.data
    });
    navigator.clipboard.writeText(JSON.stringify(capJson, null, 2)).then(() => {
      alert("OASIS CAP v1.2 JSON payload copied to clipboard for API gateway injection!");
    });
  }

  copySatcomPacket() {
    const packet = document.getElementById("satcomPacketPreview").value;
    navigator.clipboard.writeText(packet).then(() => {
      alert("Tactical HF/Satcom telemetry packet (<1.2 KB) copied to clipboard!");
    });
  }

  toggleBandwidthMode() {
    this.isLowBandwidthMode = !this.isLowBandwidthMode;
    const label = document.getElementById("bandwidthModeLabel");
    if (this.isLowBandwidthMode) {
      label.textContent = "Net: Satcom Low-BW";
      label.parentElement.classList.add("active");
      this.renderGeeRaster();
      alert("Switched to Low-Bandwidth / Satcom Mode: Suppressed high-resolution raster tile ingestion to conserve tactical satellite data.");
    } else {
      label.textContent = "Net: Adaptive";
      label.parentElement.classList.remove("active");
      this.renderGeeRaster();
      alert("Switched to Adaptive Broadband Mode: Full GIS raster simulation restored.");
    }
  }

  handleGeoJsonUpload(file) {
    const statusMsg = document.getElementById("importStatusMsg");
    statusMsg.className = "import-status-msg";
    statusMsg.textContent = "Parsing and validating GeoJSON scenario structure...";
    statusMsg.classList.remove("hidden");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const importedBasin = this.nationalAdapter.importCustomBasinFromGeoJson(parsed);
        this.customBasins[importedBasin.id] = importedBasin;

        // Add to coastal basin dropdown if not already present
        const basinSelect = document.getElementById("basinSelect");
        let existingOpt = Array.from(basinSelect.options).find(opt => opt.value === importedBasin.id);
        if (!existingOpt) {
          const opt = document.createElement("option");
          opt.value = importedBasin.id;
          opt.textContent = `${importedBasin.flag || "🌐"} ${importedBasin.country} — ${importedBasin.basinName} (${importedBasin.stormName.split(" ")[0]})`;
          basinSelect.appendChild(opt);
        }
        basinSelect.value = importedBasin.id;

        // Switch to the newly imported country scenario
        this.loadBasin(importedBasin.id);

        statusMsg.className = "import-status-msg success";
        statusMsg.textContent = `✓ Successfully deployed Aegis to ${importedBasin.country}! Loaded ${importedBasin.infrastructure.length} critical infrastructure assets into tactical GIS.`;
      } catch (err) {
        console.error("GeoJSON import failure:", err);
        statusMsg.className = "import-status-msg error";
        statusMsg.textContent = `✗ Failed to import scenario: ${err.message}`;
      }
    };
    reader.readAsText(file);
  }
}

// Bootstrap Application on DOM load
window.addEventListener("DOMContentLoaded", () => {
  new AegisApp();
});
