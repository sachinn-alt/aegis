// Aegis - Main Application Controller
// Orchestrates Leaflet GIS, GEE Simulation, Gemini 3.7 Flash, and Advisory Dispatcher

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { BRICS_BASINS } from "./data/brics_scenarios.js";
import { SurgePhysicsEngine } from "./engine/surge_physics.js";
import { GeminiReasoningEngine } from "./engine/gemini_reasoning.js";
import { AdvisoryDispatcher } from "./engine/advisory_dispatcher.js";
import { ReportGenerator } from "./engine/report_generator.js";

class AegisApp {
  constructor() {
    this.currentBasinKey = "india";
    this.currentStepIdx = 2; // Default to T-24h (Critical pre-landfall window)
    this.isPlaying = false;
    this.playInterval = null;

    this.activeLayers = {
      track: true,
      cone: true,
      surge: true,
      gee: true,
      infrastructure: true
    };

    // Engines
    this.physics = new SurgePhysicsEngine();
    this.gemini = new GeminiReasoningEngine();
    this.dispatcher = new AdvisoryDispatcher();
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
    return BRICS_BASINS[this.currentBasinKey] || BRICS_BASINS.india;
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

    // CartoDB Dark Matter Basemap
    this.mapLayers.base = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
        subdomains: "abcd"
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
      document.getElementById("playIcon").textContent = "▶";
      document.getElementById("playText").textContent = "Auto-Simulate";
    } else {
      this.isPlaying = true;
      document.getElementById("playIcon").textContent = "⏸";
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
    document.getElementById("headerStatusText").textContent = `ALERT LEVEL: ${step.alertLevel} — ${step.status}`;

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

    if (!this.activeLayers.gee) return;

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

      let iconChar = "⚡";
      if (asset.type === "hospital") iconChar = "🏥";
      if (asset.type === "shelter") iconChar = "🛡️";
      if (asset.type === "road" || asset.type === "bridge") iconChar = "🌉";

      const pinIcon = L.divIcon({
        className: "custom-pin-wrapper",
        html: `<div class="tactical-pin ${pinClass}">${iconChar}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
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
      document.getElementById("audioIcon").textContent = "🔊";
      document.getElementById("audioText").textContent = "Play Voice Warning";
      wave.classList.add("hidden");
    } else {
      const adv = this.dispatcher.getAdvisories(this.currentBasinKey, this.currentStep, langSelect.value);
      const textToSpeak = `${adv.data.title}. ${adv.data.message}`;

      document.getElementById("audioIcon").textContent = "⏹";
      document.getElementById("audioText").textContent = "Stop Broadcast";
      wave.classList.remove("hidden");

      this.dispatcher.speakAdvisory(textToSpeak, adv.data.langCode, () => {
        document.getElementById("audioIcon").textContent = "🔊";
        document.getElementById("audioText").textContent = "Play Voice Warning";
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
}

// Bootstrap Application on DOM load
window.addEventListener("DOMContentLoaded", () => {
  new AegisApp();
});
