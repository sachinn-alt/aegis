# Aegis — Product Requirements Document (PRD)

> **Document Status:** Active / Approved Baseline  
> **Version:** 1.0.0  
> **Track:** Track 05 — Resilience & Predictive Infrastructure Vulnerability (Code for Communities)  
> **Target Basins:** India (Bay of Bengal), South Africa (Indian Ocean), Brazil (South Atlantic), China (South China Sea)  
> **Classification:** Sovereign Emergency Operations Center (EOC) Specification  

---

## 1. Executive Summary & Vision Statement

### 1.1 Executive Summary
**Aegis** is an anticipatory early-warning and critical infrastructure vulnerability forecasting platform engineered specifically for coastal territories across BRICS nations. Unlike traditional post-disaster recovery tools or generic weather tracking applications, Aegis fuses **hydrodynamic storm surge physics**, **Google Earth Engine (GEE) Synthetic Aperture Radar (SAR) telemetry**, and **Gemini 3.7 Flash multimodal spatial reasoning** into a unified, zero-latency Emergency Operations Center (EOC) dashboard.

The platform continuously models the projected 72-hour cyclone landfall cone, calculates localized ocean surge inundation using asymmetric hydrodynamic equations, maps interdependencies across critical lifelines (power substations, deep-water ports, medical hubs, evacuation bridges, and drinking water pumping stations), and generates automated, hyper-local multilingual advisories with text-to-speech voice broadcasts.

### 1.2 Vision Statement
> *"To eliminate preventable coastal casualties and prevent catastrophic cascade failures of lifelines across BRICS coastal corridors by shifting the disaster response paradigm from reactive recovery to proactive, physics-grounded anticipatory defense."*

---

## 2. Problem Statement & Background

### 2.1 The Coastal Climate Crisis in BRICS Nations
Over 1.2 billion citizens across BRICS nations reside along high-vulnerability coastline basins:
- **India (Bay of Bengal):** Odisha and West Bengal face recurring severe cyclonic storms (e.g., Cyclone Dana, Fani, Yaas). High population density, low-lying coastal plains (<3m elevation), and saline mangrove deltas make storm surges exceptionally lethal.
- **South Africa (South-West Indian Ocean):** Extreme storm systems and unprecedented cut-off lows (e.g., Cyclone Freddy, 2022 Durban Floods) batter KwaZulu-Natal, overwhelming harbor cranes, arterial logistics bridges, and informal settlements.
- **Brazil (South Atlantic Basin):** Subtropical extratropical cyclones and storm surge anomalies in Rio Grande do Sul (Porto Alegre, Lagoa dos Patos) inundate power grids, water pumping stations, and regional transit networks.
- **China (South China Sea / Western Pacific):** Super typhoons (e.g., Typhoon Doksuri, Saola) strike high-density industrial coastal corridors in Fujian and Guangdong, threatening critical petrochemical terminals, maritime container ports, and high-speed rail links.

### 2.2 The "72-Hour Anticipatory Action Blind Spot"
Emergency managers and District Emergency Operations Centers (DEOCs) consistently face three fatal bottlenecks during the pre-landfall window ($T-72\text{h}$ to $T-0\text{h}$):
1. **Telemetry Without Infrastructure Context:** Meteorological agencies issue track coordinates and wind speeds, but DEOC commanders cannot visualize how that translates to *which specific 220kV substation will be submerged* or *which evacuation bridge will become impassable*.
2. **Cascading Infrastructure Failures:** Infrastructure assets do not fail in isolation. When a coastal electrical substation floods, hospital backup diesel generators fail to receive fuel shipments due to inundated access roads, resulting in oxygen plant shutdowns and hospital evacuations during the height of the cyclone.
3. **The Vernacular Last-Mile Barrier:** Evacuation warnings are often broadcast in national languages (English/Hindi/Portuguese) with generic text formats. Illiterate coastal fishing communities, indigenous groups, and rural panchayats miss the critical evacuation window because warnings lack local dialect translations, audio voice broadcasts, or multi-channel delivery (VHF marine radio, SMS, IVR sirens).

---

## 3. Product Goals & Key Success Metrics (OKRs)

### 3.1 Primary Product Objectives
- **Objective 1:** Provide unified, real-time spatial awareness linking hydrodynamic storm surge polygons directly to critical infrastructure asset elevations and status.
- **Objective 2:** Automate spatial impact analysis using Gemini 3.7 Flash to diagnose cascading lifeline failures and deliver prioritized anticipatory action directives.
- **Objective 3:** Enable multi-channel vernacular broadcast dispatch across 7 BRICS regional languages with one-click voice alerts.
- **Objective 4:** Provide automated, exportable executive Situation Reports (SITREPs) ready for Cabinet and military command briefing.

### 3.2 Key Performance Indicators & Target Metrics
| Metric ID | Description | Target Baseline | Aegis Target |
|:---|:---|:---|:---|
| **KPI-01** | Lead time for infrastructure vulnerability identification | $T-6\text{h}$ (Reactive) | **$T-72\text{h}$ to $T-48\text{h}$ (Anticipatory)** |
| **KPI-02** | Time required to compile and issue an Executive SITREP | 3 to 5 hours | **< 5 seconds** (Instantaneous) |
| **KPI-03** | Multi-channel broadcast dispatch latency | 45 minutes | **< 30 seconds** |
| **KPI-04** | Client-side GIS render frame rate under dense layer load | < 30 FPS | **60 FPS stable** |
| **KPI-05** | Offline resilience & failover capability | Total crash if cloud drops | **100% operational via embedded physics & heuristic engine** |

---

## 4. User Personas & Journey Maps

```mermaid
journey
    title DEOC Commander Pre-Landfall Journey with Aegis
    section T-72h: Ingestion & Baseline
      Select Basin (Bay of Bengal): 5: DEOC Commander
      Inspect Cyclone Track & Eye Telemetry: 5: DEOC Commander
      View Threatened Asset Network: 4: Infrastructure Lead
    section T-48h: Inundation Modeling
      Engage Time Scrubber to T-48h: 5: DEOC Commander
      Evaluate Asymmetric Surge Polygon: 5: Coastal Engineer
      Detect High-Vulnerability Substations: 4: Power Grid Lead
    section T-24h: AI Synthesis & Directives
      Trigger Gemini 3.7 Flash Spatial Reasoner: 5: DEOC Commander
      Review Cascading Failure Directives: 5: DEOC Commander
      Dispatch Odia/Bengali Voice Warnings: 5: Field Dispatcher
    section Landfall & T+12h: Response & SITREP
      Monitor Real-Time SAR Flood Extents: 4: GIS Specialist
      Export Official Executive SITREP: 5: DEOC Commander
```

### Persona 1: District Collector / DEOC Incident Commander
- **Role:** Head of District Emergency Operations Center (e.g., Bhadrak & Kendrapara, Odisha).
- **Core Need:** Instant visual clarity on which sectors must be evacuated, which roads remain open for emergency vehicles, and authoritative summaries for state leadership.
- **Pain Point:** Overwhelmed by raw weather bulletins and contradictory agency spreadsheets.

### Persona 2: Chief Critical Infrastructure Engineer (Power & Water)
- **Role:** Operations head for State Grid Corporation or Municipal Water Board.
- **Core Need:** Exact inundation depth projections at substation switchyards and water pumping intake valves to schedule controlled de-energization and seal floodgates before saltwater arcing.
- **Pain Point:** Delayed notification leads to burnt transformers requiring 6 months to replace.

### Persona 3: Vernacular Emergency Public Information Officer
- **Role:** Communications Officer coordinating field alerts and public broadcasts.
- **Core Need:** Ready-to-broadcast local language advisories (text + voice) for SMS gateways, WhatsApp community channels, marine VHF Ch. 16, and village siren towers.
- **Pain Point:** Manual translation delays warning dissemination during the crucial pre-landfall window.

---

## 5. Functional Requirements (FR)

### FR-01: Multi-Basin & Real-World Historical Scenario Selection
- **FR-01.1:** The system shall support rapid switching between 4 pre-configured BRICS coastal disaster corridors:
  1. *India:* Bay of Bengal corridor (Cyclone DANA — Odisha/West Bengal).
  2. *South Africa:* Indian Ocean corridor (Cyclone FREDDY — KwaZulu-Natal/Durban).
  3. *Brazil:* South Atlantic corridor (Rio Grande do Sul Extreme Surge — Porto Alegre/Lagoon basin).
  4. *China:* South China Sea corridor (Typhoon DOKSURI — Fujian/Quanzhou coastal manufacturing hub).
- **FR-01.2:** Switching basins shall update the map viewport center, zoom level, weather HUD telemetry, infrastructure network, SAR raster overlays, and regional language options without full page reload.

### FR-02: Interactive Tactical GIS Map Viewport
- **FR-02.1:** The system shall render a full-screen, responsive GIS map utilizing the CartoDB Dark Matter tactical basemap.
- **FR-02.2:** The map shall support standard zoom, pan, and interactive boundary framing.
- **FR-02.3:** Map legend overlay shall indicate the 4 standardized emergency risk states:
  - *Submerged / Failed:* Red Beacon (`#ff2a5f`)
  - *Critical Alert / Cut Off:* Orange Beacon (`#ff8400`)
  - *Backup Power / Monitored:* Yellow Warning (`#ffcc00`)
  - *Fortified / Operational:* Green Safe (`#00ffaa`)

### FR-03: Dynamic Storm Physics & Telemetry HUD
- **FR-03.1:** Display active cyclone name, international category classification, and human-readable corridor designation.
- **FR-03.2:** Provide real-time HUD telemetry cells displaying:
  - Central Atmospheric Pressure in hectopascals (hPa).
  - Maximum Sustained Wind Speed in km/h.
  - Projected Peak Storm Surge Height in meters above astronomical high tide.
  - 24-Hour Cumulative Precipitation in millimeters (mm).
  - Estimated Coastal Population Exposed within the danger radius.

### FR-04: Multi-Layer Tactical GIS Overlays
The system shall feature independent toggle controls for 5 distinct tactical layers:
1. **Cyclone Track & Eye Radius:** Shows historical track points, forecasted path polyline, and pulsing eye center.
2. **Wind Swath Cone of Uncertainty:** Visualizes the expanding radial cone of gale-force wind uncertainty.
3. **Surge Inundation Polygon:** Asymmetric hydrodynamic polygon displaying coastal areas exposed to ocean surge.
4. **Sentinel-1 SAR Flood Inundation (GEE):** Satellite radar synthetic aperture overlay highlighting inland backwater and riverine inundation.
5. **Critical Infrastructure Network:** Interactive asset markers color-coded by vulnerability status with detailed tooltips and click popups.

### FR-05: Critical Infrastructure Exposure & Vulnerability Network
- **FR-05.1:** Model 5 critical asset classes per basin:
  - High-Voltage Electrical Substations (220kV / 400kV).
  - Deep-water Cargo & Petroleum Ports.
  - Regional Medical College & District Referral Hospitals.
  - Strategic Coastal Arterial Highway Bridges.
  - Coastal Weather Surveillance Doppler Radar Stations.
  - High-Capacity Municipal Drinking Water Treatment & Pumping Stations.
- **FR-05.2:** For each asset, model key telemetry attributes: asset name, type, exact latitude/longitude, ground elevation above Mean Sea Level (MSL), design operating capacity, status by simulation step, and impact diagnosis.
- **FR-05.3:** Automatically compute distance from eye, local wind speed, surge water level, and net inundation depth ($h = \max(0, \text{Surge} - \text{Elevation})$).

### FR-06: 5-Stage Temporal Simulation & Time Scrubber
- **FR-06.1:** Support 5 distinct temporal analysis steps:
  1. $T-72\text{h}$ (72 Hours Before Landfall — Deep Depression / Alert Phase)
  2. $T-48\text{h}$ (48 Hours Before Landfall — Evacuation Window)
  3. $T-24\text{h}$ (24 Hours Before Landfall — Islanding & Defense Phase)
  4. $\text{Landfall}$ (Peak Landfall Window — Curfew & Active Impact)
  5. $T+12\text{h}$ (12 Hours Post-Landfall — Damage Assessment & Restoration)
- **FR-06.2:** Provide an interactive slider and clickable state badges for timeline navigation.
- **FR-06.3:** Include an **Auto-Simulate Play/Pause** playback controller that automatically advances the timeline every 2.4 seconds with cyclic loop support.

### FR-07: Gemini 3.7 Flash Multimodal Spatial Reasoning Engine
- **FR-07.1:** Integrate Google Gemini 3.7 Flash / Gemini 2.0 Flash via REST API for deep multimodal spatial reasoning.
- **FR-07.2:** Synthesize input parameters: active basin, storm dynamics, satellite feed state, and list of exposed infrastructure assets into a structured prompt.
- **FR-07.3:** Deliver a 3-part spatial vulnerability synthesis:
  1. *Cascading Infrastructure Failure Pathways* (interdependent network breakdowns).
  2. *Anticipatory Action Directives* (prioritized 3-step EOC orders before landfall).
  3. *Parametric Insurance & Emergency Liquidity Trigger* (automated loss estimation and contingency fund trigger).
- **FR-07.4:** Provide a zero-latency, high-fidelity offline heuristic reasoner when no cloud API key is configured or during network outages.

### FR-08: Multilingual Early-Warning Advisory & Voice Dispatcher
- **FR-08.1:** Support automated advisory localization in 7 languages:
  - *India:* Odia (`or-IN`), Bengali (`bn-IN`), Hindi (`hi-IN`), English (`en-IN`).
  - *South Africa:* isiZulu (`zu-ZA`), English (`en-ZA`).
  - *Brazil:* Portuguese (`pt-BR`).
  - *China:* Mandarin Chinese (`zh-CN`).
- **FR-08.2:** Provide a Web Speech API audio synthesis controller (`Play Voice Warning`) with real-time animated audio equalizer bars.
- **FR-08.3:** Display real-time multi-channel delivery metrics: SMS Broadcast Count, Marine VHF Radio channel status, and automated Panchayat IVR/Siren activation.

### FR-09: Executive Situation Report (SITREP) Generator
- **FR-09.1:** Generate an official, military/government-formatted Situation Report (SITREP) Bulletin with one click.
- **FR-09.2:** Include meteorological snapshot, complete critical asset exposure matrix with status diagnosis, Gemini spatial reasoning synthesis, and mobilization directives.
- **FR-09.3:** Support instant client-side download as a standard `.txt` executive briefing document.

### FR-10: Gemini API Key Management
- **FR-10.1:** Provide an in-app modal dialog enabling users to input and store their Google Gemini API key securely in browser `localStorage`.
- **FR-10.2:** Provide clear indicator showing whether live Gemini Cloud or embedded offline reasoning is active.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Performance & Latency
- **NFR-01:** Initial page load time must not exceed 1.5 seconds on a standard 4G mobile broadband connection.
- **NFR-02:** Time step scrubber updates (recomputing geometry, recalculating asset vulnerability, and re-rendering SVG markers) must complete in under 50ms.
- **NFR-03:** Live Gemini API calls shall feature an automatic timeout threshold of 12 seconds with seamless fallback to embedded heuristic spatial reasoning.

### 6.2 Ergonomics & Visual Design
- **NFR-04:** The UI must adhere strictly to **Tactical EOC Dark Glassmorphism** design standards to prevent eye fatigue during continuous 24-hour command shifts.
- **NFR-05:** Visual hierarchy must use high-visibility tactical accents (Cyan `#00f0ff`, Amber `#ff8400`, Red `#ff2a5f`, Neon Green `#00ffaa`) against low-reflectance dark slate (`#070a12`).

### 6.3 Security, Privacy & Data Sovereignty
- **NFR-06:** Zero telemetry or user location data shall be sent to external tracking servers.
- **NFR-07:** Gemini API keys must remain strictly within the client browser's `localStorage` and never be proxied or logged to intermediate servers.

### 6.4 Accessibility & Internationalization
- **NFR-08:** All interactive elements must provide distinct `aria-label` attributes, keyboard focus states, and semantic HTML5 structuring.
- **NFR-09:** Text contrast ratios must meet or exceed WCAG 2.1 Level AA standards (minimum 4.5:1 for normal text).
- **NFR-10:** Vernacular scripts (Odia, Bengali, Devanagari, Hanzi) must render with native font ligatures and zero text clipping.

---

## 7. Compliance & Standards Alignment

| Standard / Framework | Description | Aegis Implementation |
|:---|:---|:---|
| **Sendai Framework (2015–2030)** | Priority 4: Enhancing disaster preparedness for effective response | Direct anticipation of infrastructure failure before landfall |
| **UN Early Warnings for All (EW4All)** | Universal early warning coverage by 2027 | Multi-channel SMS, VHF, and voice alerts in indigenous languages |
| **BRICS Disaster Risk Management Accord** | Joint technological cooperation in coastal climate defense | Standardized data interchange across 4 continental basins |
| **OGC Standards (WGS 84)** | Open Geospatial Consortium coordinate representation | Decimal degrees coordinates for all eye points and assets |

---

## 8. Out of Scope & Product Roadmap

```
+-------------------------------------------------------------------------------+
| AEGIS RELEASE ROADMAP                                                         |
+-------------------------------------------------------------------------------+
| [v1.0 - Current Release]                                                      |
| - 4 BRICS coastal basins (India, South Africa, Brazil, China)                 |
| - Leaflet tactical GIS with asymmetric storm surge polygons                   |
| - Synthetic GEE Sentinel-1 SAR flood raster overlays                          |
| - Gemini 3.7 Flash spatial reasoning (Live + Offline Dual-Mode)               |
| - Multilingual voice synthesis (7 languages) + SITREP generator               |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| [v2.0 - Target Q4 2026]                                                       |
| - Direct Earth Engine Python API backend connector for real-time SAR pulls    |
| - Drone photogrammetry & post-landfall high-res damage bounding boxes         |
| - LoRaWAN mesh ground-sensor telemetry (river gauge & tide gauges)            |
| - Crowd-sourced citizen lifeline outage verification via WhatsApp bot         |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| [v3.0 - Target 2027]                                                          |
| - Automated SCADA micro-grid islanding triggers for electrical substations    |
| - Smart-contract parametric disaster insurance payout automation              |
| - Multi-agent autonomous drone swarm dispatch for corridor inspection         |
+-------------------------------------------------------------------------------+
```
