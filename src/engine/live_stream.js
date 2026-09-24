// Aegis — Automated Real-Time EOC Telemetry & Status Event Stream Engine
// Implements simulated Server-Sent Events (SSE) and WebSocket real-time pipeline
// Eliminates manual dashboard refreshes and dispatches visual/auditory status-change alerts.

export class LiveStreamEngine {
  constructor(options = {}) {
    this.intervalMs = options.intervalMs || 12000; // 12 seconds per live telemetry ping
    this.timer = null;
    this.isConnected = false;
    this.eventCount = 0;
    this.lastPingTime = Date.now();
    this.listeners = {
      telemetry: [],
      statusChange: [],
      cadIncident: [],
      connection: []
    };
    this.soundEnabled = true;
    this.audioCtx = null;
  }

  // Subscribe to real-time events
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in live stream listener for [${event}]:`, err);
        }
      });
    }
  }

  // Connect to the EOC live event stream (SSE / WebSocket)
  connect(basin, currentStep) {
    if (this.isConnected) return;
    this.isConnected = true;
    this.lastPingTime = Date.now();
    this.emit("connection", { status: "CONNECTED", protocol: "SSE / WSS", timestamp: new Date().toISOString() });

    // Schedule automated periodic stream packets
    this.timer = setInterval(() => {
      this.generateLiveStreamEvent(basin, currentStep);
    }, this.intervalMs);
  }

  disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isConnected = false;
    this.emit("connection", { status: "DISCONNECTED", timestamp: new Date().toISOString() });
  }

  // Generate real-time telemetry delta or status change
  generateLiveStreamEvent(basin, currentStep) {
    this.eventCount++;
    this.lastPingTime = Date.now();

    const assets = basin.infrastructure || [];
    const randomSeed = Math.random();

    // 1. Status Change Event (Highest Priority — Occurs ~35% of the time)
    if (randomSeed < 0.35 && assets.length > 0) {
      const targetAsset = assets[Math.floor(Math.random() * assets.length)];
      const isCritical = Math.random() > 0.4;
      
      const newStatus = isCritical ? "SUBMERGED / FAILED" : "CRITICAL ALERT / CUT OFF";
      const oldStatus = isCritical ? "CRITICAL ALERT / CUT OFF" : "MONITORED / BACKUP POWER";
      const severity = isCritical ? "CRITICAL" : "AMBER";

      const eventData = {
        type: "STATUS_CHANGE",
        id: `EVT-${Date.now().toString(36).toUpperCase()}`,
        assetId: targetAsset.id,
        assetName: targetAsset.name,
        coords: targetAsset.coords,
        oldStatus,
        newStatus,
        severity,
        inundationDeltaM: +(0.15 + Math.random() * 0.35).toFixed(2),
        message: `${targetAsset.name} storm surge breached threshold (${targetAsset.elevationM}m elevation). Status auto-escalated from [${oldStatus}] to [${newStatus}].`,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC"
      };

      if (this.soundEnabled) {
        this.playAlertTone(isCritical ? "CRITICAL" : "WARNING");
      }

      this.emit("statusChange", eventData);
      return;
    }

    // 2. Incoming CAD Distress Dispatch Event (~35% of the time)
    if (randomSeed < 0.70) {
      const p1Locations = [
        "Dhamra Fishing Jetty", "Basudevpur Salt Pans", "Bhadrak Rural Clinic",
        "Chandbali River Bend", "Aul Panchayat Cyclone Shelter"
      ];
      const loc = p1Locations[Math.floor(Math.random() * p1Locations.length)];
      const persons = Math.floor(12 + Math.random() * 45);

      const eventData = {
        type: "CAD_INCIDENT",
        id: `CAD-${Math.floor(1000 + Math.random() * 9000)}`,
        location: loc,
        affectedPersons: persons,
        priority: "P1",
        triageScore: Math.floor(82 + Math.random() * 16),
        description: `Automated 112/VHF SOS: ${persons} villagers trapped by rapid surge influx near ${loc}.`,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC"
      };

      this.emit("cadIncident", eventData);
      return;
    }

    // 3. Sensor Telemetry Delta Event (~30% of the time)
    const windDelta = Math.floor((Math.random() - 0.4) * 6);
    const pressureDelta = +( (Math.random() - 0.5) * 1.5 ).toFixed(1);
    const surgeDelta = +( (Math.random() - 0.3) * 0.12 ).toFixed(2);

    const eventData = {
      type: "TELEMETRY_DELTA",
      windDelta,
      pressureDelta,
      surgeDelta,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC"
    };

    this.emit("telemetry", eventData);
  }

  // Synthesize clean tactical Web Audio tones (zero external mp3 dependencies)
  playAlertTone(severity = "CRITICAL") {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (severity === "CRITICAL") {
        // High-contrast urgent double-beep (880 Hz -> 587 Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(587, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // Warning single soft chime (523 Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      // Audio might be blocked by browser policy until user gesture
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }
}
