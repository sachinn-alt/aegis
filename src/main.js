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
import { IncidentTriageEngine, IncidentPriority } from "./engine/incident_triage.js";
import { ResourceTracker, ResourceCategory, ResourceStatus } from "./engine/resource_tracker.js";
import { InterAgencyLogger } from "./engine/interagency_log.js";
import { LiveStreamEngine } from "./engine/live_stream.js";

class AegisApp {
  constructor() {
    this.currentBasinKey = "india";
    this.currentStepIdx = 2; // Default to T-24h (Critical pre-landfall window)
    this.isPlaying = false;
    this.playInterval = null;
    this.customBasins = {};
    this.isLowBandwidthMode = false;
    this.isLeftCollapsed = false;
    this.isRightCollapsed = false;
    this.isHighContrast = false;
    this.liveAlertTimer = null;

    this.activeLayers = {
      liveRadar: false,
      liveSatellite: false,
      nasaHd: false,
      infrared: false,
      firms: false,
      windStreamlines: false,
      track: true,
      cone: true,
      surge: true,
      gee: false,
      infrastructure: true,
      highways: true
    };

    // Basemaps (Esri Tactical Dark, Esri Light, Real Satellite Imagery, Topographic)
    this.currentBasemap = "dark";
    this.basemaps = {
      dark: {
        base: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        labels: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        maxNativeZoom: 16,
        maxZoom: 19,
        attribution: "Tiles &copy; Esri Dark Gray"
      },
      light: {
        base: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        labels: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        maxNativeZoom: 16,
        maxZoom: 19,
        attribution: "Tiles &copy; Esri Light Gray"
      },
      satellite: {
        base: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        labels: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        maxNativeZoom: 18,
        maxZoom: 19,
        attribution: "Source: Esri, Maxar, Earthstar Geographics"
      },
      topo: {
        base: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        labels: null,
        maxNativeZoom: 16,
        maxZoom: 19,
        attribution: "Tiles &copy; Esri Topo"
      }
    };

    // Engines
    this.nationalAdapter = new NationalSystemAdapter();
    this.physics = new SurgePhysicsEngine();
    this.gemini = new GeminiReasoningEngine();
    this.dispatcher = new AdvisoryDispatcher(this.nationalAdapter);
    this.reporter = new ReportGenerator();
    this.triage = new IncidentTriageEngine();
    this.resources = new ResourceTracker();
    this.logger = new InterAgencyLogger();
    this.liveStream = new LiveStreamEngine({ intervalMs: 11000 });

    // Map & Layer References
    this.map = null;
    this.mapLayers = {
      base: null,
      labels: null,
      trackPolyline: null,
      eyeMarker: null,
      conePolygon: null,
      surgePolygon: null,
      geeRasterOverlay: null,
      liveRadarOverlay: null,
      liveSatelliteOverlay: null,
      nasaHdOverlay: null,
      infraredOverlay: null,
      firmsOverlay: null,
      windCanvasLayer: null,
      highwaysGroup: L.layerGroup(),
      infraGroup: L.layerGroup()
    };
    this.windAnimFrame = null;
    this._windCanvas = null;

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
    this.initAnimatedFavicon();
    this.initMap();
    this.bindEvents();
    this.initOfflineHandling();
    this.initLiveStream();
    this.initUserPreferences();
    this.syncLayerCheckboxUI();
    this.loadBasin(this.currentBasinKey);
  }

  /**
   * Continuous Tab Favicon Animator:
   * Drives live rotation of the cyclone vortex and radar pulses in the browser tab
   * across Chromium, Firefox, Edge, and Safari.
   */
  initAnimatedFavicon() {
    let faviconLink = document.querySelector("link[rel*='icon']");
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    let pulse = 0;

    const renderFaviconFrame = () => {
      ctx.clearRect(0, 0, 32, 32);

      // Dark tactical container background
      ctx.fillStyle = "#070a12";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, 32, 32, 7);
      } else {
        ctx.rect(0, 0, 32, 32);
      }
      ctx.fill();

      // Outer radar dashed rotating ring (counter-clockwise)
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(-angle * 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, 13.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.restore();

      // Inner radar ring
      ctx.beginPath();
      ctx.arc(16, 16, 9.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 119, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();

      // Rotating Cyclone Spiral Arms (Clockwise)
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(angle);

      const grad = ctx.createLinearGradient(-10, -10, 10, 10);
      grad.addColorStop(0, "#00f0ff");
      grad.addColorStop(0.5, "#0077ff");
      grad.addColorStop(1, "#ff2a5f");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";

      // Outer Spiral Arm
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0.2, Math.PI * 1.35, false);
      ctx.stroke();

      // Inner Spiral Arm
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, Math.PI, Math.PI * 2.3, false);
      ctx.stroke();
      ctx.restore();

      // Pulsing Center Storm Eye
      const eyeR = 2.2 + Math.sin(pulse) * 0.7;
      ctx.fillStyle = "#ff2a5f";
      ctx.beginPath();
      ctx.arc(16, 16, Math.max(1.4, eyeR), 0, Math.PI * 2);
      ctx.fill();

      faviconLink.type = "image/png";
      faviconLink.href = canvas.toDataURL("image/png");

      angle += 0.14;
      pulse += 0.2;
    };

    // Keep animation running smoothly at ~12 FPS
    setInterval(renderFaviconFrame, 80);
  }

  /**
   * Tactical Offline Telemetry & Satellite Recovery System
   * Runs animated radar sweep HUD when network interface drops offline
   */
  initOfflineHandling() {
    this.isOfflineMode = false;
    this.offlineStartTime = null;
    this.offlineTimerInterval = null;
    this.offlineRadarAnimFrame = null;
    this.offlineRadarAngle = 0;

    // Listen to network transitions
    window.addEventListener("offline", () => {
      this.handleNetworkChange(false);
    });

    window.addEventListener("online", () => {
      this.handleNetworkChange(true);
    });

    // Check if initial boot is offline or forced via ?offline=1
    const urlParams = new URLSearchParams(window.location.search);
    if (!navigator.onLine || urlParams.get("offline") === "1") {
      setTimeout(() => this.handleNetworkChange(false), 500);
    }

    // Modal controls
    const offlineOverlay = document.getElementById("offlineOverlay");
    const offlineHeaderPill = document.getElementById("offlineHeaderPill");
    const btnDismissOffline = document.getElementById("btnDismissOffline");
    const btnCloseOfflineModal = document.getElementById("btnCloseOfflineModal");
    const btnRetryUplink = document.getElementById("btnRetryUplink");

    if (offlineHeaderPill) {
      offlineHeaderPill.addEventListener("click", () => {
        if (offlineOverlay) {
          offlineOverlay.classList.remove("hidden");
          this.startOfflineRadarAnimation();
        }
      });
    }

    if (btnDismissOffline && offlineOverlay) {
      btnDismissOffline.addEventListener("click", () => {
        offlineOverlay.classList.add("hidden");
        this.stopOfflineRadarAnimation();
      });
    }

    if (btnCloseOfflineModal && offlineOverlay) {
      btnCloseOfflineModal.addEventListener("click", () => {
        offlineOverlay.classList.add("hidden");
        this.stopOfflineRadarAnimation();
      });
    }

    if (btnRetryUplink) {
      btnRetryUplink.addEventListener("click", async () => {
        const textSpan = document.getElementById("retryUplinkText");
        if (textSpan) textSpan.textContent = "Testing Uplink...";
        btnRetryUplink.disabled = true;

        const startTime = performance.now();
        try {
          const res = await fetch("/favicon.svg?t=" + Date.now(), { cache: "no-store", method: "HEAD" });
          const latency = Math.round(performance.now() - startTime);
          if (res.ok) {
            if (textSpan) textSpan.textContent = `Uplink OK (${latency}ms)`;
            setTimeout(() => this.handleNetworkChange(true), 600);
          } else {
            throw new Error("HTTP drop");
          }
        } catch (e) {
          if (textSpan) textSpan.textContent = "Uplink Failed (Offline)";
          const carrier = document.getElementById("offlineCarrierVal");
          if (carrier) {
            carrier.className = "cell-val text-danger";
            carrier.textContent = "SEVERED (NO CARRIER)";
          }
        } finally {
          setTimeout(() => {
            if (textSpan) textSpan.textContent = "Test Uplink";
            btnRetryUplink.disabled = false;
          }, 2500);
        }
      });
    }

    // Keyboard Shortcut: Ctrl+Shift+O to toggle simulated satcom blackout mode for testing
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "O" || e.key === "o")) {
        e.preventDefault();
        this.handleNetworkChange(!this.isOfflineMode);
      }
    });
  }

  handleNetworkChange(isOnline) {
    this.isOfflineMode = !isOnline;
    const overlay = document.getElementById("offlineOverlay");
    const headerPill = document.getElementById("offlineHeaderPill");
    const sweepLabel = document.getElementById("offlineSweepLabel");
    const carrierVal = document.getElementById("offlineCarrierVal");
    const durationEl = document.getElementById("offlineDuration");

    if (!isOnline) {
      // Transition to OFFLINE mode
      if (headerPill) headerPill.classList.remove("hidden");
      if (overlay) overlay.classList.remove("hidden");

      if (carrierVal) {
        carrierVal.className = "cell-val text-danger";
        carrierVal.textContent = "SEVERED (-92 dBm)";
      }
      if (sweepLabel) sweepLabel.textContent = "SCANNING SATELLITE CONSTELLATIONS...";

      this.offlineStartTime = Date.now();
      if (this.offlineTimerInterval) clearInterval(this.offlineTimerInterval);
      this.offlineTimerInterval = setInterval(() => {
        if (!this.offlineStartTime || !durationEl) return;
        const elapsedSec = Math.floor((Date.now() - this.offlineStartTime) / 1000);
        const hrs = String(Math.floor(elapsedSec / 3600)).padStart(2, "0");
        const mins = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, "0");
        const secs = String(elapsedSec % 60).padStart(2, "0");
        durationEl.textContent = `BLACKOUT: ${hrs}:${mins}:${secs}`;
      }, 1000);

      this.startOfflineRadarAnimation();
    } else {
      // Transition to ONLINE mode
      if (sweepLabel) sweepLabel.textContent = "SATELLITE TELEMETRY RESTORED // SYNCHRONIZED";
      if (carrierVal) {
        carrierVal.className = "cell-val text-success";
        carrierVal.textContent = "RE-ACQUIRED (ONLINE)";
      }

      if (this.offlineTimerInterval) {
        clearInterval(this.offlineTimerInterval);
        this.offlineTimerInterval = null;
      }

      // Briefly display acquired status before closing
      setTimeout(() => {
        if (overlay) overlay.classList.add("hidden");
        if (headerPill) headerPill.classList.add("hidden");
        this.stopOfflineRadarAnimation();
      }, 1200);
    }
  }

  startOfflineRadarAnimation() {
    const canvas = document.getElementById("offlineRadarCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    this.stopOfflineRadarAnimation();

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = w / 2 - 8;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // 1. Range rings
      [0.3, 0.6, 1.0].forEach(frac => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * frac, 0, Math.PI * 2);
        ctx.strokeStyle = frac === 1.0 ? "rgba(0, 240, 255, 0.5)" : "rgba(0, 240, 255, 0.18)";
        ctx.lineWidth = frac === 1.0 ? 1.5 : 1;
        ctx.stroke();
      });

      // 2. Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Rotating sweep beam
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(this.offlineRadarAngle);

      const sweepSteps = 30;
      for (let i = 0; i < sweepSteps; i++) {
        const segAngle = -(i / sweepSteps) * (Math.PI / 3);
        const alpha = (1 - i / sweepSteps) * 0.32;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, segAngle, segAngle + (Math.PI / (3 * sweepSteps)));
        ctx.fillStyle = this.isOfflineMode ? `rgba(255, 48, 0, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      }

      // Sweep arm
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r, 0);
      ctx.strokeStyle = this.isOfflineMode ? "#FF3000" : "#00f0ff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Lost Satellite Blip
      const blipX = cx + Math.cos(1.2) * (r * 0.62);
      const blipY = cy + Math.sin(1.2) * (r * 0.62);
      ctx.beginPath();
      ctx.arc(blipX, blipY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = this.isOfflineMode ? "#FF3000" : "#00f0ff";
      ctx.fill();

      // Pulsing beacon ring
      const ringR = 4 + (Date.now() % 1200) / 75;
      const ringAlpha = Math.max(0, 1 - ringR / 20);
      ctx.beginPath();
      ctx.arc(blipX, blipY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = this.isOfflineMode ? `rgba(255, 48, 0, ${ringAlpha})` : `rgba(0, 240, 255, ${ringAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      this.offlineRadarAngle += 0.042;
      this.offlineRadarAnimFrame = requestAnimationFrame(render);
    };

    render();
  }

  stopOfflineRadarAnimation() {
    if (this.offlineRadarAnimFrame) {
      cancelAnimationFrame(this.offlineRadarAnimFrame);
      this.offlineRadarAnimFrame = null;
    }
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

    // Initialize Default Basemap (Tactical Dark)
    this.switchBasemap(this.currentBasemap);

    this.mapLayers.highwaysGroup.addTo(this.map);
    this.mapLayers.infraGroup.addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  bindEvents() {
    // Basin Dropdown
    const basinSelect = document.getElementById("basinSelect");
    basinSelect.addEventListener("change", (e) => {
      this.loadBasin(e.target.value);
    });

    // Basemap Switcher Buttons on Map (Dark, Satellite, Topo)
    document.querySelectorAll(".btn-basemap-option").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const type = e.currentTarget.getAttribute("data-basemap");
        this.switchBasemap(type);
      });
    });

    // Layer Presets
    document.querySelectorAll(".btn-preset").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const preset = e.currentTarget.getAttribute("data-preset");
        document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.applyLayerPreset(preset);
      });
    });

    // Map Legend Collapse Toggle
    const btnToggleLegend = document.getElementById("btnToggleLegend");
    const mapLegendOverlay = document.getElementById("mapLegendOverlay");
    if (btnToggleLegend && mapLegendOverlay) {
      btnToggleLegend.addEventListener("click", () => {
        mapLegendOverlay.classList.toggle("collapsed");
      });
    }

    // Unified Layer Checkbox Event Listeners
    const layerConfigs = [
      ["layerTrack", "track", () => this.renderTrack()],
      ["layerCone", "cone", () => this.renderCone()],
      ["layerSurge", "surge", () => this.renderSurge()],
      ["layerHighways", "highways", () => this.renderHighways()],
      ["layerInfrastructure", "infrastructure", () => this.renderInfrastructure()],
      ["layerGee", "gee", () => this.renderGeeRaster()],
      ["layerLiveRadar", "liveRadar", () => this.renderLiveRadar()],
      ["layerLiveSatellite", "liveSatellite", () => this.renderLiveSatellite()],
      ["layerNasaHd", "nasaHd", () => this.renderNasaHd()],
      ["layerInfrared", "infrared", () => this.renderInfrared()],
      ["layerFirms", "firms", () => this.renderFirms()],
      ["layerWindStreamlines", "windStreamlines", () => this.renderWindStreamlines()]
    ];

    layerConfigs.forEach(([id, prop, fn]) => {
      const cb = document.getElementById(id);
      if (cb) {
        cb.checked = !!this.activeLayers[prop];
        cb.addEventListener("change", (e) => {
          this.activeLayers[prop] = e.target.checked;
          fn();
        });
      }
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

    // EOC Report Center Modal & Export Actions
    const reportModal = document.getElementById("reportModal");
    document.getElementById("btnSitrep").addEventListener("click", () => {
      reportModal.classList.remove("hidden");
    });
    document.getElementById("btnCloseReportModal").addEventListener("click", () => {
      reportModal.classList.add("hidden");
    });
    document.getElementById("btnCloseReportModalFooter").addEventListener("click", () => {
      reportModal.classList.add("hidden");
    });

    document.getElementById("btnExportPrintPdf").addEventListener("click", () => {
      this.exportPrintableSitrep();
    });
    document.getElementById("btnExportTextSitrep").addEventListener("click", () => {
      this.generateSitrepDownload();
    });
    document.getElementById("btnExportCsvLedger").addEventListener("click", () => {
      this.exportCsvAuditLedger();
    });

    // API Key Modal Controls (Optional / Headless API key support)
    const apiKeyModal = document.getElementById("apiKeyModal");
    const btnApiKey = document.getElementById("btnApiKey");
    if (btnApiKey && apiKeyModal) {
      btnApiKey.addEventListener("click", () => {
        document.getElementById("inputApiKey").value = this.gemini.apiKey || "";
        apiKeyModal.classList.remove("hidden");
      });
      const btnCloseModal = document.getElementById("btnCloseModal");
      if (btnCloseModal) {
        btnCloseModal.addEventListener("click", () => apiKeyModal.classList.add("hidden"));
      }
      const btnSaveApiKey = document.getElementById("btnSaveApiKey");
      if (btnSaveApiKey) {
        btnSaveApiKey.addEventListener("click", () => {
          const key = document.getElementById("inputApiKey").value.trim();
          this.gemini.setApiKey(key);
          apiKeyModal.classList.add("hidden");
        });
      }
      const btnClearApiKey = document.getElementById("btnClearApiKey");
      if (btnClearApiKey) {
        btnClearApiKey.addEventListener("click", () => {
          this.gemini.setApiKey("");
          document.getElementById("inputApiKey").value = "";
          apiKeyModal.classList.add("hidden");
        });
      }
    }

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
    document.getElementById("btnDownloadIcs214").addEventListener("click", () => {
      this.downloadIcs214();
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

    // Sidebar Collapse / Expand Toggles (Full COP)
    const btnToggleLeft = document.getElementById("btnToggleLeftPanel");
    if (btnToggleLeft) {
      btnToggleLeft.addEventListener("click", () => this.toggleLeftPanel());
    }
    const btnExpandLeft = document.getElementById("btnExpandLeft");
    if (btnExpandLeft) {
      btnExpandLeft.addEventListener("click", () => this.toggleLeftPanel());
    }

    const btnToggleRight = document.getElementById("btnToggleRightPanel");
    if (btnToggleRight) {
      btnToggleRight.addEventListener("click", () => this.toggleRightPanel());
    }
    const btnExpandRight = document.getElementById("btnExpandRight");
    if (btnExpandRight) {
      btnExpandRight.addEventListener("click", () => this.toggleRightPanel());
    }

    const btnCopFocus = document.getElementById("btnCopFocus");
    if (btnCopFocus) {
      btnCopFocus.addEventListener("click", () => this.toggleFullCop());
    }

    // Micro-Data Accordion Toggle (Asset Exposure)
    const btnToggleAssetAccordion = document.getElementById("btnToggleAssetAccordion");
    if (btnToggleAssetAccordion) {
      btnToggleAssetAccordion.addEventListener("click", () => this.toggleAssetAccordion());
    }

    // High-Contrast Bunker / Generator Mode Toggle
    const btnToggleHighContrast = document.getElementById("btnToggleHighContrast");
    if (btnToggleHighContrast) {
      btnToggleHighContrast.addEventListener("click", () => this.toggleHighContrast());
    }

    // Live Stream Alert Banner Controls
    const btnAckLiveAlert = document.getElementById("btnAckLiveAlert");
    if (btnAckLiveAlert) {
      btnAckLiveAlert.addEventListener("click", () => this.dismissLiveAlert());
    }

    const btnToggleStreamAudio = document.getElementById("btnToggleStreamAudio");
    if (btnToggleStreamAudio) {
      btnToggleStreamAudio.addEventListener("click", () => this.toggleStreamAudio());
    }
  }

  syncLayerCheckboxUI() {
    const mapping = {
      layerTrack: "track",
      layerCone: "cone",
      layerSurge: "surge",
      layerWindStreamlines: "windStreamlines",
      layerInfrastructure: "infrastructure",
      layerHighways: "highways",
      layerGee: "gee",
      layerLiveRadar: "liveRadar",
      layerLiveSatellite: "liveSatellite",
      layerNasaHd: "nasaHd",
      layerInfrared: "infrared",
      layerFirms: "firms"
    };
    Object.entries(mapping).forEach(([elId, key]) => {
      const el = document.getElementById(elId);
      if (el) el.checked = !!this.activeLayers[key];
    });
  }

  applyLayerPreset(preset) {
    if (preset === "hazards") {
      this.activeLayers.track = true;
      this.activeLayers.surge = true;
      this.activeLayers.cone = true;
      this.activeLayers.windStreamlines = true;
      this.activeLayers.highways = true;
      this.activeLayers.infrastructure = true;
      this.activeLayers.gee = false;
      this.activeLayers.liveRadar = false;
      this.activeLayers.liveSatellite = false;
      this.activeLayers.nasaHd = false;
      this.activeLayers.infrared = false;
      this.activeLayers.firms = false;
    } else if (preset === "satellite") {
      this.activeLayers.track = true;
      this.activeLayers.surge = false;
      this.activeLayers.cone = false;
      this.activeLayers.windStreamlines = false;
      this.activeLayers.highways = false;
      this.activeLayers.infrastructure = false;
      this.activeLayers.gee = true;
      this.activeLayers.liveRadar = true;
      this.activeLayers.liveSatellite = true;
      this.activeLayers.nasaHd = false;
      this.activeLayers.infrared = false;
      this.activeLayers.firms = false;
    } else if (preset === "all") {
      Object.keys(this.activeLayers).forEach(k => this.activeLayers[k] = true);
    } else if (preset === "clear") {
      Object.keys(this.activeLayers).forEach(k => this.activeLayers[k] = false);
      this.activeLayers.track = true;
    }

    this.syncLayerCheckboxUI();
    this.renderAllMapLayers();
  }

  renderAllMapLayers() {
    this.renderTrack();
    this.renderCone();
    this.renderSurge();
    this.renderHighways();
    this.renderInfrastructure();
    this.renderGeeRaster();
    this.renderLiveRadar();
    this.renderLiveSatellite();
    this.renderNasaHd();
    this.renderInfrared();
    this.renderFirms();
    this.renderWindStreamlines();
  }

  loadBasin(basinKey) {
    this.currentBasinKey = basinKey;
    const basin = this.currentBasin;

    // Seed backend engines for this basin
    this.triage.seedBasinIncidents(basinKey);
    this.resources.seedBasinResources(basinKey);
    this.logger.seedBasinLogs(basinKey);

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

    // Restart live telemetry stream for this basin scenario (Automated SSE pipeline)
    if (this.liveStream) {
      this.liveStream.disconnect();
      this.liveStream.connect(basin, this.currentStep);
    }
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
    } else {
      this.isPlaying = true;
      document.getElementById("playIcon").innerHTML = '<i class="ti ti-player-pause"></i>';

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
    this.renderLiveRadar();
    this.renderLiveSatellite();
    this.renderNasaHd();
    this.renderInfrared();
    this.renderFirms();
    this.renderWindStreamlines();
    this.renderHighways();
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
      color: "#FF3000",
      weight: 3,
      opacity: 1.0,
      dashArray: "4, 6"
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
        <div style="font-family: var(--font-swiss); font-size: 12px; color: #000000; min-width: 190px; text-transform: uppercase;">
          <div style="font-size: 10px; font-weight: 900; color: #FF3000; letter-spacing: 0.08em; margin-bottom: 2px;">01. CYCLONE TELEMETRY</div>
          <strong style="font-size: 15px; font-weight: 900; color: #000000; letter-spacing: -0.02em;">${this.currentBasin.stormName}</strong>
          <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #000000; font-family: var(--text-mono); font-size: 11px;">
            <div><strong>HORIZON:</strong> ${this.currentStep.label}</div>
            <div><strong>WINDS:</strong> ${this.currentStep.maxWindSpeedKmph} KM/H</div>
            <div><strong>SURGE:</strong> ${this.currentStep.surgeHeightM}M</div>
            <div><strong>PRESSURE:</strong> ${this.currentStep.centralPressureHpa} HPA</div>
          </div>
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
      color: "#ff9100",
      weight: 1.5,
      dashArray: "5, 4",
      fillColor: "#ff9100",
      fillOpacity: 0.12
    }).addTo(this.map)
      .bindPopup(`
        <div style="font-family: var(--font-swiss); font-size: 11px; text-transform: uppercase;">
          <div style="font-size: 9px; font-weight: 900; color: #ff9100; margin-bottom: 2px;">WIND SWATH CONE OF UNCERTAINTY</div>
          <strong>RADIUS: ${this.currentStep.coneRadiusKm} KM</strong>
          <div style="margin-top: 4px; font-family: var(--text-mono); font-size: 10px; color: #444;">
            <div>Threshold: Sustained Gale-Force (>63 km/h)</div>
          </div>
        </div>
      `);
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
      color: "#ff2a5f",
      weight: 1.8,
      fillColor: "#ff2a5f",
      fillOpacity: 0.22,
      dashArray: "5, 4"
    }).addTo(this.map)
      .bindPopup(`
        <div style="font-family: var(--font-swiss); font-size: 11px; text-transform: uppercase;">
          <div style="font-size: 9px; font-weight: 900; color: #ff2a5f; margin-bottom: 2px;">COASTAL STORM SURGE INUNDATION</div>
          <strong>PEAK SURGE HEIGHT: +${this.currentStep.surgeHeightM}M MSL</strong>
          <div style="margin-top: 4px; font-family: var(--text-mono); font-size: 10px; color: #444;">
            <div>Hydrodynamic Surge Risk: Severe Inundation</div>
          </div>
        </div>
      `);
  }

  renderGeeRaster() {
    if (this.mapLayers.geeRasterOverlay) {
      this.map.removeLayer(this.mapLayers.geeRasterOverlay);
      this.mapLayers.geeRasterOverlay = null;
    }

    if (!this.activeLayers.gee || this.isLowBandwidthMode) return;

    // High-Fidelity Sentinel-1 SAR Coastal Flood Inundation Multi-Polygons
    const [cLat, cLng] = this.currentBasin.center;
    const floodPolygons = [
      // Estuary Delta Inundation Sector 1
      [
        [cLat + 0.08, cLng - 0.22],
        [cLat + 0.18, cLng - 0.12],
        [cLat + 0.12, cLng + 0.04],
        [cLat - 0.02, cLng + 0.14],
        [cLat - 0.14, cLng + 0.08],
        [cLat - 0.08, cLng - 0.10]
      ],
      // Lowland Tidal Flats Inundation Sector 2
      [
        [cLat - 0.24, cLng - 0.15],
        [cLat - 0.18, cLng - 0.02],
        [cLat - 0.28, cLng + 0.06],
        [cLat - 0.35, cLng - 0.08]
      ],
      // Coastal Estuary Inundation Sector 3
      [
        [cLat + 0.22, cLng - 0.05],
        [cLat + 0.30, cLng + 0.08],
        [cLat + 0.24, cLng + 0.16],
        [cLat + 0.15, cLng + 0.06]
      ]
    ];

    const group = L.layerGroup();
    floodPolygons.forEach((polyPoints, idx) => {
      const poly = L.polygon(polyPoints, {
        color: "#00f0ff",
        weight: 1.5,
        dashArray: "4, 4",
        fillColor: "#0088ff",
        fillOpacity: 0.35
      }).bindPopup(`
        <div style="font-family: var(--font-swiss); font-size: 11px; text-transform: uppercase;">
          <div style="font-size: 9px; font-weight: 900; color: #0088ff; margin-bottom: 2px;">SENTINEL-1 SAR FLOOD DETECTION (GEE)</div>
          <strong>INUNDATION SECTOR #${idx + 1}</strong>
          <div style="margin-top: 4px; font-family: var(--text-mono); font-size: 10px; color: #444;">
            <div>Sensor: Copernicus Sentinel-1 C-Band SAR</div>
            <div>Polarization: Dual VV + VH Ortho-rectified</div>
            <div>Inundation Depth: 0.8m - 2.4m High Risk</div>
          </div>
        </div>
      `);
      group.addLayer(poly);
    });

    this.mapLayers.geeRasterOverlay = group.addTo(this.map);
  }

  renderInfrastructure() {
    this.mapLayers.infraGroup.clearLayers();

    if (!this.activeLayers.infrastructure) return;

    this.exposedAssets.forEach(asset => {
      let pinClass = "pin-safe";
      if (asset.currentStatus.includes("FAIL") || asset.currentStatus.includes("SUBMERG") || asset.currentStatus.includes("BREACH")) {
        pinClass = "pin-critical";
      } else if (asset.currentStatus.includes("CUT") || asset.currentStatus.includes("HIGH") || asset.currentStatus.includes("PARTIAL") || asset.currentStatus.includes("GROUND_STOP") || asset.currentStatus.includes("CLOSED")) {
        pinClass = "pin-high";
      } else if (asset.currentStatus.includes("PREP") || asset.currentStatus.includes("STOCK") || asset.currentStatus.includes("MONITOR") || asset.currentStatus.includes("RESTRICT") || asset.currentStatus.includes("DELAY")) {
        pinClass = "pin-warning";
      }

      let iconHtml = '<i class="ti ti-bolt"></i>';
      let pinTypeClass = "pin-power";
      let categoryTag = "CRITICAL INFRASTRUCTURE";

      if (asset.type === "hospital") {
        iconHtml = '<i class="ti ti-building-hospital"></i>';
        pinTypeClass = "pin-hospital";
        categoryTag = "HEALTHCARE & TRAUMA CENTER";
      } else if (asset.type === "shelter") {
        iconHtml = '<i class="ti ti-shield"></i>';
        pinTypeClass = "pin-shelter";
        categoryTag = "CYCLONE STORM SHELTER";
      } else if (asset.type === "road" || asset.type === "highway") {
        iconHtml = '<i class="ti ti-road"></i>';
        pinTypeClass = "pin-highway";
        categoryTag = "ARTERIAL EVACUATION HIGHWAY";
      } else if (asset.type === "bridge") {
        iconHtml = '<i class="ti ti-bridge"></i>';
        pinTypeClass = "pin-bridge";
        categoryTag = "COASTAL BRIDGE & CAUSEWAY";
      } else if (asset.type === "port" || asset.type === "marine" || asset.type === "seaport") {
        iconHtml = '<i class="ti ti-anchor"></i>';
        pinTypeClass = "pin-seaport";
        categoryTag = "DEEPWATER MARITIME PORT";
      } else if (asset.type === "airport" || asset.type === "airfield") {
        iconHtml = '<i class="ti ti-plane"></i>';
        pinTypeClass = "pin-airport";
        categoryTag = "COMMERCIAL & MILITARY AIRPORT";
      } else if (asset.type === "power") {
        categoryTag = "ENERGY & HIGH-VOLTAGE GRID";
      }

      const pinIcon = L.divIcon({
        className: "custom-pin-wrapper",
        html: `<div class="tactical-pin ${pinClass} ${pinTypeClass}">${iconHtml}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(asset.coords, { icon: pinIcon })
        .addTo(this.mapLayers.infraGroup)
        .bindPopup(`
          <div style="font-family: var(--font-swiss); font-size: 12px; color: #000000; min-width: 240px; text-transform: uppercase;">
            <div style="font-size: 10px; font-weight: 900; color: #FF3000; letter-spacing: 0.08em; margin-bottom: 2px;">
              ${iconHtml} ${categoryTag}
            </div>
            <strong style="font-size: 13px; font-weight: 900; color: #000000; line-height: 1.2;">${asset.name}</strong><br/>
            <div style="margin: 4px 0;">
              <span style="display:inline-block; padding: 2px 6px; font-weight: 900; background: #000000; color: #FFFFFF; font-size: 10px; letter-spacing: 0.05em;">
                STATUS: ${asset.currentStatus}
              </span>
            </div>
            <div style="font-family: var(--text-mono); font-size: 11px; margin-top: 4px;">
              <div><strong>ELEVATION:</strong> ${asset.elevationM}M MSL</div>
              <div><strong>SURGE EXPOSURE:</strong> +${asset.inundationDepthM}M</div>
              <div><strong>CAPACITY:</strong> ${asset.capacity}</div>
            </div>
            <p style="margin-top: 6px; font-size: 11px; color: #262626; text-transform: none; line-height: 1.35; border-top: 1px solid #000000; padding-top: 4px;">${asset.impactDescription}</p>
          </div>
        `);
    });
  }

  // Major Road Highways & Evacuation Corridors
  renderHighways() {
    this.mapLayers.highwaysGroup.clearLayers();
    if (!this.activeLayers.highways) return;

    const highways = this.currentBasin.highways || [];
    highways.forEach(hw => {
      const status = (hw.statusByStep && hw.statusByStep[this.currentStep.step]) || "OPEN";
      let color = "#10b981"; // Safe Green
      let dashArray = null;
      let weight = 4;
      let opacity = 0.85;

      if (status.includes("FLOOD") || status.includes("SUBMERG") || status.includes("IMPASSABLE") || status.includes("CLOSED") || status.includes("INTERDITADA")) {
        color = "#ff3000"; // Swiss red / flooded
        dashArray = "6, 6";
        weight = 5;
        opacity = 0.95;
      } else if (status.includes("CONGEST") || status.includes("RESTRICT") || status.includes("CONTRAFLOW") || status.includes("WARNING") || status.includes("BLOQUEIO") || status.includes("INTENSA")) {
        color = "#f59e0b"; // Amber / Congested
        dashArray = "10, 4";
        weight = 4;
        opacity = 0.9;
      }

      // Outer contrasting glow line
      L.polyline(hw.coords, {
        color: "#000000",
        weight: weight + 3,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(this.mapLayers.highwaysGroup);

      // Core status polyline
      const poly = L.polyline(hw.coords, {
        color: color,
        weight: weight,
        opacity: opacity,
        dashArray: dashArray,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(this.mapLayers.highwaysGroup);

      poly.bindPopup(`
        <div style="font-family: var(--font-swiss); font-size: 12px; color: #000000; min-width: 240px; text-transform: uppercase;">
          <div style="font-size: 10px; font-weight: 900; color: #FF3000; letter-spacing: 0.08em; margin-bottom: 2px;">
            <i class="ti ti-road"></i> ARTERIAL EVACUATION CORRIDOR
          </div>
          <strong style="font-size: 13px; font-weight: 900; color: #000000; line-height: 1.2;">${hw.name}</strong><br/>
          <div style="margin: 4px 0;">
            <span style="display:inline-block; padding: 2px 6px; font-weight: 900; background: ${color}; color: ${color === '#f59e0b' ? '#000000' : '#FFFFFF'}; font-size: 10px; letter-spacing: 0.05em;">
              ROUTE STATUS: ${status}
            </span>
          </div>
          <div style="font-family: var(--text-mono); font-size: 11px; margin-top: 4px;">
            <div><strong>CORRIDOR CODE:</strong> ${hw.code}</div>
            <div><strong>LANES:</strong> ${hw.lanes || "4-6 Lanes"}</div>
            <div><strong>MAX EVAC CAPACITY:</strong> ${hw.evacCapacity || "50,000 veh/day"}</div>
          </div>
          <p style="margin-top: 6px; font-size: 11px; color: #262626; text-transform: none; line-height: 1.35; border-top: 1px solid #000000; padding-top: 4px;">
            ${hw.description || "Designated emergency coastal evacuation and relief freight artery."}
          </p>
        </div>
      `);
    });
  }

  // Basemap Switcher (Tactical Dark, Real High-Res Satellite, Topographic)
  switchBasemap(type) {
    if (!this.basemaps[type]) return;
    this.currentBasemap = type;

    if (this.mapLayers.base) {
      this.map.removeLayer(this.mapLayers.base);
      this.mapLayers.base = null;
    }
    if (this.mapLayers.labels) {
      this.map.removeLayer(this.mapLayers.labels);
      this.mapLayers.labels = null;
    }

    const cfg = this.basemaps[type];
    const tileOptions = {
      maxZoom: cfg.maxZoom || 19,
      attribution: cfg.attribution
    };
    if (cfg.subdomains) tileOptions.subdomains = cfg.subdomains;
    if (cfg.maxNativeZoom) tileOptions.maxNativeZoom = cfg.maxNativeZoom;

    this.mapLayers.base = L.tileLayer(cfg.base, tileOptions).addTo(this.map);
    this.mapLayers.base.bringToBack();

    if (cfg.labels) {
      const labelOptions = {
        maxZoom: cfg.maxZoom || 19,
        opacity: 0.85
      };
      if (cfg.subdomains) labelOptions.subdomains = cfg.subdomains;
      if (cfg.maxNativeZoom) labelOptions.maxNativeZoom = cfg.maxNativeZoom;
      this.mapLayers.labels = L.tileLayer(cfg.labels, labelOptions).addTo(this.map);
    }

    document.querySelectorAll(".btn-basemap-option").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-basemap") === type);
    });
  }

  // Live Doppler Weather Radar (RainViewer & NOAA NEXRAD Composite)
  async renderLiveRadar() {
    if (this.mapLayers.liveRadarOverlay) {
      this.map.removeLayer(this.mapLayers.liveRadarOverlay);
      this.mapLayers.liveRadarOverlay = null;
    }

    if (!this.activeLayers.liveRadar) return;

    try {
      const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
      const data = await res.json();
      const latest = (data.radar && data.radar.past && data.radar.past.length > 0)
        ? data.radar.past[data.radar.past.length - 1]
        : null;

      const tileUrl = latest
        ? `${data.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`
        : "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png";

      this.mapLayers.liveRadarOverlay = L.tileLayer(tileUrl, {
        opacity: 0.75,
        maxNativeZoom: 7,
        maxZoom: 19,
        zIndex: 400,
        attribution: "Live Doppler Radar &copy; RainViewer / NOAA NEXRAD"
      }).addTo(this.map);
    } catch (e) {
      this.mapLayers.liveRadarOverlay = L.tileLayer("https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png", {
        opacity: 0.75,
        maxNativeZoom: 10,
        maxZoom: 19,
        zIndex: 400,
        attribution: "Live Doppler Radar &copy; NOAA NEXRAD"
      }).addTo(this.map);
    }
  }

  // Real Meteorological Satellite Clouds (NASA GIBS Earthdata / NOAA)
  renderLiveSatellite() {
    if (this.mapLayers.liveSatelliteOverlay) {
      this.map.removeLayer(this.mapLayers.liveSatelliteOverlay);
      this.mapLayers.liveSatelliteOverlay = null;
    }

    if (!this.activeLayers.liveSatellite) return;

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const dateStr = today.toISOString().split("T")[0];

    const nasaGibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    this.mapLayers.liveSatelliteOverlay = L.tileLayer(nasaGibsUrl, {
      opacity: 0.65,
      zIndex: 350,
      maxZoom: 9,
      attribution: "Live Satellite &copy; NASA GIBS / NOAA"
    }).addTo(this.map);
  }

  // NASA GIBS High-Definition TrueColor Daily Satellite (Aqua/Terra MODIS)
  renderNasaHd() {
    if (this.mapLayers.nasaHdOverlay) {
      this.map.removeLayer(this.mapLayers.nasaHdOverlay);
      this.mapLayers.nasaHdOverlay = null;
    }

    if (!this.activeLayers.nasaHd || this.isLowBandwidthMode) return;

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const dateStr = today.toISOString().split("T")[0];
    const url = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    this.mapLayers.nasaHdOverlay = L.tileLayer(url, {
      opacity: 0.92,
      zIndex: 360,
      maxZoom: 9,
      attribution: "NASA GIBS Terra/Aqua HD TrueColor"
    }).addTo(this.map);
  }

  // Geostationary Clean Infrared (GOES-East / Himawari-8/9 Band 13 Deep Convection)
  renderInfrared() {
    if (this.mapLayers.infraredOverlay) {
      this.map.removeLayer(this.mapLayers.infraredOverlay);
      this.mapLayers.infraredOverlay = null;
    }

    if (!this.activeLayers.infrared || this.isLowBandwidthMode) return;

    // Use Himawari for Asia/Pacific/Indian Ocean or GOES-East for Americas
    let irLayer = "Himawari_AHI_Band13_Clean_Infrared";
    const [cLat, cLng] = this.currentBasin.center;
    if (cLng < -30) {
      irLayer = "GOES-East_ABI_Band13_Clean_Infrared";
    }

    this.mapLayers.infraredOverlay = L.tileLayer.wms("https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi", {
      layers: irLayer,
      format: "image/png",
      transparent: true,
      opacity: 0.72,
      zIndex: 380,
      attribution: "Live Geostationary Clean IR &copy; NASA GIBS / JMA / NOAA"
    }).addTo(this.map);
  }

  // Active Fires & Thermal Anomalies (NASA LANCE FIRMS / MODIS & VIIRS 375m)
  renderFirms() {
    if (this.mapLayers.firmsOverlay) {
      this.map.removeLayer(this.mapLayers.firmsOverlay);
      this.mapLayers.firmsOverlay = null;
    }

    if (!this.activeLayers.firms || this.isLowBandwidthMode) return;

    this.mapLayers.firmsOverlay = L.tileLayer.wms("https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi", {
      layers: "MODIS_Terra_Thermal_Anomalies_All",
      format: "image/png",
      transparent: true,
      opacity: 0.95,
      zIndex: 420,
      attribution: "Active Fires &amp; Thermal Anomalies &copy; NASA FIRMS"
    }).addTo(this.map);
  }

  // Atmospheric Wind Particle Streamlines (GFS / DWD Numerical Model Simulation)
  renderWindStreamlines() {
    if (this.mapLayers.windCanvasLayer) {
      this.map.removeLayer(this.mapLayers.windCanvasLayer);
      this.mapLayers.windCanvasLayer = null;
    }
    if (this.windAnimFrame) {
      cancelAnimationFrame(this.windAnimFrame);
      this.windAnimFrame = null;
    }

    if (!this.activeLayers.windStreamlines || this.isLowBandwidthMode) return;

    // Dynamic Leaflet Canvas Layer for Animated Cyclonic Wind Streamlines
    const that = this;
    const CanvasWindLayer = L.Layer.extend({
      onAdd: function(map) {
        const pane = map.getPane("overlayPane");
        const canvas = L.DomUtil.create("canvas", "leaflet-wind-streamlines-canvas");
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "370";
        pane.appendChild(canvas);
        that._windCanvas = canvas;

        const resize = () => {
          const size = map.getSize();
          const bounds = map.getBounds();
          const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
          L.DomUtil.setPosition(canvas, topLeft);
          canvas.width = size.x;
          canvas.height = size.y;
        };

        map.on("move", resize);
        map.on("resize", resize);
        resize();
        that.initWindParticles(canvas);
      },
      onRemove: function(map) {
        if (that._windCanvas && that._windCanvas.parentNode) {
          that._windCanvas.parentNode.removeChild(that._windCanvas);
        }
        if (that.windAnimFrame) {
          cancelAnimationFrame(that.windAnimFrame);
          that.windAnimFrame = null;
        }
      }
    });

    this.mapLayers.windCanvasLayer = new CanvasWindLayer();
    this.map.addLayer(this.mapLayers.windCanvasLayer);
  }

  initWindParticles(canvas) {
    const ctx = canvas.getContext("2d");
    const numParticles = 180;
    const particles = [];

    const resetParticle = (p) => {
      p.angle = Math.random() * Math.PI * 2;
      p.radius = 20 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.58);
      p.life = Math.random() * 55 + 25;
      p.maxLife = p.life;
      p.speed = (Math.random() * 0.018 + 0.012) * Math.max(0.8, this.currentStep.maxWindSpeedKmph / 110);
    };

    for (let i = 0; i < numParticles; i++) {
      const p = {};
      resetParticle(p);
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const animate = () => {
      if (!this.activeLayers.windStreamlines || !this._windCanvas) return;

      // Clean trail fade: clear old lines quickly so canvas stays light and translucent
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      const centerPoint = this.map.latLngToContainerPoint(this.currentStep.eyeCoord);
      const isNorthern = this.currentBasin.center[0] >= 0;
      const rot = isNorthern ? 1 : -1; // Counter-clockwise for Northern Hemisphere, clockwise for Southern

      ctx.lineWidth = 0.95;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life--;

        const prevX = centerPoint.x + Math.cos(p.angle) * p.radius;
        const prevY = centerPoint.y + Math.sin(p.angle) * p.radius;

        p.angle += rot * p.speed;
        p.radius -= 0.35 * (this.currentStep.maxWindSpeedKmph / 100);

        const nextX = centerPoint.x + Math.cos(p.angle) * p.radius;
        const nextY = centerPoint.y + Math.sin(p.angle) * p.radius;

        if (p.life <= 0 || p.radius <= 14 || nextX < 0 || nextX > canvas.width || nextY < 0 || nextY > canvas.height) {
          resetParticle(p);
          continue;
        }

        const alpha = Math.min(1, p.life / 16) * 0.75;
        if (p.radius < 55) {
          ctx.strokeStyle = `rgba(255, 68, 0, ${alpha * 0.85})`; // Inner eyewall
        } else if (p.radius < 130) {
          ctx.strokeStyle = `rgba(255, 170, 0, ${alpha * 0.65})`; // Mid vortex gale
        } else {
          ctx.strokeStyle = `rgba(0, 225, 255, ${alpha * 0.5})`; // Outer feeder bands
        }

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
      }

      this.windAnimFrame = requestAnimationFrame(animate);
    };

    if (this.windAnimFrame) cancelAnimationFrame(this.windAnimFrame);
    this.windAnimFrame = requestAnimationFrame(animate);
  }

  updateInfrastructureList() {
    const list = document.getElementById("assetSummaryList");
    if (!list) return;
    list.innerHTML = "";

    const assets = this.exposedAssets;
    const threatened = assets.filter(a => !a.currentStatus.includes("NORMAL") && !a.currentStatus.includes("SAFE"));
    const badge = document.getElementById("threatCountBadge");
    if (badge) badge.textContent = `${threatened.length} At Risk`;

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
      <div style="font-size: 0.68rem; color: #000000; font-family: var(--text-mono); font-weight: 700; margin-bottom: 8px; border-bottom: 1px solid #000000; padding-bottom: 3px;">
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
      wave.classList.add("hidden");
    } else {
      const adv = this.dispatcher.getAdvisories(this.currentBasinKey, this.currentStep, langSelect.value);
      const textToSpeak = `${adv.data.title}. ${adv.data.message}`;

      document.getElementById("audioIcon").innerHTML = '<i class="ti ti-player-stop"></i>';
      wave.classList.remove("hidden");

      this.dispatcher.speakAdvisory(textToSpeak, adv.data.langCode, () => {
        document.getElementById("audioIcon").innerHTML = '<i class="ti ti-volume"></i>';
        wave.classList.add("hidden");
      });
    }
  }

  generateSitrepDownload() {
    const analysisText = document.getElementById("geminiContent").innerText || "Initial Spatial Diagnostics Pending";
    const report = this.reporter.generateSitrep({
      basin: this.currentBasin,
      currentStep: this.currentStep,
      exposedAssets: this.exposedAssets,
      geminiAnalysis: analysisText,
      incidentTriage: this.triage,
      resourceTracker: this.resources,
      interagencyLogger: this.logger
    });
    const filename = `Aegis_${this.currentBasin.country}_${this.currentStep.step}_SITREP.txt`;
    this.reporter.downloadReport(report, filename);
  }

  exportPrintableSitrep() {
    const analysisText = document.getElementById("geminiContent").innerText || "Initial Spatial Diagnostics Pending";
    const htmlReport = this.reporter.generatePrintableHtmlSitrep({
      basin: this.currentBasin,
      currentStep: this.currentStep,
      exposedAssets: this.exposedAssets,
      geminiAnalysis: analysisText,
      incidentTriage: this.triage,
      resourceTracker: this.resources,
      interagencyLogger: this.logger
    });
    this.reporter.openPrintableSitrep(htmlReport);
  }

  exportCsvAuditLedger() {
    const csvContent = this.reporter.generateCsvAuditLedger({
      basin: this.currentBasin,
      currentStep: this.currentStep,
      exposedAssets: this.exposedAssets,
      incidentTriage: this.triage,
      resourceTracker: this.resources
    });
    const filename = `Aegis_Disaster_Audit_Ledger_${this.currentBasin.country}_${this.currentStep.step}.csv`;
    this.reporter.downloadCsv(csvContent, filename);
  }

  downloadIcs214() {
    const logText = this.logger.exportIcs214(this.currentBasin.stormName);
    const blob = new Blob([logText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ICS214_Log_${this.currentBasin.country}_${this.currentStep.step}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

    // Render CAD Incident Triage & NIMS Resources
    const triageMetrics = this.triage.getQueueMetrics();
    const metricsGrid = document.getElementById("cadTriageMetricsGrid");
    if (metricsGrid) {
      metricsGrid.innerHTML = `
        <div class="spec-card">
          <span class="spec-label">ACTIVE CAD DISTRESS QUEUE</span>
          <span class="spec-value" style="color: #ff527c;">${triageMetrics.activeQueued} Calls Pending</span>
          <span class="spec-meta">P1 (Life Threats): ${triageMetrics.p1Count} | P2 (Grid): ${triageMetrics.p2Count}</span>
        </div>
        <div class="spec-card">
          <span class="spec-label">LIVES UNDER HAZARD</span>
          <span class="spec-value">${triageMetrics.totalLivesAtRisk.toLocaleString()} Persons</span>
          <span class="spec-meta">Reported via 112, VHF &amp; Panic Beacons</span>
        </div>
        <div class="spec-card">
          <span class="spec-label">DISPATCHED UNITS</span>
          <span class="spec-value" style="color: #00ffaa;">${triageMetrics.dispatched} Dispatched / ${triageMetrics.onScene} On-Scene</span>
          <span class="spec-meta">Multi-Agency First Responders</span>
        </div>
        <div class="spec-card">
          <span class="spec-label">NIMS RESOURCE FLEET</span>
          <span class="spec-value">${this.resources.getResourceSummary().stagedAvailable} Staged / Available</span>
          <span class="spec-meta">Type 1-4 Rescue Boats, Pumps &amp; Gensets</span>
        </div>
      `;
    }

    // Render CAD Prioritized Queue
    const queueList = document.getElementById("cadQueueListContainer");
    if (queueList) {
      queueList.innerHTML = "";
      const queue = this.triage.getPrioritizedQueue();
      queue.forEach(item => {
        const div = document.createElement("div");
        div.className = "asset-list-item";
        div.innerHTML = `
          <div class="asset-item-top">
            <span class="asset-name" style="max-width: 280px;"><strong>${item.id}</strong> — ${item.locationName}</span>
            <span class="asset-status-pill status-critical">${item.priority.code} (Score: ${item.triageScore})</span>
          </div>
          <div class="asset-desc" style="color: #262626;">${item.description}</div>
          <div style="font-size: 0.6rem; color: #000000; font-family: var(--text-mono); font-weight: 700; margin-top: 2px;">
            Source: ${item.source} · State: ${item.status} · Persons: ${item.affectedPersons}
          </div>
        `;
        queueList.appendChild(div);
      });
    }

    // Render NIMS Resource Fleet
    const resList = document.getElementById("resourceFleetListContainer");
    if (resList) {
      resList.innerHTML = "";
      const resources = this.resources.queryResources();
      resources.forEach(res => {
        const div = document.createElement("div");
        div.className = "asset-list-item";
        div.innerHTML = `
          <div class="asset-item-top">
            <span class="asset-name" style="max-width: 260px;"><strong>${res.callsign}</strong> — ${res.kind}</span>
            <span class="asset-status-pill status-safe">${res.type} · ${res.status}</span>
          </div>
          <div class="asset-desc">${res.owningAgency} · Staged: ${res.homeBase}</div>
        `;
        resList.appendChild(div);
      });
    }

    // Render ICS-214 Activity Log
    const ics214Code = document.getElementById("ics214LogPreview");
    if (ics214Code) {
      ics214Code.textContent = this.logger.exportIcs214(this.currentBasin.stormName);
    }

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
      if (label) {
        label.textContent = "Net: Satcom Low-BW";
        if (label.parentElement) label.parentElement.classList.add("active");
      }
      this.renderGeeRaster();
      alert("Switched to Low-Bandwidth / Satcom Mode: Suppressed high-resolution raster tile ingestion to conserve tactical satellite data. Note: Press Ctrl+Shift+O anytime to test the full animated satellite offline blackout recovery HUD.");
    } else {
      if (label) {
        label.textContent = "Net: Adaptive";
        if (label.parentElement) label.parentElement.classList.remove("active");
      }
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

  // Real-Time Live Telemetry & Event Stream (Simulated SSE/WebSocket Engine)
  initLiveStream() {
    this.liveStream.on("connection", (data) => {
      const statusEl = document.getElementById("sseStatusText");
      if (statusEl) statusEl.textContent = "SSE LIVE";
    });

    this.liveStream.on("statusChange", (event) => {
      this.handleLiveStatusChange(event);
    });

    this.liveStream.on("cadIncident", (event) => {
      this.handleLiveCadIncident(event);
    });

    this.liveStream.on("telemetry", (event) => {
      this.handleLiveTelemetryDelta(event);
    });
  }

  handleLiveStatusChange(event) {
    const banner = document.getElementById("liveStreamAlertBanner");
    const badge = document.getElementById("liveAlertBadge");
    const timeEl = document.getElementById("liveAlertTimestamp");
    const msgEl = document.getElementById("liveAlertMessage");

    if (banner && badge && timeEl && msgEl) {
      badge.textContent = event.severity === "CRITICAL" ? "CRITICAL ALERT" : "MONITORED WARNING";
      if (event.severity === "CRITICAL") {
        banner.classList.remove("warning");
      } else {
        banner.classList.add("warning");
      }
      timeEl.textContent = event.timestamp;
      msgEl.textContent = event.message;
      banner.classList.remove("hidden");

      // Auto-dismiss after 9 seconds if not manually acknowledged
      clearTimeout(this.liveAlertTimer);
      this.liveAlertTimer = setTimeout(() => {
        this.dismissLiveAlert();
      }, 9000);
    }

    // Dynamically update the asset in memory and refresh UI without full page refresh
    const targetAsset = (this.currentBasin.infrastructure || []).find(a => a.id === event.assetId || a.name === event.assetName);
    if (targetAsset) {
      targetAsset.statusByStep[this.currentStep.step] = event.newStatus;
      this.updateInfrastructureList();
      this.renderInfrastructure();
    }
  }

  handleLiveCadIncident(event) {
    // Ingest into triage engine live
    this.triage.ingestDistressCall({
      callerName: "Automated 112/VHF Monitor",
      callerPhone: "112-EOC",
      locationName: event.location,
      latitude: this.currentBasin.center[0] + (Math.random() - 0.5) * 0.35,
      longitude: this.currentBasin.center[1] + (Math.random() - 0.5) * 0.35,
      source: "CAD_LIVE_FEED",
      description: event.description,
      affectedPersons: event.affectedPersons,
      immediateHazards: ["Rapid Surge Flood", "Power Loss"],
      reportsWaterRising: true,
      requiresBoat: true
    });

    // Pulse the SSE live chip
    const chip = document.getElementById("sseLiveChip");
    if (chip) {
      chip.classList.add("pulse");
      setTimeout(() => chip.classList.remove("pulse"), 1000);
    }
  }

  handleLiveTelemetryDelta(event) {
    if (event.pressureDelta) {
      const pEl = document.getElementById("valPressure");
      if (pEl) {
        const val = +(parseFloat(pEl.textContent) + event.pressureDelta).toFixed(0);
        pEl.textContent = val;
      }
    }
    if (event.surgeDelta) {
      const sEl = document.getElementById("valSurge");
      if (sEl) {
        const val = Math.max(0.6, +(parseFloat(sEl.textContent) + event.surgeDelta)).toFixed(1);
        sEl.textContent = val;
      }
    }
    if (event.windDelta) {
      const wEl = document.getElementById("valWind");
      if (wEl) {
        const val = Math.max(70, Math.min(260, parseInt(wEl.textContent, 10) + event.windDelta));
        wEl.textContent = val;
      }
    }
  }

  // Sidebar Collapse / Expand for Full Common Operating Picture (COP)
  toggleLeftPanel() {
    this.isLeftCollapsed = !this.isLeftCollapsed;
    const app = document.getElementById("app");
    if (app) app.classList.toggle("collapse-left", this.isLeftCollapsed);
    const expandBtn = document.getElementById("btnExpandLeft");
    if (expandBtn) expandBtn.classList.toggle("hidden", !this.isLeftCollapsed);
    setTimeout(() => this.map && this.map.invalidateSize(), 300);
  }

  toggleRightPanel() {
    this.isRightCollapsed = !this.isRightCollapsed;
    const app = document.getElementById("app");
    if (app) app.classList.toggle("collapse-right", this.isRightCollapsed);
    const expandBtn = document.getElementById("btnExpandRight");
    if (expandBtn) expandBtn.classList.toggle("hidden", !this.isRightCollapsed);
    setTimeout(() => this.map && this.map.invalidateSize(), 300);
  }

  toggleFullCop() {
    const app = document.getElementById("app");
    const btn = document.getElementById("btnCopFocus");
    const isFull = app.classList.contains("full-cop");

    if (isFull) {
      app.classList.remove("full-cop", "collapse-left", "collapse-right");
      this.isLeftCollapsed = false;
      this.isRightCollapsed = false;
      document.getElementById("btnExpandLeft").classList.add("hidden");
      document.getElementById("btnExpandRight").classList.add("hidden");
      if (btn) btn.classList.remove("active");
    } else {
      app.classList.add("full-cop", "collapse-left", "collapse-right");
      this.isLeftCollapsed = true;
      this.isRightCollapsed = true;
      document.getElementById("btnExpandLeft").classList.remove("hidden");
      document.getElementById("btnExpandRight").classList.remove("hidden");
      if (btn) btn.classList.add("active");
    }
    setTimeout(() => this.map && this.map.invalidateSize(), 300);
  }

  // Micro-Data Accordion Toggle
  toggleAssetAccordion() {
    const card = document.getElementById("assetMiniCard");
    const btn = document.getElementById("btnToggleAssetAccordion");
    if (!card || !btn) return;
    card.classList.toggle("collapsed");
    const isCollapsed = card.classList.contains("collapsed");
    btn.innerHTML = isCollapsed ? '<i class="ti ti-chevron-down"></i>' : '<i class="ti ti-chevron-up"></i>';
  }

  // High-Contrast Generator/Bunker Mode
  toggleHighContrast() {
    this.isHighContrast = !this.isHighContrast;
    document.body.classList.toggle("theme-high-contrast", this.isHighContrast);
    const btn = document.getElementById("btnToggleHighContrast");
    if (btn) {
      if (this.isHighContrast) {
        btn.classList.add("active");
        localStorage.setItem("aegis_theme_contrast", "high");
      } else {
        btn.classList.remove("active");
        localStorage.removeItem("aegis_theme_contrast");
      }
    }
  }

  initUserPreferences() {
    const savedContrast = localStorage.getItem("aegis_theme_contrast");
    if (savedContrast === "high") {
      this.isHighContrast = true;
      document.body.classList.add("theme-high-contrast");
      const btn = document.getElementById("btnToggleHighContrast");
      if (btn) btn.classList.add("active");
    }
  }

  dismissLiveAlert() {
    clearTimeout(this.liveAlertTimer);
    const banner = document.getElementById("liveStreamAlertBanner");
    if (banner) banner.classList.add("hidden");
  }

  toggleStreamAudio() {
    const enabled = this.liveStream.toggleSound();
    const btn = document.getElementById("btnToggleStreamAudio");
    if (btn) {
      btn.innerHTML = enabled ? '<i class="ti ti-volume"></i>' : '<i class="ti ti-volume-off"></i>';
      btn.title = enabled ? "Mute Alert Audio" : "Unmute Alert Audio";
    }
  }
}

// Bootstrap Application on DOM load and attach headless programmatic API
window.addEventListener("DOMContentLoaded", () => {
  const app = new AegisApp();
  window.aegis = {
    app,
    triage: app.triage,
    resources: app.resources,
    logger: app.logger,
    nationalAdapter: app.nationalAdapter,
    exportIcs214: () => app.logger.exportIcs214(app.currentBasin.stormName)
  };
});
