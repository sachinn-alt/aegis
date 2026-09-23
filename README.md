# 🌀 AEGIS
### Predictive Cyclone Impact & Critical Infrastructure Vulnerability Forecaster for BRICS Nations

[![BRICS Resilience Network](https://img.shields.io/badge/BRICS-Disaster%20Resilience%20Network-00f0ff?style=for-the-badge)](https://aegis.brics-resilience.org)
[![Track 05](https://img.shields.io/badge/Track%2005-Resilience%20%26%20Predictive%20Infrastructure-ff8400?style=for-the-badge)](https://aegis.brics-resilience.org)
[![Gemini 3.7 Flash](https://img.shields.io/badge/AI%20Core-Gemini%203.7%20Flash-a855f7?style=for-the-badge&logo=google)](https://aegis.brics-resilience.org)
[![GIS Engine](https://img.shields.io/badge/GIS-Leaflet%20%2B%20CartoDB%20Dark-00ffaa?style=for-the-badge)](https://leafletjs.com)

---

## 🌊 Overview

**Aegis** is an anticipatory early-warning and critical infrastructure vulnerability forecasting platform engineered specifically for high-risk coastal territories across **BRICS nations** (India, South Africa, Brazil, China).

Shifting the disaster management paradigm from **reactive post-disaster recovery** to **proactive, physics-grounded anticipatory defense**, Aegis fuses:
1. **Hydrodynamic Storm Surge Physics:** Calculates asymmetric coastal inundation polygons factoring in planetary Coriolis bias (Northern vs. Southern hemisphere quadrant offsets).
2. **Google Earth Engine (GEE) Satellite Telemetry:** Ingests Sentinel-1 Synthetic Aperture Radar (SAR) flood backscatter rasters and VIIRS nighttime light infrastructure grids.
3. **Gemini 3.7 Flash Multimodal Spatial Reasoning:** Synthesizes complex interdependencies across high-voltage electrical substations, deep-water ports, regional medical hubs, arterial bridges, and municipal drinking water pumping stations to diagnose cascading failure pathways.
4. **Multilingual Vernacular Audio Dispatcher:** Delivers hyper-localized early-warning advisories across 7 regional languages (Odia, Bengali, Hindi, isiZulu, Portuguese, Mandarin, English) with native speech synthesis and multi-channel delivery metrics (SMS, Marine VHF Ch. 16, Village Sirens).
5. **Executive Situation Report (SITREP) Generator:** Exports standardized, military/government-formatted disaster briefings for District Emergency Operations Centers (DEOC) and Cabinet leadership in seconds.

---

## 🏛️ Supported Coastal Basins & Scenarios

| Country | Coastal Basin | Active System | Primary Corridor | Languages |
|:---|:---|:---|:---|:---|
| 🇮🇳 **India** | Bay of Bengal | Cyclone DANA (Cat 3 Eq.) | Odisha & West Bengal (Dhamra Port, Bhadrak, Kendrapara, Digha) | Odia, Bengali, Hindi, English |
| 🇿🇦 **South Africa** | Indian Ocean | Cyclone FREDDY Analog | KwaZulu-Natal (Durban Harbor, Umgeni Basin) | isiZulu, English |
| 🇧🇷 **Brazil** | South Atlantic | Rio Grande Surge | Rio Grande do Sul (Porto Alegre & Lagoa dos Patos) | Portuguese, English |
| 🇨🇳 **China** | South China Sea | Typhoon DOKSURI | Fujian & Quanzhou Coastal Industrial Corridor | Mandarin, English |

---

## ⚡ Core Architecture & Engineering Highlights

```
+----------------------------------------------------------------------------------------------------+
|                                         AEGIS ARCHITECTURE                                         |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [Satellite & Telemetry]      [Physics & Hydrodynamics]       [AI Reasoning]      [Vernacular]     |
|   - Sentinel-1 SAR Floods      - Haversine Geodesic            - Gemini 3.7 Flash  - 7 Regional    |
|   - VIIRS Nightlights          - Asymmetric Surge Polygons       Dual-Mode Core      Dialects      |
|   - CartoDB Dark Matter        - Exponential Wind Decay        - Cascading Failure - Web Speech    |
|   - Eye Telemetry Track        - Asset Inundation Delta          Synthesizer         Voice Alerts  |
|                                                                                                    |
|                                                  │                                                 |
|                                                  ▼                                                 |
|  [Tactical 60 FPS GIS Dashboard] ──> [5-Stage Time Scrubber] ──> [One-Click Executive SITREP]      |
|                                      (T-72h to T+12h Playback)                                     |
+----------------------------------------------------------------------------------------------------+
```

### 🧮 Hydrodynamic Surge Formulation
The asymmetric radial reach $r(\theta)$ for 24 perimeter vertices is calculated via:

$$r(\theta) = \min\left(90, \, \max(25, \, S_{\text{max}} \cdot 22)\right) \cdot \max\left(0.25, \, \cos\left(\frac{\Delta\alpha \cdot \pi}{280^\circ}\right)\right)$$

where $\Delta\alpha$ adjusts for Coriolis acceleration: $+70^\circ$ right-forward bias in the Northern Hemisphere and $-70^\circ$ left-forward bias in the Southern Hemisphere.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/sachinn-alt/aegis.git
cd aegis

# Install dependencies
npm install

# Start the tactical EOC development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Optional: Live Gemini Cloud Intelligence
Click the **🔑 Gemini Key** button in the top navigation bar to input your Google AI Studio API key. If left blank, Aegis automatically runs its embedded spatial reasoning heuristic engine for instantaneous, zero-latency demos.

---

## 📚 Technical Documentation

- 📋 [**Product Requirements Document (PRD.md)**](./PRD.md) — Comprehensive product objectives, user personas, functional requirements (FR-01 to FR-10), and success metrics.
- 🛠️ [**Technical Requirements Document (TRD.md)**](./TRD.md) — Architectural specifications, mathematical formulations, data schemas, API contracts, and performance budgets.
- 🎨 [**Design Specification & UX Architecture (DESIGN.md)**](./DESIGN.md) — Tactical EOC Dark Glassmorphism design tokens, typography scale, component blueprints, and WCAG 2.1 AA accessibility audits.

---

## 🛡️ License

Developed under the **MIT License** for the **BRICS Disaster Resilience Network** and humanitarian disaster management authorities worldwide.
