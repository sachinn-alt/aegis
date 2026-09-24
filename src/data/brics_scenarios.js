// Aegis - All-BRICS Coastal Disaster & Storm Surge Dataset
// Complies with Track 05 (Resilience & Predictive Infrastructure Vulnerability)

export const BRICS_BASINS = {
  india: {
    id: "india",
    country: "India",
    flag: "🇮🇳",
    basinName: "Bay of Bengal",
    stormName: "Cyclone DANA (Severe Cyclonic Storm)",
    category: "Category 3 Equivalent",
    regionDescription: "Odisha & West Bengal Coastal Corridors (Dhamra, Bhadrak, Kendrapara, Digha)",
    center: [20.85, 87.05],
    zoom: 9,
    landfallLocation: "Dhamra Port, Bhadrak Coast (Odisha)",
    populationAtRisk: "3,850,000",
    languages: ["Odia", "Bengali", "Hindi", "English"],
    defaultLanguage: "Odia",
    maxSurgeEstimate: "3.6m above astronomical tide",
    historicalAnalog: "Cyclone FANI (2019) / Cyclone YASS (2021)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 06:00 UTC",
        eyeCoord: [16.8, 89.5],
        coneRadiusKm: 180,
        centralPressureHpa: 994,
        maxWindSpeedKmph: 75,
        forwardSpeedKmph: 18,
        surgeHeightM: 0.8,
        rainfallForecastMm24h: 65,
        status: "DEEP DEPRESSION",
        alertLevel: "YELLOW",
        advisoryAction: "Fishermen advisory issued; pre-positioning SDRF/NDRF battalions."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 06:00 UTC",
        eyeCoord: [18.5, 88.5],
        coneRadiusKm: 130,
        centralPressureHpa: 986,
        maxWindSpeedKmph: 105,
        forwardSpeedKmph: 15,
        surgeHeightM: 1.6,
        rainfallForecastMm24h: 140,
        status: "CYCLONIC STORM",
        alertLevel: "ORANGE",
        advisoryAction: "Mandatory evacuation of low-lying coastal kutcha settlements (<5km from coast)."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 06:00 UTC",
        eyeCoord: [19.9, 87.8],
        coneRadiusKm: 85,
        centralPressureHpa: 976,
        maxWindSpeedKmph: 130,
        forwardSpeedKmph: 12,
        surgeHeightM: 2.7,
        rainfallForecastMm24h: 260,
        status: "SEVERE CYCLONIC STORM",
        alertLevel: "RED",
        advisoryAction: "Port operations suspended; emergency power islanding activated at critical hospitals."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 02:00 UTC",
        eyeCoord: [20.82, 86.98],
        coneRadiusKm: 45,
        centralPressureHpa: 968,
        maxWindSpeedKmph: 145,
        forwardSpeedKmph: 10,
        surgeHeightM: 3.6,
        rainfallForecastMm24h: 380,
        status: "VERY SEVERE CYCLONE (LANDFALL)",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Total curfew in effect; storm surge inundation wave hitting Dhamra and Baitarani basin."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 14:00 UTC",
        eyeCoord: [21.6, 86.1],
        coneRadiusKm: 90,
        centralPressureHpa: 988,
        maxWindSpeedKmph: 70,
        forwardSpeedKmph: 14,
        surgeHeightM: 1.2,
        rainfallForecastMm24h: 110,
        status: "CYCLONIC DEPRESSION (INLAND)",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Clearance of arterial roads; rapid damage assessment via Sentinel-1 SAR flood imagery."
      }
    ],
    infrastructure: [
      {
        id: "in_sub_01",
        name: "Bhadrak 220kV Main Transmission Substation",
        type: "power",
        coords: [20.915, 86.512],
        elevationM: 2.2,
        capacity: "Powers 240,000 households & District Hospital",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "MONITORING",
          "T-24h": "HIGH_RISK",
          "Landfall": "INUNDATED_FAILED",
          "T+12h": "RESTORING"
        },
        impactDescription: "Saltwater surge penetration exceeds 1.8m barrier; requires emergency circuit isolation."
      },
      {
        id: "in_sub_02",
        name: "Dhamra Port Marine Electrical Substation",
        type: "power",
        coords: [20.798, 86.968],
        elevationM: 1.8,
        capacity: "Port Cranes & LNG Cargo Terminal",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPARATION",
          "T-24h": "DE-ENERGIZED",
          "Landfall": "SUBMERGED",
          "T+12h": "SUBMERGED"
        },
        impactDescription: "Direct storm surge strike; salt water immersion prevents re-energization for 72h."
      },
      {
        id: "in_hosp_01",
        name: "Kendrapara District Headquarters Hospital",
        type: "hospital",
        coords: [20.505, 86.422],
        elevationM: 4.5,
        capacity: "450 Beds | 28 ICU / Neonatal units",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "STOCKING",
          "T-24h": "BACKUP_POWER",
          "Landfall": "ISLAND_MODE",
          "T+12h": "OPERATIONAL"
        },
        impactDescription: "Structure elevated safely; perimeter access road flooded by 0.6m. Diesel genset operational."
      },
      {
        id: "in_hosp_02",
        name: "Basudevpur Community Health Centre (CHC)",
        type: "hospital",
        coords: [21.141, 86.745],
        elevationM: 2.1,
        capacity: "80 Beds | Coastal Trauma Centre",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPARATION",
          "T-24h": "PARTIAL_EVAC",
          "Landfall": "CUT_OFF",
          "T+12h": "WATERLOGGED"
        },
        impactDescription: "Surge waters submerge ground floor pharmacy; critical patients shifted to 1st floor."
      },
      {
        id: "in_shelter_01",
        name: "Dhamra Multipurpose Cyclone Shelter #04",
        type: "shelter",
        coords: [20.842, 86.912],
        elevationM: 5.2,
        capacity: "Design Capacity: 1,800 persons | Current: 2,450",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "INSPECTED",
          "T-48h": "RECEIVING",
          "T-24h": "AT_CAPACITY",
          "Landfall": "FORTIFIED_SAFE",
          "T+12h": "SHELTERING"
        },
        impactDescription: "Engineered stilt shelter remains dry; safe refuge for 6 surrounding fishing hamlets."
      },
      {
        id: "in_shelter_02",
        name: "Chandbali Regional Cyclone Shelter",
        type: "shelter",
        coords: [20.774, 86.743],
        elevationM: 4.8,
        capacity: "Design Capacity: 2,200 persons | Current: 1,980",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "INSPECTED",
          "T-48h": "RECEIVING",
          "T-24h": "ACTIVE",
          "Landfall": "FORTIFIED_SAFE",
          "T+12h": "RELIEF_DISTRIBUTION"
        },
        impactDescription: "Functioning as food and potable water staging ground for Baitarani delta."
      },
      {
        id: "in_road_01",
        name: "National Highway 16 (Bhadrak-Balasore Corridor)",
        type: "road",
        coords: [21.085, 86.625],
        elevationM: 3.1,
        capacity: "Primary National Arterial Evacuation Route",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "CLEAR",
          "T-48h": "HEAVY_CONGESTION",
          "T-24h": "RESTRICTED",
          "Landfall": "BREACHED_IMPENETRABLE",
          "T+12h": "CLEARING_DEBRIS"
        },
        impactDescription: "Flash flooding at Baitarani culvert cuts off northbound relief convoys during landfall."
      },
      {
        id: "in_bridge_01",
        name: "Baitarani River Bridge & Estuary Causeway",
        type: "bridge",
        coords: [20.871, 86.782],
        elevationM: 3.8,
        capacity: "Sole link between Kendrapara & Bhadrak",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "RESTRICTED_VEHICLES",
          "Landfall": "CLOSED_SUBMERGED_APPROACH",
          "T+12h": "INSPECTION_PENDING"
        },
        impactDescription: "High-velocity surge current makes approach causeway impassable; structural deck intact."
      }
    ]
  },

  south_africa: {
    id: "south_africa",
    country: "South Africa",
    flag: "🇿🇦",
    basinName: "Southwest Indian Ocean",
    stormName: "Tropical Cyclone FREDDY / Durban Coastal Surge",
    category: "Intense Tropical Cyclone",
    regionDescription: "KwaZulu-Natal Coastline (Durban Metro, Richards Bay, Umgeni River Delta)",
    center: [-29.85, 31.02],
    zoom: 9,
    landfallLocation: "Durban Metropolitan Harbor / Ballito Coast",
    populationAtRisk: "2,900,000",
    languages: ["isiZulu", "English", "Afrikaans"],
    defaultLanguage: "isiZulu",
    maxSurgeEstimate: "2.8m combined tidal swell & runoff wave",
    historicalAnalog: "2022 KZN Catastrophic Floods / Cyclone GAFILO",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Surge Peak",
        timestamp: "Day -3, 08:00 UTC",
        eyeCoord: [-27.2, 35.8],
        coneRadiusKm: 210,
        centralPressureHpa: 988,
        maxWindSpeedKmph: 85,
        forwardSpeedKmph: 22,
        surgeHeightM: 0.9,
        rainfallForecastMm24h: 80,
        status: "MODERATE TROPICAL STORM",
        alertLevel: "YELLOW",
        advisoryAction: "Port captain warning to commercial shipping outside Durban roadstead."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Surge Peak",
        timestamp: "Day -2, 08:00 UTC",
        eyeCoord: [-28.4, 33.6],
        coneRadiusKm: 140,
        centralPressureHpa: 975,
        maxWindSpeedKmph: 120,
        forwardSpeedKmph: 17,
        surgeHeightM: 1.8,
        rainfallForecastMm24h: 180,
        status: "TROPICAL CYCLONE",
        alertLevel: "ORANGE",
        advisoryAction: "Evacuation of low-lying informal settlements in Umgeni and Umlazi river basins."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Surge Peak",
        timestamp: "Day -1, 08:00 UTC",
        eyeCoord: [-29.3, 32.1],
        coneRadiusKm: 95,
        centralPressureHpa: 962,
        maxWindSpeedKmph: 140,
        forwardSpeedKmph: 13,
        surgeHeightM: 2.4,
        rainfallForecastMm24h: 310,
        status: "INTENSE TROPICAL CYCLONE",
        alertLevel: "RED",
        advisoryAction: "EThekwini Metro emergency activation; shut-down of Transnet freight rail lines."
      },
      {
        step: "Landfall",
        label: "Peak Coastal Impact",
        timestamp: "Peak Landfall, 04:00 UTC",
        eyeCoord: [-29.82, 31.05],
        coneRadiusKm: 50,
        centralPressureHpa: 954,
        maxWindSpeedKmph: 155,
        forwardSpeedKmph: 11,
        surgeHeightM: 2.8,
        rainfallForecastMm24h: 420,
        status: "PEAK SURGE & FLASH FLOODING",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Massive mudslides in hilly terrain; Durban port container yard inundated."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Peak",
        timestamp: "Day +1, 16:00 UTC",
        eyeCoord: [-30.4, 30.1],
        coneRadiusKm: 100,
        centralPressureHpa: 980,
        maxWindSpeedKmph: 65,
        forwardSpeedKmph: 16,
        surgeHeightM: 1.1,
        rainfallForecastMm24h: 90,
        status: "POST-TROPICAL DEPRESSION",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "SAPS and SANDF deployment for water supply restoration and bridge inspections."
      }
    ],
    infrastructure: [
      {
        id: "sa_port_01",
        name: "Port of Durban Container Pier 2 (Transnet)",
        type: "power",
        coords: [-29.878, 31.025],
        elevationM: 1.9,
        capacity: "Handles 65% of South Africa's container trade",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SECURED",
          "T-24h": "SUSPENDED",
          "Landfall": "INUNDATED_CRANES_OFFLINE",
          "T+12h": "PUMPING_WATER"
        },
        impactDescription: "Combined wave surge overtopping quay walls; rail freight marshaling yards flooded."
      },
      {
        id: "sa_hosp_01",
        name: "King Edward VIII Central Hospital (Congella)",
        type: "hospital",
        coords: [-29.872, 30.985],
        elevationM: 8.5,
        capacity: "922 Beds | Major Teaching Hospital",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NORMAL",
          "T-24h": "HIGH_DEMAND",
          "Landfall": "FLOODED_ROOF_AND_ACCESS",
          "T+12h": "OPERATIONAL"
        },
        impactDescription: "Access roads compromised by fallen trees and flash mudslides; generator fuel secured."
      },
      {
        id: "sa_sub_01",
        name: "Prospecton Industrial 132kV Substation",
        type: "power",
        coords: [-29.988, 30.932],
        elevationM: 1.5,
        capacity: "Powers Automotive Manufacturing & 110k homes",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SANDBAGGING",
          "T-24h": "TRIPPED",
          "Landfall": "SUBMERGED_FAILED",
          "T+12h": "DRAINING"
        },
        impactDescription: "Isipingo river overflow completely submerged switchyard; major economic blackout."
      },
      {
        id: "sa_bridge_01",
        name: "M4 Coastal Highway Umgeni River Bridge",
        type: "bridge",
        coords: [-29.805, 31.034],
        elevationM: 4.2,
        capacity: "Northern Durban Arterial Link",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "RESTRICTED",
          "Landfall": "APPROACH_COLLAPSED",
          "T+12h": "CLOSED_FOR_REPAIR"
        },
        impactDescription: "Scouring flood surge collapses southern road embankment, severing North Coast transit."
      }
    ]
  },

  brazil: {
    id: "brazil",
    country: "Brazil",
    flag: "🇧🇷",
    basinName: "South Atlantic",
    stormName: "Extratropical Cyclone / Rio Grande do Sul Coastal Surge",
    category: "Severe Extratropical Cyclone",
    regionDescription: "Laguna dos Patos Coastal Barrier & Porto de Rio Grande (RS)",
    center: [-32.05, -52.12],
    zoom: 9,
    landfallLocation: "Barra de Rio Grande / São José do Norte",
    populationAtRisk: "1,650,000",
    languages: ["Portuguese", "English"],
    defaultLanguage: "Portuguese",
    maxSurgeEstimate: "3.2m lake & ocean surge anomaly",
    historicalAnalog: "2023–2024 Catastrophic Rio Grande do Sul Basin Inundations",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Wind Spike",
        timestamp: "Day -3, 12:00 UTC",
        eyeCoord: [-35.5, -48.2],
        coneRadiusKm: 250,
        centralPressureHpa: 996,
        maxWindSpeedKmph: 65,
        forwardSpeedKmph: 24,
        surgeHeightM: 0.7,
        rainfallForecastMm24h: 55,
        status: "DEVELOPING LOW PRESSURE",
        alertLevel: "YELLOW",
        advisoryAction: "Defesa Civil emite alerta preventivo para lagoa e bacia costeira."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Wind Spike",
        timestamp: "Day -2, 12:00 UTC",
        eyeCoord: [-34.1, -50.1],
        coneRadiusKm: 170,
        centralPressureHpa: 984,
        maxWindSpeedKmph: 95,
        forwardSpeedKmph: 19,
        surgeHeightM: 1.5,
        rainfallForecastMm24h: 120,
        status: "EXTRATROPICAL CYCLONE",
        alertLevel: "ORANGE",
        advisoryAction: "Evacuação preventiva de vilas pesqueiras e ribeirinhas de São José do Norte."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Wind Spike",
        timestamp: "Day -1, 12:00 UTC",
        eyeCoord: [-33.2, -51.3],
        coneRadiusKm: 110,
        centralPressureHpa: 972,
        maxWindSpeedKmph: 120,
        forwardSpeedKmph: 15,
        surgeHeightM: 2.3,
        rainfallForecastMm24h: 210,
        status: "SEVERE INTENSIFYING CYCLONE",
        alertLevel: "RED",
        advisoryAction: "Interrupção do tráfego na BR-392; comporta de contenção de cheias fechada."
      },
      {
        step: "Landfall",
        label: "Peak Coastal Squeeze",
        timestamp: "Peak Surge, 06:00 UTC",
        eyeCoord: [-32.12, -52.05],
        coneRadiusKm: 60,
        centralPressureHpa: 964,
        maxWindSpeedKmph: 135,
        forwardSpeedKmph: 12,
        surgeHeightM: 3.2,
        rainfallForecastMm24h: 290,
        status: "PEAK SURGE SURROUND",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Águas da Lagoa dos Patos represadas pelo vento sul invadem centro histórico e cais."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Peak",
        timestamp: "Day +1, 18:00 UTC",
        eyeCoord: [-31.0, -53.5],
        coneRadiusKm: 120,
        centralPressureHpa: 982,
        maxWindSpeedKmph: 60,
        forwardSpeedKmph: 18,
        surgeHeightM: 1.6,
        rainfallForecastMm24h: 60,
        status: "DISSIPATING LOW",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Apoio humanitário do Exército Brasileiro e reconstrução de diques."
      }
    ],
    infrastructure: [
      {
        id: "br_port_01",
        name: "Superporto de Rio Grande (Terminal de Grãos)",
        type: "power",
        coords: [-32.085, -52.088],
        elevationM: 1.6,
        capacity: "Principal terminal de exportação de soja do Mercosul",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPARO",
          "T-24h": "SUSPENSO",
          "Landfall": "ALAGADO_SUBMERSO",
          "T+12h": "DRENAGEM"
        },
        impactDescription: "Empilhadeiras e armazéns costeiros inundados pela cheia da Lagoa dos Patos."
      },
      {
        id: "br_hosp_01",
        name: "Hospital Universitário Dr. Miguel Riet Corrêa Jr.",
        type: "hospital",
        coords: [-32.035, -52.095],
        elevationM: 3.2,
        capacity: "210 Leitos | UTI Neonatal Regional",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NORMAL",
          "T-24h": "GERADORES_PRONTOS",
          "Landfall": "CERCO_POR_ÁGUA",
          "T+12h": "OPERACIONAL"
        },
        impactDescription: "Acesso por ambulância limitado a veículos 4x4 do Exército; enfermaria intacta."
      },
      {
        id: "br_road_01",
        name: "Rodovia Federal BR-392 (Acesso ao Porto)",
        type: "road",
        coords: [-32.072, -52.145],
        elevationM: 1.9,
        capacity: "Corredor Logístico Vital",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "LIBERADA",
          "T-48h": "MONITORADA",
          "T-24h": "BLOQUEIO_PREVENTIVO",
          "Landfall": "SUBMERSA_60CM",
          "T+12h": "DESOBSTRUINDO"
        },
        impactDescription: "Trecho do km 18 submerso pela água da maré, paralisando 3.000 caminhões."
      }
    ]
  },

  china: {
    id: "china",
    country: "China",
    flag: "🇨🇳",
    basinName: "South China Sea / Western Pacific",
    stormName: "Super Typhoon DOKSURI",
    category: "Super Typhoon (Category 4/5)",
    regionDescription: "Pearl River Delta & Guangdong Industrial Seaboard",
    center: [22.54, 114.05],
    zoom: 9,
    landfallLocation: "Dapeng Peninsula / Shenzhen Coastal Bay",
    populationAtRisk: "12,400,000",
    languages: ["Mandarin", "Cantonese", "English"],
    defaultLanguage: "Mandarin",
    maxSurgeEstimate: "4.1m catastrophic storm surge wave",
    historicalAnalog: "Super Typhoon MANGKHUT (2018) / DOKSURI (2023)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 00:00 UTC",
        eyeCoord: [19.2, 119.5],
        coneRadiusKm: 220,
        centralPressureHpa: 965,
        maxWindSpeedKmph: 130,
        forwardSpeedKmph: 20,
        surgeHeightM: 1.1,
        rainfallForecastMm24h: 90,
        status: "TYPHOON",
        alertLevel: "YELLOW",
        advisoryAction: "Emergency maritime shelter return order for 14,000 fishing vessels."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 00:00 UTC",
        eyeCoord: [20.6, 117.2],
        coneRadiusKm: 150,
        centralPressureHpa: 945,
        maxWindSpeedKmph: 175,
        forwardSpeedKmph: 16,
        surgeHeightM: 2.2,
        rainfallForecastMm24h: 180,
        status: "SEVERE TYPHOON",
        alertLevel: "ORANGE",
        advisoryAction: "Suspension of high-speed rail lines and coastal container ports."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 00:00 UTC",
        eyeCoord: [21.8, 115.4],
        coneRadiusKm: 80,
        centralPressureHpa: 930,
        maxWindSpeedKmph: 205,
        forwardSpeedKmph: 14,
        surgeHeightM: 3.3,
        rainfallForecastMm24h: 340,
        status: "SUPER TYPHOON",
        alertLevel: "RED (CODE 1)",
        advisoryAction: "Mandatory four-stop directive (stop work, classes, transport, market operations)."
      },
      {
        step: "Landfall",
        label: "Direct Landfall Strike",
        timestamp: "Landfall Hour, 18:00 UTC",
        eyeCoord: [22.52, 114.12],
        coneRadiusKm: 40,
        centralPressureHpa: 922,
        maxWindSpeedKmph: 220,
        forwardSpeedKmph: 12,
        surgeHeightM: 4.1,
        rainfallForecastMm24h: 490,
        status: "SUPER TYPHOON LANDFALL",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Seawall overtopping in Dapeng Bay; massive storm surge pushing into estuary."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 06:00 UTC",
        eyeCoord: [23.8, 113.2],
        coneRadiusKm: 90,
        centralPressureHpa: 960,
        maxWindSpeedKmph: 110,
        forwardSpeedKmph: 18,
        surgeHeightM: 1.5,
        rainfallForecastMm24h: 140,
        status: "TYPHOON (INLAND TRACK)",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Emergency grid reconnect and seawall breach patching operations."
      }
    ],
    infrastructure: [
      {
        id: "cn_port_01",
        name: "Yantian Deepwater Container Port",
        type: "power",
        coords: [22.575, 114.262],
        elevationM: 2.4,
        capacity: "World's largest single container terminal",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "TYE_DOWN",
          "T-24h": "SHUTDOWN",
          "Landfall": "QUAY_INUNDATED",
          "T+12h": "DRAINAGE"
        },
        impactDescription: "4.1m surge overtops storm seawalls, flooding lower berth electric conduits."
      },
      {
        id: "cn_hosp_01",
        name: "Shenzhen University Coastal Medical Center",
        type: "hospital",
        coords: [22.535, 113.935],
        elevationM: 7.2,
        capacity: "1,200 Beds | Regional Disaster Triage Core",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SUPPLIES_IN",
          "T-24h": "ISLAND_READY",
          "Landfall": "HIGH_SURGE_ADMISSION",
          "T+12h": "OPERATIONAL"
        },
        impactDescription: "Engineered flood-proof basement pumps withstand inundation; fully operational."
      },
      {
        id: "cn_sub_01",
        name: "Daya Bay Coastal 500kV Interconnector Substation",
        type: "power",
        coords: [22.602, 114.542],
        elevationM: 4.8,
        capacity: "Feeds regional grid & nuclear power distribution line",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PROTECTED",
          "T-24h": "HARDENED",
          "Landfall": "DEFENDED_ISOLATED",
          "T+12h": "OPERATIONAL"
        },
        impactDescription: "Reinforced 5m flood barrier withstands peak surge wave with zero circuit breach."
      }
    ]
  },
  philippines: {
    id: "philippines",
    country: "Philippines",
    flag: "🇵🇭",
    basinName: "Western Pacific Basin",
    stormName: "Super Typhoon YOLANDA / HAIYAN Analog",
    category: "Category 5 Equivalent",
    regionDescription: "Eastern Visayas Corridor (Tacloban City, San Pedro Bay, Guiuan, Leyte)",
    center: [11.24, 125.00],
    zoom: 9,
    landfallLocation: "Guiuan & Tacloban City, Leyte",
    populationAtRisk: "2,400,000",
    languages: ["Tagalog", "Waray", "English"],
    defaultLanguage: "Tagalog",
    maxSurgeEstimate: "4.2m funneling in San Pedro Bay",
    historicalAnalog: "Super Typhoon Haiyan (Yolanda - 2013)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 06:00 UTC",
        eyeCoord: [8.8, 133.5],
        coneRadiusKm: 190,
        centralPressureHpa: 985,
        maxWindSpeedKmph: 120,
        forwardSpeedKmph: 24,
        surgeHeightM: 1.1,
        rainfallForecastMm24h: 80,
        status: "TYPHOON (INTENSIFYING)",
        alertLevel: "YELLOW",
        advisoryAction: "Small craft advisory broadcast on VHF Ch. 16; coastal fishing vessels recalled."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 06:00 UTC",
        eyeCoord: [9.8, 129.8],
        coneRadiusKm: 140,
        centralPressureHpa: 940,
        maxWindSpeedKmph: 185,
        forwardSpeedKmph: 26,
        surgeHeightM: 2.2,
        rainfallForecastMm24h: 180,
        status: "VERY STRONG TYPHOON",
        alertLevel: "ORANGE",
        advisoryAction: "Mandatory forced evacuation of shoreline barangays within 300m of high water."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 06:00 UTC",
        eyeCoord: [10.5, 126.8],
        coneRadiusKm: 80,
        centralPressureHpa: 905,
        maxWindSpeedKmph: 260,
        forwardSpeedKmph: 28,
        surgeHeightM: 3.5,
        rainfallForecastMm24h: 310,
        status: "SUPER TYPHOON (CAT 5)",
        alertLevel: "RED",
        advisoryAction: "Cell Broadcast RA 10639 nationwide push; Tacloban airport operations suspended."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 23:00 UTC",
        eyeCoord: [11.22, 125.01],
        coneRadiusKm: 40,
        centralPressureHpa: 895,
        maxWindSpeedKmph: 315,
        forwardSpeedKmph: 30,
        surgeHeightM: 4.2,
        rainfallForecastMm24h: 420,
        status: "CATASTROPHIC LANDFALL",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Absolute curfew; catastrophic funneling surge penetrating 1.5km inland."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 11:00 UTC",
        eyeCoord: [11.8, 122.2],
        coneRadiusKm: 85,
        centralPressureHpa: 945,
        maxWindSpeedKmph: 155,
        forwardSpeedKmph: 25,
        surgeHeightM: 1.4,
        rainfallForecastMm24h: 120,
        status: "TYPHOON (CROSSING VISAYAS)",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Search and rescue mobilization via San Juanico bridge access corridor."
      }
    ],
    infrastructure: [
      {
        id: "ph_port_01",
        name: "Tacloban Port Terminal & Pier",
        type: "power",
        coords: [11.246, 125.006],
        elevationM: 1.8,
        capacity: "Eastern Visayas Main Logistics Port",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PORT_SUSPENDED",
          "T-24h": "EVACUATED",
          "Landfall": "SUBMERGED_FAILURE",
          "T+12h": "DEBRIS_BLOCKED"
        },
        impactDescription: "4.2m storm surge wall completely overtops wharf cranes and cargo staging areas."
      },
      {
        id: "ph_hosp_01",
        name: "Eastern Visayas Regional Medical Center",
        type: "hospital",
        coords: [11.258, 124.995],
        elevationM: 8.5,
        capacity: "650 Beds | Regional Trauma Center",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "STOCK_OXYGEN",
          "T-24h": "ISLANDED_GENERATORS",
          "Landfall": "ROOF_COMPROMISED",
          "T+12h": "OVERCAPACITY"
        },
        impactDescription: "High ground preserves medical core; generator floor safe despite wind damage."
      },
      {
        id: "ph_bridge_01",
        name: "San Juanico Bridge Lifeline (Leyte-Samar)",
        type: "bridge",
        coords: [11.301, 124.978],
        elevationM: 41.0,
        capacity: "2.16km Critical Inter-Island Lifeline",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PATROLLED",
          "T-24h": "WIND_RESTRICTED",
          "Landfall": "CLOSED_TO_TRAFFIC",
          "T+12h": "STRUCTURAL_CHECK"
        },
        impactDescription: "Deck safe above surge water; closed during peak Category 5 winds >250 km/h."
      }
    ]
  },
  usa: {
    id: "usa",
    country: "United States",
    flag: "🇺🇸",
    basinName: "Gulf of Mexico",
    stormName: "Hurricane MILTON / HELENE Analog",
    category: "Category 4 Major Hurricane",
    regionDescription: "Florida Gulf Coast Corridor (Tampa Bay, St. Petersburg, Sarasota)",
    center: [27.85, -82.60],
    zoom: 9,
    landfallLocation: "Sarasota / Tampa Bay Entrance, Florida",
    populationAtRisk: "3,200,000",
    languages: ["English", "Spanish"],
    defaultLanguage: "English",
    maxSurgeEstimate: "3.8m above normal astronomical tide",
    historicalAnalog: "Hurricane Milton (2024) / Hurricane Ian (2022)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 09:00 EDT",
        eyeCoord: [22.8, -91.2],
        coneRadiusKm: 210,
        centralPressureHpa: 980,
        maxWindSpeedKmph: 110,
        forwardSpeedKmph: 16,
        surgeHeightM: 0.9,
        rainfallForecastMm24h: 50,
        status: "HURRICANE WATCH",
        alertLevel: "YELLOW",
        advisoryAction: "NOAA Hurricane Watch; mandatory bridge inspection crews on standby."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 09:00 EDT",
        eyeCoord: [24.5, -88.0],
        coneRadiusKm: 150,
        centralPressureHpa: 948,
        maxWindSpeedKmph: 175,
        forwardSpeedKmph: 19,
        surgeHeightM: 1.9,
        rainfallForecastMm24h: 120,
        status: "MAJOR HURRICANE WARNING",
        alertLevel: "ORANGE",
        advisoryAction: "FEMA IPAWS WEA push; mandatory evacuation for Zone A and barrier islands."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 09:00 EDT",
        eyeCoord: [26.2, -85.1],
        coneRadiusKm: 95,
        centralPressureHpa: 928,
        maxWindSpeedKmph: 220,
        forwardSpeedKmph: 22,
        surgeHeightM: 3.1,
        rainfallForecastMm24h: 240,
        status: "EXTREME SURGE THREAT",
        alertLevel: "RED",
        advisoryAction: "Port Tampa Bay closed; Sunshine Skyway bridge closed to high-profile traffic."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 01:30 EDT",
        eyeCoord: [27.35, -82.65],
        coneRadiusKm: 45,
        centralPressureHpa: 922,
        maxWindSpeedKmph: 235,
        forwardSpeedKmph: 24,
        surgeHeightM: 3.8,
        rainfallForecastMm24h: 360,
        status: "CAT 4 LANDFALL EYE",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Shelter in place immediately; life-threatening surge flooding Tampa Bay."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 13:30 EDT",
        eyeCoord: [28.6, -80.2],
        coneRadiusKm: 95,
        centralPressureHpa: 968,
        maxWindSpeedKmph: 130,
        forwardSpeedKmph: 28,
        surgeHeightM: 1.2,
        rainfallForecastMm24h: 110,
        status: "EXITING ATLANTIC COAST",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "US Army Corps of Engineers and power crews assessing electrical substations."
      }
    ],
    infrastructure: [
      {
        id: "us_sub_01",
        name: "Tampa Electric (TECO) Bayside Substation",
        type: "power",
        coords: [27.915, -82.418],
        elevationM: 2.1,
        capacity: "Powers 240,000 Downtown Tampa Connections",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "AQUAFENCE_DEPLOYED",
          "T-24h": "DE_ENERGIZED_PROTECTED",
          "Landfall": "SUBMERGED_FAILURE",
          "T+12h": "DRAINING_INSPECTION"
        },
        impactDescription: "3.8m surge breaches temporary AquaFence flood barriers; transformer bays flooded."
      },
      {
        id: "us_hosp_01",
        name: "Tampa General Hospital (Davis Islands)",
        type: "hospital",
        coords: [27.937, -82.460],
        elevationM: 3.8,
        capacity: "1,041 Beds | Level 1 Trauma Center",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "AQUAFENCE_RIGGED",
          "T-24h": "ISLAND_GENERATION",
          "Landfall": "ISLANDED_OPERATIONAL",
          "T+12h": "OPERATIONAL"
        },
        impactDescription: "Submarine-grade AquaFence wall holds; backup power keeps 1,000+ patients safe."
      },
      {
        id: "us_bridge_01",
        name: "Sunshine Skyway Bridge (I-275)",
        type: "bridge",
        coords: [27.620, -82.656],
        elevationM: 53.0,
        capacity: "Critical 6.7km Tampa Bay Evacuation Lifeline",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "MONITORED",
          "T-24h": "HIGH_PROFILE_BAN",
          "Landfall": "CLOSED_TO_ALL",
          "T+12h": "INSPECTION_REOPEN"
        },
        impactDescription: "Span closed due to sustained hurricane-force gusts >140 km/h."
      }
    ]
  }
};

export const GLOBAL_BASINS = BRICS_BASINS;
