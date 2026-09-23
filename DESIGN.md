# Aegis — Design Specification & UX Architecture (`DESIGN.md`)

> **Document Status:** Active / Design Baseline  
> **Version:** 1.0.0  
> **Design Paradigm:** Tactical Emergency Operations Center (EOC) Dark Glassmorphism  
> **Target Displays:** Command Room Video Walls (4K UHD), Workstations (1080p FHD), Ruggedized Field Laptops (1366x768+)  

---

## 1. Design Philosophy & Creative Vision

### 1.1 The Tactical EOC Imperative
In emergency disaster management, interface design is not merely aesthetic—**it is mission-critical cognitive engineering**. During a Category 3+ cyclonic storm:
- Operations room personnel endure 24- to 48-hour continuous shifts under low-light EOC environments. High-glare white dashboards cause severe ocular fatigue, delayed reaction times, and cognitive exhaustion.
- Critical signals must cut through noise instantly. Emergency managers have seconds to discern whether an electrical substation is submerged or a bridge has been closed.
- The interface must communicate authority, precision, and calm tactical control.

### 1.2 Core Design Principles
1. **Luminescent High-Contrast Accents on Deep Void:** Dark slate backgrounds (`#070a12`, `#0e1424`) paired with glowing neon tactical accents (`#00f0ff` Cyan, `#ff2a5f` Critical Red, `#ff8400` High Amber, `#00ffaa` Safe Green).
2. **Glassmorphism with Optical Depth:** Translucent frosted panels (`backdrop-filter: blur(16px)`) with subtle 1px border glows create distinct visual layering without cluttering the map viewport.
3. **Tabular & Telemetric Typography:** Separation of duties between **Outfit** (clean, authoritative geometric sans-serif for command text) and **JetBrains Mono** (monospaced, tabular numbers for coordinates, pressures, timestamps, and frequencies).
4. **Immediate Situational Legibility:** Visual cues (color, badge, pulse) precede text labels. An asset's status can be identified from 5 meters away on a central command wall display.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Color Tokens (`style.css`)

```css
:root {
  /* Surfaces & Canvas */
  --bg-primary: #070a12;               /* Deep void canvas */
  --bg-surface: #0e1424;               /* EOC header & structural elements */
  --bg-card: rgba(18, 25, 44, 0.75);   /* Frosted glass HUD panel */
  --bg-card-hover: rgba(26, 36, 62, 0.85);

  /* Tactical Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-tactical: rgba(0, 240, 255, 0.20);
  --border-tactical-glow: rgba(0, 240, 255, 0.40);

  /* Primary Brand & Tactical Accents */
  --accent-cyan: #00f0ff;              /* Spatial active stroke, telemetry values */
  --accent-cyan-dim: rgba(0, 240, 255, 0.15);
  --accent-blue: #2563eb;
  --accent-blue-neon: #3b82f6;

  /* Standardized Emergency Status Colors */
  --status-critical: #ff2a5f;          /* Submerged, Failed, Evacuate Now */
  --status-critical-bg: rgba(255, 42, 95, 0.15);
  --status-high: #ff8400;              /* Cut off, Severely Compromised */
  --status-high-bg: rgba(255, 132, 0, 0.15);
  --status-warning: #ffcc00;           /* Monitored, Backup Diesel Online */
  --status-warning-bg: rgba(255, 204, 0, 0.15);
  --status-safe: #00ffaa;              /* Fortified, Normal Operational */
  --status-safe-bg: rgba(0, 255, 170, 0.15);

  /* Typography Scale */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-mono: 'JetBrains Mono', monospace;
  --font-main: 'Outfit', sans-serif;

  /* Shadows & Radii */
  --shadow-hud: 0 8px 32px 0 rgba(0, 0, 0, 0.45);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

### 2.2 Contrast & Accessibility Verification
| Foreground Token | Background Canvas | Contrast Ratio | WCAG 2.1 Compliance |
|:---|:---|:---:|:---:|
| `--text-primary` (`#f8fafc`) | `--bg-primary` (`#070a12`) | **18.2 : 1** | AAA (Pass) |
| `--accent-cyan` (`#00f0ff`) | `--bg-card` (`#12192c`) | **10.5 : 1** | AAA (Pass) |
| `--status-critical` (`#ff2a5f`) | `--bg-card` (`#12192c`) | **5.4 : 1** | AA (Pass) |
| `--status-safe` (`#00ffaa`) | `--bg-card` (`#12192c`) | **11.8 : 1** | AAA (Pass) |
| `--text-secondary` (`#94a3b8`) | `--bg-primary` (`#070a12`) | **7.6 : 1** | AAA (Pass) |

---

## 3. Layout & Master Information Architecture

```
+-------------------------------------------------------------------------------------------------------------------------+
| [EOC TOPBAR HEADER]                                                                                                    |
|  🌀 AEGIS (BRICS Network) | Dropdown: Basin [India | SA | BR | CN] | Live Alert Chip | GEE Status | SITREP | Key |
+------------------------------------+---------------------------------------------------+--------------------------------+
| [LEFT PANEL (320px)]               | [CENTER VIEWPORT (Flex: 1)]                       | [RIGHT PANEL (360px)]          |
|                                    |                                                   |                                |
| +--------------------------------+ | +-----------------------------------------------+ | +----------------------------+ |
| | STORM SUMMARY CARD             | | | [TACTICAL GIS LEAFLET MAP VIEWPORT]           | | | GEMINI 3.7 FLASH SPATIAL     | |
| | Category 3 · Timestamp         | | |                                               | | | REASONING ENGINE           | |
| | Cyclone DANA                   | | |  * CartoDB Dark Matter Basemap                | | | [✨ Analyze Map]           | |
| | Telemetry:                     | | |  * Cyclone Track & Pulsing Eye Marker         | | |                            | |
| |  Pressure: 976 hPa             | | |  * Asymmetric Storm Surge Inundation Polygon  | | | Markdown Output:           | |
| |  Wind:     130 km/h            | | |  * Sentinel-1 SAR Flood Extent Raster         | | | 1. Cascading Failures      | |
| |  Surge:    2.7 m               | | |  * Critical Infrastructure Pulsing SVG Nodes  | | | 2. Anticipatory Directives | |
| |  Rain:     260 mm              | | |                                               | | | 3. Parametric Insurance    | |
| |  Population: 3,850,000         | | | [FLOATING MAP LEGEND]                         | | +----------------------------+ |
| +--------------------------------+ | |  🔴 Submerged  🟠 Critical  🟡 Alert  🟢 Safe  | |                              | |
|                                    | | +-----------------------------------------------+ | +----------------------------+ |
| +--------------------------------+ | | [FLOATING BOTTOM TIME SCRUBBER DOCK]            | | EARLY-WARNING ADVISORY       | |
| | TACTICAL GIS OVERLAYS          | | |                                               | | Language: [Odia | বাংলা ...] | |
| | [x] Track & Eye Radius         | | |  ANALYSIS TIMELINE: T-24h (24h Before)        | |                              | |
| | [x] Wind Swath Cone            | | |  [ ▶ Auto-Simulate ]                          | | Vernacular Script Warning    | |
| | [x] Surge Inundation Polygon   | | |                                               | | [ 🔊 Play Voice Warning ]    | |
| | [x] Sentinel-1 SAR (GEE)       | | |  (T-72h)---(T-48h)---[T-24h]---(Landfall)     | |   ||||| Audio Waveform       | |
| | [x] Critical Infrastructure    | | |                       *Active                 | |                              | |
| +--------------------------------+ | +-----------------------------------------------+ | Broadcast Telemetry:         | |
|                                    |                                                   |  SMS: 3.2M · VHF Ch.16 · IVR  | |
| +--------------------------------+ |                                                   | +----------------------------+ |
| | CRITICAL ASSET EXPOSURE (4)    | |                                                   |                                |
| | [Substation] 🔴 Submerged      | |                                                   |                                |
| | [Port]       🟠 Suspended      | |                                                   |                                |
| | [Hospital]   🟡 Islanded Aux   | |                                                   |                                |
| +--------------------------------+ |                                                   |                                |
+------------------------------------+---------------------------------------------------+--------------------------------+
```

---

## 4. Component Design Specifications

### 4.1 Header Bar & Brand Identity (`.eoc-header`)
- **Height:** `68px`, fixed at the top with `backdrop-filter: blur(16px)`.
- **Brand Radar Icon:** Dual-ring SVG pulsing radar beacon with central cyclone symbol (`🌀`).
- **Basin Dropdown Selector:** Styled dark select element with neon cyan focus ring and country flags (🇮🇳, 🇿🇦, 🇧🇷, 🇨🇳).
- **Status Indicators:**
  - `RED ALERT: LANDFALL IMMINENT` with pulsing red dot (`@keyframes blink`).
  - `GEE SATELLITE: INGESTING` with steady emerald status light.
- **Action Toolbar:** 
  - `📡 Test 404` (Direct routing to tactical diagnostic screen)
  - `🔑 Gemini Key` (Modal trigger)
  - `📄 Generate SITREP` (Accent button with cyan glow)

### 4.2 Left Panel: Telemetry HUD & Layer Controls (`.left-panel`)
- **Width:** `320px`, scrollable with concealed custom tactical scrollbar.
- **Storm Summary Card:**
  - Category Badge: Pill badge with dynamic background (`Category 3`, `Category 5`, `Severe Cyclonic Storm`).
  - Metric Grid: 2x2 grid displaying central pressure, sustained winds, surge height, and rainfall.
  - Large callout box for total coastal population exposed with user group icon.
- **Layer Toggles:**
  - Custom tactical toggle switches (`.toggle-slider`) with cyan active track slide.
  - Clear label hierarchy with descriptive subtext.
- **Asset Exposure Mini-List:**
  - Real-time filtered list of compromised assets.
  - Color-coded left border (4px solid status color) for immediate peripheral scanning.

### 4.3 Center Viewport: Tactical Leaflet GIS & Scrubber (`.center-viewport`)
- **Map Surface:** CartoDB Dark Matter raster tiles (`maxZoom: 18`) rendered within `#gisMap`.
- **Custom Map Elements:**
  - **Cyclone Eye:** Concentric pulsing SVG marker with outer warning radius circle.
  - **Asymmetric Surge Polygon:** Organic SVG path filled with `rgba(0, 240, 255, 0.22)` and a cyan glowing perimeter stroke (`#00f0ff`, `weight: 2`).
  - **Wind Swath Cone:** Semi-transparent directional cone (`rgba(255, 132, 0, 0.12)`).
  - **SAR Flood Overlay:** Texturized hatch raster displaying real satellite radar water backscatter.
  - **Asset Markers:** Custom HTML DivIcons with glowing status halos and interactive popup cards detailing elevation and capacity.
- **Floating Legend:** Anchored top-right of the map canvas with frosted glass background.
- **Time Scrubber Dock (`.time-scrubber-dock`):**
  - Docked 24px above map bottom, centered horizontally with subtle box shadow.
  - Features current time badge (`T-24h (24 Hours Before Landfall)`), Auto-Simulate toggle button, range slider, and 5 interactive milestone markers.

### 4.4 Right Panel: Gemini Spatial Reasoning & Dispatch (`.right-panel`)
- **Width:** `360px`, modular 2-card structure.
- **Gemini 3.7 Flash Card:**
  - Header: Purple sparkle icon with gradient model title.
  - Action Button: `✨ Analyze Map` with animated pulse ring.
  - Loader: Animated horizontal neon scanner beam traversing the card (`.scanner-line`).
  - Output Container: Clean Markdown formatting with syntax highlighting for section titles, bold warnings, and bullet points.
- **Multilingual Early-Warning Advisory Card:**
  - Language Selector: Dropdown updating local script typography in real-time.
  - Source Agency Tag (e.g., *OSDMA Emergency Broadcast*, *KZN Disaster Management*).
  - Vernacular Typography: Native rendering for Odia, Bengali, Hindi, isiZulu, Portuguese, and Mandarin.
  - Voice Alert Controller: Large button triggering `window.speechSynthesis` with animated 5-bar audio equalizer waveform (`.audio-wave-anim`).
  - Multi-Channel Metrics: Grid chips tracking SMS count, marine radio channel, and village siren activations.

---

## 5. Micro-Interactions & Animation Choreography

```
+-----------------------------------------------------------------------------------+
| KEYFRAME ANIMATIONS & TIMINGS                                                     |
+-----------------------------------------------------------------------------------+
| 1. Radar Pulse (Brand Beacon & Cyclone Eye)                                       |
|    @keyframes radar-pulse {                                                       |
|      0%   { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 0 0 rgba(...); }|
|      70%  { transform: scale(1.15); opacity: 0; box-shadow: 0 0 0 14px rgba(...);}|
|      100% { transform: scale(0.9); opacity: 0; }                                 |
|    } (Duration: 2.2s, infinite ease-out)                                          |
+-----------------------------------------------------------------------------------+
| 2. Emergency Status Blink (Red Alert Badge)                                      |
|    @keyframes blink {                                                             |
|      0%, 100% { opacity: 1; transform: scale(1); }                                |
|      50%      { opacity: 0.3; transform: scale(0.85); }                           |
|    } (Duration: 1.1s, infinite cubic-bezier(0.4, 0, 0.6, 1))                      |
+-----------------------------------------------------------------------------------+
| 3. Gemini Spatial Scanner Line                                                    |
|    @keyframes scanner-sweep {                                                     |
|      0%   { left: -100%; opacity: 0; }                                            |
|      50%  { opacity: 1; }                                                         |
|      100% { left: 100%; opacity: 0; }                                             |
|    } (Duration: 1.8s, infinite linear)                                            |
+-----------------------------------------------------------------------------------+
| 4. Audio Waveform Dancing Bars                                                    |
|    @keyframes wave-bar {                                                          |
|      0%, 100% { height: 4px; }                                                    |
|      50%      { height: 18px; }                                                   |
|    } (Staggered animation-delay: 0.1s to 0.4s across 5 bars)                      |
+-----------------------------------------------------------------------------------+
```

---

## 6. Responsive Adaptations & Form Factors

### 6.1 EOC Video Wall / 4K Command Center (3840 x 2160)
- Layout expands gracefully; map viewport scales dynamically to maximize geographic situational awareness.
- Fonts scale via `rem` units; metric figures expand for crisp readability across a 30-foot room.

### 6.2 Standard Workstation Monitor (1920 x 1080)
- Baseline reference design.
- Left panel: `320px`, Center map: `calc(100vw - 680px)`, Right panel: `360px`.
- Fixed 100vh viewport with internal scroll containers preventing window-level scrollbars.

### 6.3 Deployable Field Laptop & Tactical Tablet (1280 x 800)
- Left and right panels collapse into collapsible slide-over drawers with touch-friendly trigger buttons.
- Time scrubber dock compresses into a compact bottom toolbar.
- Floating legend shrinks into an expandable icon toggle.

---

## 7. Tactical 404 Telemetry Range Screen (`404.html`)

The 404 error page is designed as an integrated tactical extension of the EOC dashboard:
- **Title:** `404 — Sector Out of Telemetry Range`
- **Aesthetic:** Ambient crimson radial glow with glowing monospaced error code (`7rem`, `#ff2a5f` with text-shadow glow).
- **Subtext:** Explains sector loss within the BRICS Disaster Resilience Network.
- **Action Buttons:** Immediate return to National EOC or reload satellite telemetry coordinates.
