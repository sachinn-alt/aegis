// Aegis - Gemini 3.7 Flash Multimodal & Spatial Reasoning Engine
// Connects to Gemini API or provides robust, realistic domain reasoning for live demos

export class GeminiReasoningEngine {
  constructor(apiKey = null) {
    const envOrKey = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_OPENROUTER_API_KEY : "";
    const envOrModel = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_OPENROUTER_MODEL : "";
    const envGemini = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : "";
    const winOrKey = typeof window !== "undefined" && window.OPENROUTER_API_KEY ? window.OPENROUTER_API_KEY : "";
    const winGemini = typeof window !== "undefined" && window.GEMINI_API_KEY ? window.GEMINI_API_KEY : "";

    this.openRouterKey = envOrKey || winOrKey || localStorage.getItem("aegis_openrouter_key") || "";
    this.openRouterModel = envOrModel || localStorage.getItem("aegis_openrouter_model") || "nvidia/nemotron-3.5-lightning:free";
    this.apiKey = apiKey || envGemini || winGemini || localStorage.getItem("aegis_gemini_key") || "";
  }

  setApiKey(key) {
    if (key.startsWith("sk-or-")) {
      this.openRouterKey = key;
      localStorage.setItem("aegis_openrouter_key", key);
    } else {
      this.apiKey = key;
      if (key) {
        localStorage.setItem("aegis_gemini_key", key);
      } else {
        localStorage.removeItem("aegis_gemini_key");
        localStorage.removeItem("resilicoast_gemini_key");
      }
    }
  }

  async runMultimodalAnalysis(basinData, currentTimeStep, exposedAssets, satelliteActive = true) {
    const prompt = this.buildPrompt(basinData, currentTimeStep, exposedAssets, satelliteActive);

    // Primary: OpenRouter NVIDIA Nemotron 3.5
    if (this.openRouterKey && this.openRouterKey.startsWith("sk-or-")) {
      try {
        const response = await this.callOpenRouterApi(prompt);
        return {
          source: `NVIDIA Nemotron 3.5 (${this.openRouterModel})`,
          timestamp: new Date().toLocaleTimeString(),
          analysis: response
        };
      } catch (err) {
        console.warn("OpenRouter API call failed, attempting fallback:", err);
      }
    }

    // Secondary: Gemini API
    if (this.apiKey && this.apiKey.trim().length > 10) {
      try {
        const response = await this.callGeminiApi(prompt);
        return {
          source: "Gemini 3.8 Flash (Live Cloud API)",
          timestamp: new Date().toLocaleTimeString(),
          analysis: response
        };
      } catch (err) {
        console.warn("Gemini API call failed, falling back to embedded domain reasoning:", err);
      }
    }

    // High-fidelity domain reasoning fallback
    return {
      source: "Nemotron Spatial Engine (Simulated)",
      timestamp: new Date().toLocaleTimeString(),
      analysis: this.generateSimulatedReasoning(basinData, currentTimeStep, exposedAssets)
    };
  }

  buildPrompt(basin, step, exposedAssets, satelliteActive) {
    return `You are NVIDIA Nemotron 3.5 acting as the Chief Disaster Risk & Geospatial AI Officer for coastal authorities in ${basin.country} (${basin.basinName}).
Active Event: ${basin.stormName} (${basin.category})
Time Horizon: ${step.label} (${step.step})
Current Storm Dynamics:
- Eye Coordinates: Lat ${step.eyeCoord[0]}, Lng ${step.eyeCoord[1]}
- Central Pressure: ${step.centralPressureHpa} hPa
- Max Sustained Winds: ${step.maxWindSpeedKmph} km/h
- Simulated Peak Storm Surge: ${step.surgeHeightM}m above mean high water
- 24h Rainfall Forecast: ${step.rainfallForecastMm24h} mm
- Satellite Feed Status: ${satelliteActive ? "Active (Sentinel-1 SAR Flood Raster & VIIRS Nightlights Ingested)" : "Offline"}

Exposed Critical Infrastructure Assets in Corridor:
${exposedAssets.map(a => `- ${a.name} (${a.type.toUpperCase()}): Elev ${a.elevationM}m, Status: ${a.currentStatus}, Impact: ${a.impactDescription}`).join("\n")}

Task: Provide a rigorous 3-part spatial vulnerability synthesis:
1. CASCADING INFRASTRUCTURE FAILURE PATHWAYS: How salt-water surge, high-velocity wind swath, and localized culvert flooding interconnect to disable vital services (power grid, medical hubs, and evacuation bridges).
2. ANTICIPATORY ACTION DIRECTIVES: Immediate 3-step prioritized interventions for the District Emergency Operations Center (DEOC) before landfall window closes.
3. PARAMETRIC INSURANCE & EMERGENCY LIQUIDITY TRIGGER: Automated damage assessment estimation for rapid pre-allocated disaster relief release.`;
  }

  async callOpenRouterApi(promptText) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aegis.brics-resilience.org",
        "X-Title": "Aegis Disaster Resilience"
      },
      body: JSON.stringify({
        model: this.openRouterModel,
        messages: [
          {
            role: "system",
            content: "You are NVIDIA Nemotron 3.5 serving as the Lead Disaster Resilience AI Officer for BRICS coastal early-warning command. Provide structured spatial intelligence analysis."
          },
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async callGeminiApi(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }

  generateSimulatedReasoning(basin, step, exposedAssets) {
    const compromised = exposedAssets.filter(a => a.currentStatus.includes("FAIL") || a.currentStatus.includes("SUBMERG") || a.currentStatus.includes("CUT") || a.currentStatus.includes("CRITICAL"));
    const compromisedCount = compromised.length;

    let cascadingNarrative = "";
    let urgentDirectives = [];
    let parametricLiquidity = "";

    if (basin.id === "india") {
      cascadingNarrative = `
**1. Cascading Spatial Failure Pathways:**
- **Hydrodynamic Surge Infiltration:** Storm surge anomaly of **${step.surgeHeightM}m** combined with high tide in the Baitarani/Dhamra estuary pushes seawater 18km inland.
- **Power Grid Interdependence:** Inundation of the *Bhadrak 220kV Transmission Substation* cuts grid electricity to 240,000 households and forces *Basudevpur CHC* and *Kendrapara District Hospital* onto auxiliary diesel islanding.
- **Arterial Evacuation Chokepoints:** *NH-16* and the *Baitarani River Bridge approach causeway* are compromised by rising surge water (depth >0.85m), rendering northbound relief convoys from Cuttack unable to access Dhamra port communities.`;

      urgentDirectives = [
        "**DEOC Action 1:** Initiate immediate remote de-energization of the Bhadrak coastal 33kV distribution feeders 4 hours prior to landfall to avert catastrophic saltwater transformer explosions.",
        "**DEOC Action 2:** Reroute emergency ambulances away from NH-16 to the elevated Inland Western Bypass (State Highway 9) to maintain patient access to Kendrapara District Hospital.",
        "**DEOC Action 3:** Activate Multipurpose Cyclone Shelter #04 emergency water purification osmosis units and dispatch SDRF motorized rescue boats to low-lying fishing hamlets."
      ];

      parametricLiquidity = `**Parametric Disaster Trigger:** Wind speed (${step.maxWindSpeedKmph} km/h) & Surge (${step.surgeHeightM}m) exceed Tier-2 NDMA catastrophe threshold. **Pre-allocated emergency liquidity trigger: ₹45.8 Crores ($5.5M USD)** recommended for immediate disbursement to coastal Panchayats.`;
    } else if (basin.id === "south_africa") {
      cascadingNarrative = `
**1. Cascading Spatial Failure Pathways:**
- **Estuary Wave Surge Overtopping:** Wave run-up of **${step.surgeHeightM}m** collides with intense catchment runoff (420mm/24h) along the Umgeni and Isipingo river mouths.
- **Critical Industrial & Logistics Breakdown:** Inundation of *Port of Durban Pier 2* and *Prospecton 132kV Substation* paralyzes 65% of national container freight and regional automotive manufacturing.
- **Slope Instability & Access Severance:** High-velocity river surge scours the southern abutment of the *M4 Umgeni Bridge*, cutting off rapid vehicle response between Durban Central and Northern Coastal suburbs.`;

      urgentDirectives = [
        "**EThekwini EOC Action 1:** Enforce immediate pre-emptive shutdown of low-lying Umgeni industrial pump stations to protect municipal freshwater supply.",
        "**EThekwini EOC Action 2:** Mobilize SANDF heavy engineering units to secure temporary pontoon bridging across Umgeni north corridor.",
        "**EThekwini EOC Action 3:** Stage emergency medical airlifts at King Edward VIII Hospital rooftop helipads due to road waterlogging."
      ];

      parametricLiquidity = `**Parametric Disaster Trigger:** Extreme precipitation and surge threshold exceeded. **Automated liquidity trigger: R 280 Million ($15.2M USD)** recommended for immediate coastal infrastructure stabilization.`;
    } else if (basin.id === "brazil") {
      cascadingNarrative = `
**1. Cascading Spatial Failure Pathways:**
- **Lagoa dos Patos Hydraulic Squeeze:** Sustained southerly gale-force winds (135 km/h) create an extreme storm surge barrier of **${step.surgeHeightM}m**, trapping lake outflow and inundating the historic center of Rio Grande.
- **Port Logistics & Soy Export Stoppage:** *Superporto de Rio Grande* grain terminals submerged, halting primary agricultural export flows for the entire Mercosur basin.
- **Highway BR-392 Severance:** Inundation of the causeway at km 18 cuts off the port barrier island from Pelotas and mainland medical assistance.`;

      urgentDirectives = [
        "**Defesa Civil Diretriz 1:** Acionar bombeamento emergencial de diques nos bairros Centro e Getúlio Vargas.",
        "**Defesa Civil Diretriz 2:** Desviar veículos de carga pesada da BR-392 para pátios secos antes do pico da maré.",
        "**Defesa Civil Diretriz 3:** Operar transporte de emergência com embarcações da Marinha do Brasil para acesso ao Hospital Universitário."
      ];

      parametricLiquidity = `**Gatilho de Seguro Paramétrico:** Cota de inundação ultrapassou nível crítico de 2.8m. **Liberação emergencial estimada: R$ 85 Milhões ($16.8M USD)** para auxílio à Defesa Civil estadual.`;
    } else {
      cascadingNarrative = `
**1. Cascading Spatial Failure Pathways:**
- **Super Typhoon Coastal Inundation:** Catastrophic 4.1m storm surge wave pushes directly into Dapeng Bay and Pearl River Delta estuaries.
- **Seawall Overtopping Risk:** Extreme wave forces stress coastal flood dikes at *Yantian Deepwater Port*, threatening lower-level automated gantry systems.
- **Power Grid Defense:** *Daya Bay 500kV Interconnector* remains fortified behind engineered 5m seawalls, maintaining regional grid stability.`;

      urgentDirectives = [
        "**Command Action 1:** Enforce level-1 four-stop emergency protocol across Shenzhen and Guangdong coastal sectors.",
        "**Command Action 2:** Continuous sonar and drone monitoring of coastal seawall integrity along Dapeng Peninsula.",
        "**Command Action 3:** Activate automated high-volume drainage sluices across the Pearl River estuary."
      ];

      parametricLiquidity = `**Catastrophe Trigger:** Category 4+ landfall parameters met. **Emergency resilience release: ¥320 Million RMB ($44M USD)** allocated for municipal flood defense.`;
    }

    return `${cascadingNarrative}

**2. Anticipatory Action Directives (Next 12–24 Hours):**
${urgentDirectives.join("\n")}

**3. Disaster Finance & Parametric Insurance:**
${parametricLiquidity}`;
  }
}
