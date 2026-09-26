# Aegis — Product Requirements Document (PRD)

> **Document Status:** Active / Approved Baseline  
> **Version:** 2.0.0  
> **Track:** Track 05 — Resilience & Predictive Infrastructure Vulnerability (Code for Communities)  
> **Design Paradigm:** Swiss International Typographic Style (Objective High-Contrast EOC Grammar)  
> **Target Jurisdiction:** India (Primary — Bay of Bengal & Arabian Sea Coasts) & Sovereign Partner Basins  
> **Classification:** Sovereign Emergency Operations Center (EOC) Specification  

---

## 1. Executive Summary & Vision Statement

### 1.1 Executive Summary
**Aegis** is an anticipatory early-warning and critical infrastructure vulnerability forecasting platform engineered specifically for sovereign coastal disaster defense. Designed for the **National Disaster Management Authority (NDMA)**, State Disaster Management Authorities (**OSDMA, WB-SDMA, APSDMA, TNDMA, GSDMA**), and coastal Gram Panchayats across India's 7,516 km coastline, Aegis fuses **asymmetric hydrodynamic storm surge physics**, **Google Earth Engine (GEE) Sentinel-1 Synthetic Aperture Radar (SAR) telemetry**, and **Google Gemini 2.5 Flash & Multimodal Vision** into a unified, zero-latency Emergency Operations Center (EOC) platform.

The platform continuously models the projected 72-hour cyclone landfall cone, calculates localized ocean surge inundation using asymmetric hydrodynamic equations with planetary Coriolis bias, maps interdependencies across critical lifelines (220kV power substations, deep-water ports, medical hubs, evacuation bridges, and drinking water pumping stations), and generates automated, hyper-local multilingual advisories with text-to-speech voice broadcasts.

### 1.2 Vision Statement
> *"To eliminate preventable coastal casualties and prevent catastrophic cascade failures of lifelines across Indian and sovereign coastal corridors by shifting the disaster response paradigm from reactive recovery to proactive, physics-grounded anticipatory defense."*

---

## 2. Problem Statement & Background

### 2.1 The Coastal Climate Crisis in India & Coastal Nations
Over 250 million citizens along India's coastline face recurring severe cyclonic storms:
- **India (Bay of Bengal):** Odisha and West Bengal (Cyclone Dana, Fani, Yaas) and Andhra Pradesh / Tamil Nadu (Cyclone Michaung). High population density, low-lying coastal plains (<3m elevation), and saline mangrove deltas make storm surges exceptionally lethal.
- **India (Arabian Sea):** Gujarat, Maharashtra, and Kerala (Cyclone Biparjoy, Tauktae) facing heightened cyclone frequencies and industrial petrochemical port vulnerability.
- **Global Sovereign Analogs:** South Africa (Durban/KwaZulu-Natal), Brazil (Rio Grande do Sul), and China (South China Sea / Fujian).

### 2.2 The "72-Hour Anticipatory Action Blind Spot"
Emergency managers and District Emergency Operations Centers (DEOCs) consistently face three fatal bottlenecks during the pre-landfall window ($T-72\text{h}$ to $T-0\text{h}$):
1. **Telemetry Without Infrastructure Context:** Meteorological agencies issue track coordinates and wind speeds, but DEOC commanders cannot visualize how that translates to *which specific 220kV substation will be submerged* or *which evacuation bridge will become impassable*.
2. **Cascading Infrastructure Failures:** Infrastructure assets do not fail in isolation. When a coastal electrical substation floods, hospital backup diesel generators fail to receive fuel shipments due to inundated access roads, resulting in oxygen plant shutdowns and hospital evacuations during the height of the cyclone.
3. **The Vernacular Last-Mile Barrier:** Evacuation warnings are often broadcast in national languages with generic text formats. Rural coastal fishing communities, indigenous groups, and rural panchayats miss the critical evacuation window because warnings lack local dialect translations, audio voice broadcasts, or multi-channel delivery (VHF marine radio, SMS, IVR sirens).

---

## 3. Product Goals & Key Success Metrics (OKRs)

### 3.1 Primary Product Objectives
- **Objective 1:** Provide unified, real-time spatial awareness linking hydrodynamic storm surge polygons directly to critical infrastructure asset elevations and status.
- **Objective 2:** Automate spatial impact analysis using Google Gemini 2.5 Flash to diagnose cascading lifeline failures and deliver prioritized anticipatory action directives.
- **Objective 3:** Enable citizen damage photo triage using Google Gemini Multimodal Vision to inspect watermarks and structure damage for swift NDRF rescue unit dispatch.
- **Objective 4:** Enable multi-channel vernacular broadcast dispatch across Indian coastal languages (**Odia, Bengali, Hindi, English**) with one-click voice alerts.
- **Objective 5:** Provide automated, exportable executive Situation Reports (SITREPs) ready for NDMA, Cabinet, and military command briefing.

### 3.2 Key Performance Indicators & Target Metrics
| Metric ID | Description | Target Baseline | Aegis Target | Achieved Metric |
| :--- | :--- | :---: | :---: | :---: |
| **KPI-01** | Lead time for infrastructure vulnerability identification | $T-6\text{h}$ (Reactive) | **$T-72\text{h}$ to $T-48\text{h}$** | **$T-72\text{h}$ to $T-24\text{h}$ Anticipatory** |
| **KPI-02** | Time required to compile and issue an Executive SITREP | 3 to 5 hours | **< 5 seconds** | **< 1 second (Instantaneous)** |
| **KPI-03** | Multi-channel broadcast dispatch latency | 45 minutes | **< 30 seconds** | **Instantaneous** |
| **KPI-04** | Client-side GIS render frame rate under dense layer load | < 30 FPS | **60 FPS stable** | **60 FPS verified** |
| **KPI-05** | Offline resilience & failover capability | Total crash if cloud drops | **100% operational** | **100% via embedded physics & heuristic engine** |

---

## 4. User Personas & Journey Maps

```mermaid
journey
    title DEOC Commander Pre-Landfall Journey with Aegis
    section T-72h: Ingestion & Baseline
      Select Basin (India - Bay of Bengal): 5: DEOC Commander
      Inspect Cyclone Track & Eye Telemetry: 5: DEOC Commander
      View Threatened Asset Network: 4: Infrastructure Lead
    section T-48h: Inundation Modeling
      Engage Time Scrubber to T-48h: 5: DEOC Commander
      Evaluate Asymmetric Surge Polygon: 5: Coastal Engineer
      Detect High-Vulnerability Substations: 4: Power Grid Lead
    section T-24h: AI Synthesis & Directives
      Trigger Google Gemini 2.5 Flash Spatial Reasoner: 5: DEOC Commander
      Review Cascading Failure Directives: 5: DEOC Commander
      Inspect Citizen Damage Photos via Gemini Vision: 5: Field Triage Officer
      Dispatch Odia/Bengali Voice Warnings: 5: Field Dispatcher
    section Landfall & T+12h: Response & SITREP
      Monitor Real-Time SAR Flood Extents: 4: GIS Specialist
      Export Official Executive SITREP: 5: DEOC Commander
```

---

## 5. Functional Requirements (FR)

### FR-01: Multi-Corridor & National Basin Selection
- **FR-01.1:** Support rapid switching between primary Indian coastal corridors and global comparative analogs:
  1. *India — Bay of Bengal:* Odisha & West Bengal (Cyclone Dana — Dhamra, Bhadrak, Kendrapara, Digha).
  2. *India — Eastern Seaboard:* Andhra Pradesh & Tamil Nadu (Cyclone Michaung Analog).
  3. *India — Arabian Sea:* Gujarat & Saurashtra (Cyclone Biparjoy Analog).
  4. *South Africa:* Indian Ocean corridor (Cyclone Freddy — Durban/KwaZulu-Natal).
  5. *Brazil:* South Atlantic corridor (Rio Grande do Sul Extreme Surge).
  6. *China:* South China Sea corridor (Typhoon Doksuri — Fujian/Quanzhou).
- **FR-01.2:** Switching basins shall update the map viewport center, zoom level, weather HUD telemetry, infrastructure network, SAR raster overlays, and regional language options without full page reload.

### FR-02: Interactive Swiss International GIS Map Viewport
- **FR-02.1:** Render a high-performance, responsive GIS map canvas utilizing Esri Tactical Dark, Light, Satellite, and Topographic basemaps.
- **FR-02.2:** Support Common Operating Picture (COP) Focus mode that collapses all sidebars with one click to maximize map visibility for command video walls.
- **FR-02.3:** Map legend overlay indicating standardized emergency risk states: Submerged/Failed (Swiss Red `#FF3000`), Critical/Cut Off, Backup Power/Monitored, and Fortified/Safe.

### FR-03: Dynamic Storm Physics & Telemetry HUD
- **FR-03.1:** Display active cyclone name, international category classification, and human-readable corridor designation.
- **FR-03.2:** Provide real-time HUD telemetry cells displaying: Central Atmospheric Pressure (hPa), Maximum Sustained Wind Speed (km/h), Projected Peak Storm Surge Height (m MHW), 24-Hour Cumulative Precipitation (mm), and Exposed Population.

### FR-04: Multi-Layer Tactical GIS Overlays
- **FR-04.1:** Independent toggle controls for storm track & eye marker, wind swath cone of uncertainty, asymmetric hydrodynamic surge inundation polygon, GEE Sentinel-1 SAR flood water-masks, and critical infrastructure lifelines.
- **FR-04.2:** Support advanced spectral overlays: live Doppler radar simulation, NASA HD composite, thermal infrared cloud tops, FIRMS active thermal anomalies, and GPU-accelerated wind particle streamlines.

### FR-05: Critical Infrastructure Exposure & Vulnerability Network
- **FR-05.1:** Model 5 critical asset classes per basin: High-Voltage Electrical Substations (220kV/400kV), Deep-water Cargo & Petroleum Ports, Regional Medical Colleges & District Referral Hospitals, Strategic Coastal Arterial Highway Bridges, and Municipal Drinking Water Treatment Plants.
- **FR-05.2:** For each asset, model key telemetry attributes: asset name, type, exact latitude/longitude, ground elevation above Mean Sea Level (MSL), design operating capacity, status by simulation step, and impact diagnosis.
- **FR-05.3:** Automatically compute distance from eye, local wind speed, surge water level, and net inundation depth ($h = \max(0, \text{Surge} - \text{Elevation})$).

### FR-06: 5-Stage Temporal Simulation & Time Scrubber
- **FR-06.1:** Support 5 distinct temporal analysis steps: $T-72\text{h}$ (Deep Depression), $T-48\text{h}$ (Evacuation Window), $T-24\text{h}$ (Islanding & Defense), $\text{Landfall}$ (Active Peak Impact), and $T+12\text{h}$ (Damage Assessment).
- **FR-06.2:** Provide an interactive slider, clickable step markers, and an **Auto-Simulate Play/Pause** playback controller with cyclic loop support.

### FR-07: Google Gemini 2.5 Flash Spatial Reasoning & Multimodal Vision
- **FR-07.1:** Integrate Google Gemini 2.5 Flash (`gemini-2.5-flash`) via Google AI Studio / Vertex AI REST API for deep spatial reasoning, delivering:
  1. *Cascading Infrastructure Failure Pathways* (interdependent grid and hospital breakdowns).
  2. *Anticipatory Action Directives* (prioritized 3-step EOC orders before landfall).
  3. *Parametric Insurance & Emergency Liquidity Trigger* (automated loss estimation and contingency fund trigger).
- **FR-07.2:** **Gemini Multimodal Vision Triage:** Ingest citizen and field distress photos to classify structural damage severity, estimate flood watermarks, calculate Life-Safety Hazard Index, and recommend NDRF first-responder units.
- **FR-07.3:** Provide a zero-latency, high-fidelity offline heuristic reasoner when no cloud API key is configured or during network outages.

### FR-08: Multilingual Early-Warning Advisory & Voice Dispatcher
- **FR-08.1:** Support automated advisory localization in Indian coastal languages (**Odia, Bengali, Hindi, English**) and global comparative locales.
- **FR-08.2:** Provide a Web Speech API audio synthesis controller (`Play Voice Warning`) with real-time animated audio equalizer bars.
- **FR-08.3:** Display real-time multi-channel delivery metrics: 3GPP TS 23.041 Sachet Cell Broadcast, Marine VHF Ch. 16, and automated Panchayat IVR/Siren activation.

### FR-09: Executive Situation Report (SITREP) Generator
- **FR-09.1:** Generate an official, military/government-formatted Situation Report (SITREP) Bulletin with one click.
- **FR-09.2:** Include meteorological snapshot, complete critical asset exposure matrix with status diagnosis, Gemini spatial reasoning synthesis, and mobilization directives.
- **FR-09.3:** Support instant client-side download as a standard executive briefing document.

### FR-10: CIKR Public-Private Infrastructure Continuity Bridge
- **FR-10.1:** Map cross-sector stakeholder alignment across public emergency authorities and private utility operators.
- **FR-10.2:** Model live cascading domino failure chains from power substation flooding to port crane paralysis and hospital ICU fuel starvation.
- **FR-10.3:** Support interactive mitigation toggles (Microgrid Islanding, Inflatable Flood Barriers) and export ISO 22301 Business Continuity briefs.

### FR-11: National Systems & Global Interoperability Gateway
- **FR-11.1:** Generate fully validated **ITU-T X.1303 / OASIS CAP v1.2** XML and JSON public alerting feeds for direct integration into national alerting gateways (**NDMA Sachet**).
- **FR-11.2:** Map native emergency telecommunications infrastructure across **Cell Broadcast (3GPP TS 23.041)**, Marine VHF (Ch. 16 distress & NAVTEX 518 kHz), public emergency hotlines (112, 1077, 1554), and national spatial datums.
- **FR-11.3:** Provide a **Tactical Low-Bandwidth / Satcom Mode** generating compact `<1.2 KB` telemetry packets for 300-baud HF Packet Radio (Winlink/APRS), Marine SSB, or LoRaWAN mesh nodes.

### FR-12: CAD Incident Triage & NIMS Resource Tracking
- **FR-12.1:** Ingest distress calls from CAD 112, VHF Marine Ch. 16, and Panchayat beacons.
- **FR-12.2:** Compute dynamic urgency scores factoring in NIMS priority weight, exposed lives, surge depth anomaly, and queuing duration with 400m spatial deduplication.
- **FR-12.3:** Track standardized NIMS Kind & Type resource fleets (Swift-Water Rescue Boats Type 1-4, High-Capacity De-watering Pumps, Mobile Industrial Gensets, Air Ambulances).
- **FR-12.4:** Maintain an automated, SHA-256 verified Inter-Agency Activity Log compliant with FEMA/NDMA ICS Form 214.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Performance & Latency
- **NFR-01:** Initial page load time must not exceed 1.5 seconds on standard mobile broadband.
- **NFR-02:** Time step scrubber updates must complete in under 50ms with 60 FPS stable rendering.
- **NFR-03:** Live Gemini API calls shall feature an automatic timeout threshold with seamless fallback to embedded spatial reasoning.

### 6.2 Visual Ergonomics & Swiss International Aesthetic
- **NFR-04:** The UI must adhere strictly to **Swiss International Typographic Style (Bauhaus / Objective Swiss Grammar)**:
  - 0px border radius across all controls (`--radius-none: 0px !important`).
  - Strict high-contrast quad-tone palette: Pure White (`#FFFFFF`), Pure Black (`#000000`), Structural Gray (`#F2F2F2`), and Swiss Red (`#FF3000`).
  - 24x24px visible architectural grid lines and 2px/4px solid black dividing borders.
  - Zero decorative drop shadows; visual depth generated purely through geometric pattern layers.
- **NFR-05:** Photometric contrast must exceed WCAG 2.1 AAA standard (**21.0:1** for primary typography) to ensure flawless legibility on central EOC video wall projectors.
