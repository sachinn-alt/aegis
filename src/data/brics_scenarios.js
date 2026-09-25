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
        id: "in_air_01",
        name: "Biju Patnaik International Airport (BBI) / Naval Air Hub",
        type: "airport",
        coords: [20.244, 85.818],
        elevationM: 42.0,
        capacity: "Runway 01/19 (2,743m) · Primary Regional Airlift & Relief Hub",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NORMAL",
          "T-24h": "EVAC_FLIGHTS",
          "Landfall": "GROUND_STOP_HIGH_WINDS",
          "T+12h": "RELIEF_AIRLIFT_ACTIVE"
        },
        impactDescription: "Primary strategic staging base for Indian Air Force C-130J & NDRF disaster relief convoys."
      },
      {
        id: "in_air_02",
        name: "Balasore / Rasgovindpur Coastal Defense Airstrip",
        type: "airport",
        coords: [21.552, 86.932],
        elevationM: 14.5,
        capacity: "Tactical Helicopter SAR & Drone Reconnaissance Base",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPOSITIONED",
          "T-24h": "SAR_STANDBY",
          "Landfall": "HANGAR_SHELTERED",
          "T+12h": "COASTAL_SURVEILLANCE"
        },
        impactDescription: "Indian Coast Guard Chetak helicopters and SAR drones pre-positioned for post-landfall damage survey."
      },
      {
        id: "in_port_01",
        name: "Dhamra All-Weather Deepwater Bulk & LNG Port",
        type: "seaport",
        coords: [20.805, 86.972],
        elevationM: 2.1,
        capacity: "18m Draft · Cape-size vessel berths & LNG Regasification",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "BERTHS_SECURED",
          "T-24h": "VESSELS_SENT_TO_ANCHORAGE",
          "Landfall": "SURGE_OVERTOPPING_QUAY",
          "T+12h": "DREDGING_INSPECTION"
        },
        impactDescription: "Direct storm surge strike; 3.6m surge inundates container yards and jetty conveyor galleries."
      },
      {
        id: "in_port_02",
        name: "Paradip Major Port Trust & Crude Oil Terminal",
        type: "seaport",
        coords: [20.262, 86.671],
        elevationM: 3.2,
        capacity: "140 Million MT/yr throughput · Strategic Petroleum Reserve",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SIGNAL_4_HOISTED",
          "T-24h": "SUSPENDED_GREAT_DANGER_10",
          "Landfall": "HIGH_SEAS_RESTRICTED",
          "T+12h": "ASSESSING_CHANNEL"
        },
        impactDescription: "Single point mooring shutdown; port tugs moved to inner harbor; harbor craft operational."
      },
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
        type: "highway",
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
    ],
    highways: [
      {
        id: "in_hw_01",
        name: "NH-16 Golden Quadrilateral Coastal Artery",
        code: "NH-16",
        lanes: "6 Lanes Divided",
        evacCapacity: "85,000 veh/day",
        coords: [
          [20.24, 85.82],
          [20.50, 86.12],
          [20.78, 86.40],
          [20.91, 86.51],
          [21.15, 86.68],
          [21.49, 86.92],
          [21.80, 87.15]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "CONGESTED",
          "T-24h": "RESTRICTED",
          "Landfall": "IMPASSABLE_FLOODED",
          "T+12h": "CLEARING_DEBRIS"
        },
        description: "Primary interstate lifeline connecting Cuttack, Bhadrak, and Balasore to Kolkata."
      },
      {
        id: "in_hw_02",
        name: "SH-9 Bhadrak-Dhamra Port Coastal Expressway",
        code: "SH-9",
        lanes: "4 Lanes",
        evacCapacity: "35,000 veh/day",
        coords: [
          [20.91, 86.51],
          [20.85, 86.68],
          [20.80, 86.85],
          [20.805, 86.972]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "HEAVY_EVACUATION",
          "T-24h": "HIGH_WATER_ALERT",
          "Landfall": "SUBMERGED_CLOSED",
          "T+12h": "RECEDING"
        },
        description: "Sole direct high-speed freight and evacuation corridor serving Dhamra Port."
      },
      {
        id: "in_hw_03",
        name: "NH-53 Cuttack-Paradip Port Heavy Freight Artery",
        code: "NH-53",
        lanes: "4 Lanes Divided",
        evacCapacity: "45,000 veh/day",
        coords: [
          [20.48, 85.90],
          [20.38, 86.25],
          [20.30, 86.50],
          [20.262, 86.671]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "TRUCKS_HALTED",
          "Landfall": "WATERLOGGED_EMERGENCY_ONLY",
          "T+12h": "OPEN"
        },
        description: "Vital logistics lifeline connecting the Mahanadi industrial belt to Paradip Sea Terminal."
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
    maxSurgeEstimate: "3.2m destructive storm wave",
    historicalAnalog: "2022 KZN Catastrophic Floods / Cyclone DEMOINA (1984)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 12:00 UTC",
        eyeCoord: [-27.2, 36.5],
        coneRadiusKm: 200,
        centralPressureHpa: 988,
        maxWindSpeedKmph: 90,
        forwardSpeedKmph: 22,
        surgeHeightM: 0.7,
        rainfallForecastMm24h: 50,
        status: "MODERATE TROPICAL STORM",
        alertLevel: "YELLOW",
        advisoryAction: "Port operations alert; beach swimming banned across eThekwini Municipality."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 12:00 UTC",
        eyeCoord: [-28.4, 34.2],
        coneRadiusKm: 140,
        centralPressureHpa: 974,
        maxWindSpeedKmph: 125,
        forwardSpeedKmph: 18,
        surgeHeightM: 1.5,
        rainfallForecastMm24h: 120,
        status: "SEVERE TROPICAL STORM",
        alertLevel: "ORANGE",
        advisoryAction: "Clearing of informal river settlements along Umgeni and Umlaas catchments."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 12:00 UTC",
        eyeCoord: [-29.3, 32.5],
        coneRadiusKm: 80,
        centralPressureHpa: 960,
        maxWindSpeedKmph: 155,
        forwardSpeedKmph: 14,
        surgeHeightM: 2.5,
        rainfallForecastMm24h: 240,
        status: "INTENSE TROPICAL CYCLONE",
        alertLevel: "RED",
        advisoryAction: "Transnet shuts harbor operations; coastal M4 highway closed to civilian traffic."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 04:00 UTC",
        eyeCoord: [-29.82, 31.05],
        coneRadiusKm: 40,
        centralPressureHpa: 952,
        maxWindSpeedKmph: 165,
        forwardSpeedKmph: 10,
        surgeHeightM: 3.2,
        rainfallForecastMm24h: 340,
        status: "VERY INTENSE CYCLONE (LANDFALL)",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Catastrophic flooding in progress; Umgeni estuary breach; power grid trip in south Durban."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 16:00 UTC",
        eyeCoord: [-30.4, 29.8],
        coneRadiusKm: 95,
        centralPressureHpa: 980,
        maxWindSpeedKmph: 80,
        forwardSpeedKmph: 16,
        surgeHeightM: 1.0,
        rainfallForecastMm24h: 90,
        status: "POST-TROPICAL DEPRESSION",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "SAPS and SANDF deployment for water supply restoration and bridge inspections."
      }
    ],
    infrastructure: [
      {
        id: "sa_air_01",
        name: "King Shaka International Airport (DUR)",
        type: "airport",
        coords: [-29.614, 31.119],
        elevationM: 92.0,
        capacity: "Runway 06/24 (3,700m) · Major SADC Strategic Airlift Gateway",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NORMAL",
          "T-24h": "FLIGHT_DELAYS",
          "Landfall": "RUNWAY_CLOSED_GUSTS",
          "T+12h": "OPERATIONAL_RELIEF"
        },
        impactDescription: "Plateau elevation prevents direct coastal surge flooding; crosswinds >120 km/h force ground stop during landfall."
      },
      {
        id: "sa_air_02",
        name: "Virginia Coastal Airport & Air Ambulance Helibase",
        type: "airport",
        coords: [-29.771, 31.059],
        elevationM: 4.5,
        capacity: "Coastal SAR & Maritime Emergency Helipad",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPARING",
          "T-24h": "EVACUATING_LIGHT_AIRCRAFT",
          "Landfall": "COASTAL_SURGE_FLOODING",
          "T+12h": "HELICOPTER_ONLY"
        },
        impactDescription: "Beachfront airstrip flooded by 1.8m coastal overwash; hangar tarmac unusable for fixed-wing aircraft."
      },
      {
        id: "sa_port_01",
        name: "Port of Durban Container Pier 2 (Transnet)",
        type: "seaport",
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
        id: "sa_port_02",
        name: "Richards Bay Deepwater Coal & Heavy Mineral Harbor",
        type: "seaport",
        coords: [-28.802, 32.045],
        elevationM: 2.8,
        capacity: "World's largest coal terminal · 91 Mt/yr export capacity",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SECURED",
          "T-24h": "BERTHING_SUSPENDED",
          "Landfall": "SWELL_WARNING_CLOSED",
          "T+12h": "INSPECTIONS"
        },
        impactDescription: "Heavy sea swell and coastal wave action trigger pilotage suspension; rail loading yards guarded."
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
        id: "sa_road_01",
        name: "N2 Coastal National Freeway (Durban Ring Road)",
        type: "highway",
        coords: [-29.845, 30.955],
        elevationM: 18.0,
        capacity: "Primary North-South Evacuation Expressway",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "CLEAR",
          "T-48h": "HEAVY_TRAFFIC",
          "T-24h": "SLIPWAYS_RESTRICTED",
          "Landfall": "LOCAL_MUDSLIDES",
          "T+12h": "CLEARING_LANES"
        },
        impactDescription: "Primary inland bypass around low-lying port industrial zone; vital for emergency vehicles."
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
    ],
    highways: [
      {
        id: "sa_hw_01",
        name: "N2 National Coastal Freeway",
        code: "N2",
        lanes: "6-8 Lanes Divided",
        evacCapacity: "95,000 veh/day",
        coords: [
          [-30.08, 30.85],
          [-29.95, 30.93],
          [-29.85, 30.96],
          [-29.72, 31.05],
          [-29.60, 31.12],
          [-29.45, 31.22]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "CONGESTED",
          "T-24h": "HIGH_WATER_RESTRICTION",
          "Landfall": "DEBRIS_AND_MUDSLIDES",
          "T+12h": "CLEARING_LANES"
        },
        description: "Primary multi-lane regional bypass route connecting South Coast, Durban Central, and North Coast."
      },
      {
        id: "sa_hw_02",
        name: "M4 Ruth First Coastal Highway",
        code: "M4",
        lanes: "4 Lanes",
        evacCapacity: "40,000 veh/day",
        coords: [
          [-29.87, 31.02],
          [-29.83, 31.03],
          [-29.78, 31.05],
          [-29.70, 31.08],
          [-29.65, 31.11]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "RESTRICTED",
          "Landfall": "BRIDGE_EMBANKMENT_COLLAPSE",
          "T+12h": "CLOSED_SEVERED"
        },
        description: "Scenic and arterial beachfront expressway running from Durban Harbor through Umhlanga Rocks."
      },
      {
        id: "sa_hw_03",
        name: "N3 Trans-Natal Freight Corridor",
        code: "N3",
        lanes: "8 Lanes Divided",
        evacCapacity: "70,000 veh/day",
        coords: [
          [-29.86, 31.01],
          [-29.83, 30.95],
          [-29.81, 30.85],
          [-29.78, 30.72]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "HEAVY_FREIGHT_RUSH",
          "T-24h": "CONTROLLED_FLOW",
          "Landfall": "OPEN_TO_EMERGENCY",
          "T+12h": "OPEN"
        },
        description: "Critical inland lifeline connecting Durban Harbour to Pietermaritzburg and Gauteng."
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
    maxSurgeEstimate: "2.8m wind set-up wave",
    historicalAnalog: "May 2024 Rio Grande do Sul Inundations / Cyclone YAKEEN (2022)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Horas Antes da Chegada",
        timestamp: "Dia -3, 00:00 UTC",
        eyeCoord: [-35.5, -48.2],
        coneRadiusKm: 250,
        centralPressureHpa: 998,
        maxWindSpeedKmph: 70,
        forwardSpeedKmph: 25,
        surgeHeightM: 0.6,
        rainfallForecastMm24h: 40,
        status: "DEPRESSÃO EXTRATROPICAL",
        alertLevel: "AMARELO",
        advisoryAction: "Alerta aos pescadores da Lagoa dos Patos e monitoramento dos canais de escoamento."
      },
      {
        step: "T-48h",
        label: "48 Horas Antes da Chegada",
        timestamp: "Dia -2, 00:00 UTC",
        eyeCoord: [-34.1, -50.1],
        coneRadiusKm: 180,
        centralPressureHpa: 985,
        maxWindSpeedKmph: 95,
        forwardSpeedKmph: 22,
        surgeHeightM: 1.4,
        rainfallForecastMm24h: 110,
        status: "CICLONE INTENSO EM FORMAÇÃO",
        alertLevel: "LARANJA",
        advisoryAction: "Fechamento de comportas e evacuação de áreas ribeirinhas vulneráveis em Rio Grande."
      },
      {
        step: "T-24h",
        label: "24 Horas Antes da Chegada",
        timestamp: "Dia -1, 00:00 UTC",
        eyeCoord: [-33.0, -51.3],
        coneRadiusKm: 110,
        centralPressureHpa: 972,
        maxWindSpeedKmph: 120,
        forwardSpeedKmph: 18,
        surgeHeightM: 2.2,
        rainfallForecastMm24h: 210,
        status: "CICLONE BOMBA EM FORMAÇÃO",
        alertLevel: "VERMELHO",
        advisoryAction: "Suspensão de atracações no Porto de Rio Grande; interdição preventiva da rodovia BR-392."
      },
      {
        step: "Landfall",
        label: "Pico do Ciclone e Ressaca",
        timestamp: "Hora do Impacto, 18:00 UTC",
        eyeCoord: [-32.08, -52.10],
        coneRadiusKm: 55,
        centralPressureHpa: 964,
        maxWindSpeedKmph: 140,
        forwardSpeedKmph: 15,
        surgeHeightM: 2.8,
        rainfallForecastMm24h: 290,
        status: "CICLONE EXTRATROPICAL SEVERO",
        alertLevel: "EXTREMO CRÍTICO",
        advisoryAction: "Transbordamento maciço da Laguna dos Patos; inundação da zona portuária e ilhas."
      },
      {
        step: "T+12h",
        label: "12 Horas Pós-Impacto",
        timestamp: "Dia +1, 06:00 UTC",
        eyeCoord: [-31.2, -53.4],
        coneRadiusKm: 120,
        centralPressureHpa: 982,
        maxWindSpeedKmph: 85,
        forwardSpeedKmph: 20,
        surgeHeightM: 1.3,
        rainfallForecastMm24h: 70,
        status: "SISTEMA SE AFASTANDO",
        alertLevel: "ÂMBAR RECUPERAÇÃO",
        advisoryAction: "Defesa Civil inicia desobstrução de vias e vistoria nas pontes da região."
      }
    ],
    infrastructure: [
      {
        id: "br_air_01",
        name: "Aeroporto Internacional de Pelotas (PET / SBPK)",
        type: "airport",
        coords: [-31.718, -52.327],
        elevationM: 18.0,
        capacity: "Pista 06/24 (1.980m) · Base de Apoio Aéreo Humanitário da FAB",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NORMAL",
          "T-24h": "APOIO_MILITAR",
          "Landfall": "CHUVA_FORTE_OPERANDO",
          "T+12h": "BASE_DE_SUPRIMENTOS"
        },
        impactDescription: "Base estratégica para cargueiros KC-390 da Força Aérea Brasileira transportando botes e filtros de água."
      },
      {
        id: "br_air_02",
        name: "Aeródromo Regional de Rio Grande / Helibase Defesa Civil",
        type: "airport",
        coords: [-32.083, -52.164],
        elevationM: 2.5,
        capacity: "Base de Helicópteros de Resgate e Evacuação Aeromédica",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPARO",
          "T-24h": "RESTRITO",
          "Landfall": "PISTA_ENCHARCADA",
          "T+12h": "OPERACAO_HELICOPTEROS"
        },
        impactDescription: "A pista fica encharcada pelo lençol freático alto; helicópteros operam a partir de plataformas elevadas."
      },
      {
        id: "br_port_01",
        name: "Porto de Rio Grande (Terminal de Grãos e Cargas)",
        type: "seaport",
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
        id: "br_port_02",
        name: "Superporto Oceânico de Rio Grande (Tecon Terminal)",
        type: "seaport",
        coords: [-32.148, -52.095],
        elevationM: 2.2,
        capacity: "Calado de 16m · Acesso direto ao Oceano Atlântico",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "AMARRAÇÃO_REFORÇADA",
          "T-24h": "FECHADO_MANOBRAS",
          "Landfall": "RESSACA_MOLHES_EXTERNOS",
          "T+12h": "VISTORIA_BALIZAMENTO"
        },
        impactDescription: "Ondulação oceânica superior a 4m sobrepõe os molhes da barra; navios em fundeio de segurança."
      },
      {
        id: "br_sub_01",
        name: "Subestação de Energia Rio Grande 230kV (CEEE)",
        type: "power",
        coords: [-32.042, -52.135],
        elevationM: 2.4,
        capacity: "Abastecimento elétrico de 210.000 habitantes",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "MONITORADA",
          "T-24h": "ALERTA_RISCO",
          "Landfall": "DESLIGAMENTO_PREVENTIVO",
          "T+12h": "RESTABELECENDO"
        },
        impactDescription: "Água da lagoa atinge pátio de transformadores; bombeamento emergencial ativado."
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
        type: "highway",
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
      },
      {
        id: "br_bridge_01",
        name: "Ponte dos Marinheiros (BR-392 Canal do Norte)",
        type: "bridge",
        coords: [-32.048, -52.122],
        elevationM: 4.1,
        capacity: "Ligação continental única entre Pelotas e Rio Grande",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "ABERTA",
          "T-48h": "ABERTA",
          "T-24h": "TRÁFEGO_LENTO",
          "Landfall": "RAMPAS_INUNDADAS",
          "T+12h": "LIBERAÇÃO_GRADUAL"
        },
        impactDescription: "Água da lagoa sobrepõe as cabeceiras da ponte, impedindo trânsito de veículos leves."
      }
    ],
    highways: [
      {
        id: "br_hw_01",
        name: "BR-392 Corredor Oceânico do Superporto",
        code: "BR-392",
        lanes: "Pista Dupla 4 Faixas",
        evacCapacity: "55.000 veic/dia",
        coords: [
          [-31.75, -52.32],
          [-31.90, -52.24],
          [-32.04, -52.13],
          [-32.08, -52.15],
          [-32.15, -52.10]
        ],
        statusByStep: {
          "T-72h": "ABERTA",
          "T-48h": "CONGESTIONADA",
          "T-24h": "BLOQUEIO_PARCIAL",
          "Landfall": "SUBMERSA_INTERDITADA",
          "T+12h": "DESOBSTRUINDO"
        },
        description: "Principal artéria logística federal conectando Pelotas ao Porto e às praias do Cassino."
      },
      {
        id: "br_hw_02",
        name: "BR-116 Corredor de Evacuação Costeira Sul",
        code: "BR-116",
        lanes: "4 Faixas",
        evacCapacity: "65.000 veic/dia",
        coords: [
          [-31.40, -51.95],
          [-31.55, -52.15],
          [-31.72, -52.35],
          [-31.90, -52.55]
        ],
        statusByStep: {
          "T-72h": "ABERTA",
          "T-48h": "INTENSA",
          "T-24h": "MONITORADA",
          "Landfall": "PONTOS_DE_ALAGAMENTO",
          "T+12h": "ABERTA"
        },
        description: "Espinha dorsal de transporte conectando a zona sul do Rio Grande do Sul a Porto Alegre."
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
    regionDescription: "Fujian & Quanzhou Coastal Industrial Corridor (Jinjiang, Shishi, Meizhou Bay)",
    center: [24.85, 118.65],
    zoom: 9,
    landfallLocation: "Jinjiang Coast / Quanzhou Bay (Fujian)",
    populationAtRisk: "8,900,000",
    languages: ["Mandarin", "English"],
    defaultLanguage: "Mandarin",
    maxSurgeEstimate: "3.8m destructive storm wave",
    historicalAnalog: "Super Typhoon DOKSURI (2023) / MERANTI (2016)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 00:00 UTC",
        eyeCoord: [19.2, 122.5],
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
        eyeCoord: [21.0, 120.8],
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
        eyeCoord: [23.1, 119.5],
        coneRadiusKm: 90,
        centralPressureHpa: 930,
        maxWindSpeedKmph: 205,
        forwardSpeedKmph: 14,
        surgeHeightM: 3.2,
        rainfallForecastMm24h: 310,
        status: "SUPER TYPHOON",
        alertLevel: "RED",
        advisoryAction: "Red alert curfew; 412,000 citizens evacuated from flood-prone coastal zones."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 01:55 UTC",
        eyeCoord: [24.60, 118.68],
        coneRadiusKm: 40,
        centralPressureHpa: 925,
        maxWindSpeedKmph: 220,
        forwardSpeedKmph: 12,
        surgeHeightM: 3.8,
        rainfallForecastMm24h: 460,
        status: "SUPER TYPHOON (LANDFALL)",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Category 5 landfall; Quanzhou Bay bridge closed; extreme seawall overtopping."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 14:00 UTC",
        eyeCoord: [26.1, 117.8],
        coneRadiusKm: 85,
        centralPressureHpa: 975,
        maxWindSpeedKmph: 85,
        forwardSpeedKmph: 18,
        surgeHeightM: 1.0,
        rainfallForecastMm24h: 140,
        status: "TROPICAL STORM (INLAND)",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Emergency drainage teams clearing expressways; power grid restoration."
      }
    ],
    infrastructure: [
      {
        id: "cn_air_01",
        name: "Quanzhou Jinjiang International Airport (JJN)",
        type: "airport",
        coords: [24.796, 118.589],
        elevationM: 12.0,
        capacity: "Runway 03/21 (2,600m) · 8.5M Passengers/yr",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SCHEDULE_REDUCED",
          "T-24h": "ALL_FLIGHTS_CANCELLED",
          "Landfall": "TYPHOON_LOCKDOWN",
          "T+12h": "INSPECTION_REOPENING"
        },
        impactDescription: "Civil aviation authority activates Red Alert; hangars secured for storm."
      },
      {
        id: "cn_air_02",
        name: "Xiamen Gaoqi International Airport (XMN)",
        type: "airport",
        coords: [24.544, 118.128],
        elevationM: 18.5,
        capacity: "Runway 05/23 (3,400m) · Strategic Cargo Airlift Hub",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NORMAL",
          "T-24h": "EVACUATION_FLIGHTS",
          "Landfall": "AIRPORT_SHUTDOWN",
          "T+12h": "RESUMING_CARGO"
        },
        impactDescription: "Critical regional airlift hub; northern runway boundary sea-defenses reinforced."
      },
      {
        id: "cn_port_01",
        name: "Port of Quanzhou (Shishi & Weitou Deepwater Terminal)",
        type: "seaport",
        coords: [24.815, 118.725],
        elevationM: 2.8,
        capacity: "Deepwater container berths · Silk Road Maritime Hub",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "CRANES_LASHED",
          "T-24h": "PORT_CLOSED",
          "Landfall": "SURGE_FLOOD_QUAY",
          "T+12h": "POST_STORM_SURVEY"
        },
        impactDescription: "Container gantry cranes anchored with typhoon clamps; quay deck inundated by 1.2m storm tide."
      },
      {
        id: "cn_port_02",
        name: "Port of Xiamen (Haicang Deepwater Container Terminal)",
        type: "seaport",
        coords: [24.462, 118.041],
        elevationM: 3.5,
        capacity: "Top-10 Global Container Port · 12M TEU/yr",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "VESSELS_EVACUATED",
          "T-24h": "TERMINAL_CLOSED",
          "Landfall": "TIDAL_SURGE_DEFENSE",
          "T+12h": "CHANNEL_SURVEY"
        },
        impactDescription: "Container operations suspended; storm barrier gates closed on inner lock system."
      },
      {
        id: "cn_sub_01",
        name: "500kV Jinjiang Transformation Substation",
        type: "power",
        coords: [24.825, 118.520],
        elevationM: 18.0,
        capacity: "Power Hub for Quanzhou Electronics Manufacturing Base",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "MONITORED",
          "T-24h": "GRID_ISLANDED",
          "Landfall": "SUB_ISLANDED_SAFE",
          "T+12h": "NORMAL_FEED"
        },
        impactDescription: "Elevated terrain prevents surge flooding; automatic high-wind trip protections enabled."
      },
      {
        id: "cn_hosp_01",
        name: "Quanzhou First Hospital (Bay Area Campus)",
        type: "hospital",
        coords: [24.885, 118.665],
        elevationM: 8.0,
        capacity: "1,800 Beds | Regional Disaster Trauma Center",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "STOCKING",
          "T-24h": "STANDBY_POWER",
          "Landfall": "EMERGENCY_ACTIVE",
          "T+12h": "OPERATIONAL"
        },
        impactDescription: "Full emergency backup power engaged; reinforced glass curtains withstand Category 5 wind loads."
      },
      {
        id: "cn_road_01",
        name: "G15 Shenhai Expressway (Shenyang-Haikou Coastal Artery)",
        type: "highway",
        coords: [24.895, 118.632],
        elevationM: 15.0,
        capacity: "10-lane Primary Regional Evacuation Route",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "CLEAR",
          "T-48h": "HIGH_EVACUATION_VOLUME",
          "T-24h": "RESTRICTED_TRUCKS",
          "Landfall": "BRIDGE_SECTIONS_CLOSED",
          "T+12h": "OPEN_TO_RELIEF"
        },
        impactDescription: "High-level viaducts closed to trucks during gusts exceeding 140 km/h."
      },
      {
        id: "cn_bridge_01",
        name: "Quanzhou Bay Cross-Sea Bridge",
        type: "bridge",
        coords: [24.845, 118.705],
        elevationM: 28.0,
        capacity: "26km Coastal Mega-Bridge",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "SPEED_REDUCED",
          "T-24h": "CLOSED_TO_TRUCKS",
          "Landfall": "TOTAL_CLOSURE_WIND",
          "T+12h": "STRUCTURAL_SCAN"
        },
        impactDescription: "Closed as sustained crosswinds exceed 160 km/h; dynamic aerodynamic monitors online."
      }
    ],
    highways: [
      {
        id: "cn_hw_01",
        name: "G15 Shenhai Coastal National Expressway",
        code: "G15",
        lanes: "8-10 Lanes Divided",
        evacCapacity: "120,000 veh/day",
        coords: [
          [24.45, 118.02],
          [24.60, 118.25],
          [24.75, 118.48],
          [24.89, 118.63],
          [25.05, 118.85]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "MASSIVE_EVAC_FLOW",
          "T-24h": "SPEED_RESTRICTED",
          "Landfall": "VIADUCTS_CLOSED_GUSTS",
          "T+12h": "OPEN_TO_EMERGENCY"
        },
        description: "Primary expressway artery spanning China's eastern maritime manufacturing corridor."
      },
      {
        id: "cn_hw_02",
        name: "S11 Quanzhou Coastal Loop Expressway",
        code: "S11",
        lanes: "6 Lanes",
        evacCapacity: "55,000 veh/day",
        coords: [
          [24.75, 118.55],
          [24.80, 118.65],
          [24.85, 118.71],
          [24.95, 118.75]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "RESTRICTED",
          "Landfall": "CLOSED_HIGH_WIND",
          "T+12h": "OPEN"
        },
        description: "Coastal beltway connecting Jinjiang industrial manufacturing parks to deepwater ports."
      }
    ]
  },

  philippines: {
    id: "philippines",
    country: "Philippines",
    flag: "🇵🇭",
    basinName: "Western Pacific Basin",
    stormName: "Super Typhoon YOLANDA (HAIYAN)",
    category: "Category 5 Super Typhoon",
    regionDescription: "Leyte Gulf & Tacloban Coastal Gateway (Eastern Visayas)",
    center: [11.24, 125.00],
    zoom: 10,
    landfallLocation: "Guiuan (Eastern Samar) & Tacloban City (Leyte)",
    populationAtRisk: "2,200,000",
    languages: ["Tagalog", "Waray-Waray", "English"],
    defaultLanguage: "Tagalog",
    maxSurgeEstimate: "5.2m catastrophic storm surge wave",
    historicalAnalog: "Super Typhoon HAIYAN / YOLANDA (2013)",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 06:00 UTC",
        eyeCoord: [8.5, 134.5],
        coneRadiusKm: 260,
        centralPressureHpa: 955,
        maxWindSpeedKmph: 160,
        forwardSpeedKmph: 32,
        surgeHeightM: 1.2,
        rainfallForecastMm24h: 70,
        status: "TYPHOON",
        alertLevel: "YELLOW",
        advisoryAction: "PAGASA issues Signal No. 1; pre-emptive evacuation in coastal barangays."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 06:00 UTC",
        eyeCoord: [9.6, 130.8],
        coneRadiusKm: 180,
        centralPressureHpa: 920,
        maxWindSpeedKmph: 235,
        forwardSpeedKmph: 35,
        surgeHeightM: 2.8,
        rainfallForecastMm24h: 190,
        status: "SUPER TYPHOON",
        alertLevel: "ORANGE",
        advisoryAction: "Signal No. 3; mandatory evacuation within 1km of shoreline across Leyte Gulf."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 06:00 UTC",
        eyeCoord: [10.4, 127.2],
        coneRadiusKm: 95,
        centralPressureHpa: 895,
        maxWindSpeedKmph: 295,
        forwardSpeedKmph: 38,
        surgeHeightM: 4.5,
        rainfallForecastMm24h: 360,
        status: "SUPER TYPHOON (RECORD INTENSITY)",
        alertLevel: "RED",
        advisoryAction: "Signal No. 4; catastrophic wind warnings; storm surge alert over 5 meters."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 20:40 UTC",
        eyeCoord: [11.20, 125.04],
        coneRadiusKm: 45,
        centralPressureHpa: 890,
        maxWindSpeedKmph: 315,
        forwardSpeedKmph: 35,
        surgeHeightM: 5.2,
        rainfallForecastMm24h: 490,
        status: "SUPER TYPHOON (LANDFALL)",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "5.2m tsunami-like storm surge submerges downtown Tacloban and airport."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 08:00 UTC",
        eyeCoord: [12.2, 121.5],
        coneRadiusKm: 90,
        centralPressureHpa: 935,
        maxWindSpeedKmph: 195,
        forwardSpeedKmph: 32,
        surgeHeightM: 1.5,
        rainfallForecastMm24h: 120,
        status: "TYPHOON (WEST PHILIPPINE SEA)",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Disaster declaration; armed forces initiate nationwide search and rescue."
      }
    ],
    infrastructure: [
      {
        id: "ph_air_01",
        name: "Daniel Z. Romualdez Airport (TAC / RPVA)",
        type: "airport",
        coords: [11.228, 125.028],
        elevationM: 3.1,
        capacity: "Runway 18/36 (2,138m) · Sole Regional Airport Gateway",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "AIRLIFTING_VULNERABLE",
          "T-24h": "TERMINAL_BOARDED",
          "Landfall": "RUNWAY_SUBMERGED_BY_SURGE",
          "T+12h": "DEBRIS_CLEARING"
        },
        impactDescription: "Peninsular location exposes runway to 4m storm surge across Cancabato Bay; catastrophic inundation."
      },
      {
        id: "ph_port_01",
        name: "Port of Tacloban Cargo & Inter-Island Wharves",
        type: "seaport",
        coords: [11.246, 125.006],
        elevationM: 2.0,
        capacity: "Inter-island RORO shipping & grain relief berths",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "NO_SAIL_ORDER",
          "T-24h": "VESSELS_BEACHED_SECURED",
          "Landfall": "SURGE_WAVE_IMPACT",
          "T+12h": "DAMAGE_REPORT"
        },
        impactDescription: "Direct storm surge strike pushes cargo vessels inland; port warehouse roofs destroyed by Category 5 winds."
      },
      {
        id: "ph_hosp_01",
        name: "Eastern Visayas Regional Medical Center",
        type: "hospital",
        coords: [11.265, 124.985],
        elevationM: 6.2,
        capacity: "500 Beds | Regional Referral Hospital",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "PREPARATION",
          "T-24h": "TRIAGE_READY",
          "Landfall": "FLOODED_EMERGENCY",
          "T+12h": "FIELD_HOSPITAL"
        },
        impactDescription: "Surge waters breach lower ground floor; backup generators damaged; field triage setup on roof."
      },
      {
        id: "ph_shelter_01",
        name: "Tacloban City Astrodome Evacuation Center",
        type: "shelter",
        coords: [11.232, 125.002],
        elevationM: 2.4,
        capacity: "Design Capacity: 4,000 persons",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "DESIGNATED",
          "T-48h": "SHELTERING",
          "T-24h": "OVERCROWDED",
          "Landfall": "COMPROMISED_SURGE",
          "T+12h": "EVACUATED"
        },
        impactDescription: "Inadequately elevated for 5m surge wave; flood waters entered stadium floor forcing evacuees into upper tiers."
      },
      {
        id: "ph_road_01",
        name: "Pan-Philippine Highway (AH26 / Maharlika Highway)",
        type: "highway",
        coords: [11.258, 124.965],
        elevationM: 8.5,
        capacity: "National Backbone Corridor connecting Luzon to Mindanao",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "HEAVY_CONGESTION",
          "T-24h": "RESTRICTED",
          "Landfall": "FALLEN_TREES_BLOCKED",
          "T+12h": "BULLDOZERS_CLEARING"
        },
        impactDescription: "Primary lifeline for humanitarian aid convoys traveling from Ormoc seaport."
      },
      {
        id: "ph_bridge_01",
        name: "San Juanico Bridge (Leyte-Samar Link)",
        type: "bridge",
        coords: [11.300, 124.980],
        elevationM: 41.0,
        capacity: "2.16km Critical Inter-Island Lifeline",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "RESTRICTED_VEHICLES",
          "Landfall": "CLOSED_EXTREME_WINDS",
          "T+12h": "INSPECTION_OPEN"
        },
        impactDescription: "Superstructure survived surge unharmed due to 41m clearance; approach roads blocked by debris."
      }
    ],
    highways: [
      {
        id: "ph_hw_01",
        name: "Pan-Philippine Highway AH26",
        code: "AH-26",
        lanes: "4 Lanes",
        evacCapacity: "45,000 veh/day",
        coords: [
          [11.12, 124.95],
          [11.22, 124.97],
          [11.26, 124.96],
          [11.30, 124.98],
          [11.38, 125.02]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "HEAVY_TRAFFIC",
          "T-24h": "RESTRICTED",
          "Landfall": "DEBRIS_AND_FLOOD_BLOCKED",
          "T+12h": "MILITARY_CLEARING"
        },
        description: "National spinal highway crossing Leyte and connecting across the San Juanico Strait to Samar."
      },
      {
        id: "ph_hw_02",
        name: "Tacloban Coastal Bypass Road",
        code: "TCBR",
        lanes: "4 Lanes",
        evacCapacity: "30,000 veh/day",
        coords: [
          [11.24, 125.00],
          [11.28, 124.95],
          [11.35, 124.90]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "HIGH_SURGE_RISK",
          "Landfall": "SUBMERGED_IMPASSABLE",
          "T+12h": "WATERLOGGED"
        },
        description: "Arterial route intended to bypass congested city center; low coastal elevation makes it surge vulnerable."
      }
    ]
  },

  usa: {
    id: "usa",
    country: "United States",
    flag: "🇺🇸",
    basinName: "Gulf of Mexico Basin",
    stormName: "Hurricane MILTON / Tampa Bay Surge",
    category: "Category 5 Major Hurricane",
    regionDescription: "Tampa Bay Metropolitan Area (Hillsborough, Pinellas, Manatee)",
    center: [27.85, -82.55],
    zoom: 10,
    landfallLocation: "Siesta Key / Tampa Bay Entrance (Florida)",
    populationAtRisk: "3,400,000",
    languages: ["English", "Spanish"],
    defaultLanguage: "English",
    maxSurgeEstimate: "4.5m peak storm surge",
    historicalAnalog: "Hurricane MILTON (2024) / 1921 Tampa Bay Hurricane",
    timeSteps: [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 12:00 UTC",
        eyeCoord: [22.2, -92.5],
        coneRadiusKm: 240,
        centralPressureHpa: 935,
        maxWindSpeedKmph: 220,
        forwardSpeedKmph: 18,
        surgeHeightM: 1.2,
        rainfallForecastMm24h: 80,
        status: "CATEGORY 4 HURRICANE",
        alertLevel: "YELLOW",
        advisoryAction: "Mandatory evacuation orders drafted for Evacuation Zones A and B."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 12:00 UTC",
        eyeCoord: [23.8, -88.6],
        coneRadiusKm: 160,
        centralPressureHpa: 905,
        maxWindSpeedKmph: 285,
        forwardSpeedKmph: 16,
        surgeHeightM: 2.6,
        rainfallForecastMm24h: 180,
        status: "CATEGORY 5 HURRICANE (EXPLOSIVE)",
        alertLevel: "ORANGE",
        advisoryAction: "Contraflow opened on I-4 Eastbound; 1.5 million residents evacuating."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 12:00 UTC",
        eyeCoord: [25.8, -85.2],
        coneRadiusKm: 85,
        centralPressureHpa: 915,
        maxWindSpeedKmph: 245,
        forwardSpeedKmph: 22,
        surgeHeightM: 3.8,
        rainfallForecastMm24h: 280,
        status: "MAJOR HURRICANE (CAT 4)",
        alertLevel: "RED",
        advisoryAction: "Sunshine Skyway & Howard Frankland bridges closed; port shut down under Condition Zulu."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 00:30 UTC",
        eyeCoord: [27.28, -82.55],
        coneRadiusKm: 35,
        centralPressureHpa: 928,
        maxWindSpeedKmph: 205,
        forwardSpeedKmph: 24,
        surgeHeightM: 4.5,
        rainfallForecastMm24h: 420,
        status: "CATEGORY 3/4 LANDFALL",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Catastrophic storm surge in Sarasota & Tampa Bay; Tropicana Field roof destroyed."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 12:00 UTC",
        eyeCoord: [28.8, -78.4],
        coneRadiusKm: 95,
        centralPressureHpa: 965,
        maxWindSpeedKmph: 130,
        forwardSpeedKmph: 28,
        surgeHeightM: 1.1,
        rainfallForecastMm24h: 90,
        status: "HURRICANE (ATLANTIC EXIT)",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Urban search and rescue deployed; inspecting water transmission mains."
      }
    ],
    infrastructure: [
      {
        id: "us_air_01",
        name: "Tampa International Airport (TPA / KTPA)",
        type: "airport",
        coords: [27.975, -82.533],
        elevationM: 7.9,
        capacity: "Runways 01L/19R, 01R/19L · 22M Passengers/yr",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "EVACUATION_FLIGHTS",
          "T-24h": "COMMERCIAL_OPS_SUSPENDED",
          "Landfall": "AIRFIELD_CLOSED_SURGE_GATE",
          "T+12h": "AIRFIELD_INSPECTION"
        },
        impactDescription: "Storm surge gates activated on perimeter canals; airfield closed to secure jet bridges and equipment."
      },
      {
        id: "us_air_02",
        name: "St. Pete-Clearwater International Airport (PIE)",
        type: "airport",
        coords: [27.910, -82.687],
        elevationM: 3.4,
        capacity: "US Coast Guard Air Station Clearwater (C-130 & Jayhawks)",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "USCG_FLIGHTS_STAGED",
          "T-24h": "MANDATORY_EVAC",
          "Landfall": "TARMAC_INUNDATED",
          "T+12h": "SAR_FLIGHTS_ACTIVE"
        },
        impactDescription: "Directly on Old Tampa Bay shoreline; 3m surge overtops perimeter fence, submerging taxiways."
      },
      {
        id: "us_port_01",
        name: "Port Tampa Bay Deepwater Cargo & Fuel Terminal",
        type: "seaport",
        coords: [27.935, -82.443],
        elevationM: 2.7,
        capacity: "Largest cargo port in Florida · Supplies 40% of state petroleum",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "USCG_PORT_YANKEE",
          "T-24h": "PORT_ZULU_CLOSED",
          "Landfall": "SURGE_OVERTOPPING_BERTHS",
          "T+12h": "HYDROGRAPHIC_SURVEY"
        },
        impactDescription: "Port condition ZULU set by Captain of the Port; fuel terminals de-energized to prevent explosion hazards."
      },
      {
        id: "us_port_02",
        name: "Port Manatee Deepwater Harbor",
        type: "seaport",
        coords: [27.638, -82.562],
        elevationM: 3.1,
        capacity: "Tampa Bay Southern Deepwater Bulk Entrance",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SECURED",
          "T-24h": "OPERATIONS_HALTED",
          "Landfall": "SURGE_DAMAGE",
          "T+12h": "SURVEY"
        },
        impactDescription: "Direct exposure to open Tampa Bay surge swell; breakwater and dock bollards submerged."
      },
      {
        id: "us_sub_01",
        name: "Tampa Electric TECO Big Bend 1,700MW Power Station",
        type: "power",
        coords: [27.795, -82.405],
        elevationM: 2.8,
        capacity: "Major Power Generation for 800,000 Customers",
        criticalLevel: "EXTREME",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "SANDBAGGING",
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
      },
      {
        id: "us_bridge_02",
        name: "Howard Frankland Bridge (I-275 Across Old Tampa Bay)",
        type: "bridge",
        coords: [27.915, -82.595],
        elevationM: 4.8,
        capacity: "Primary commuter artery between Tampa & St. Pete",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "HEAVY_CONGESTION",
          "T-24h": "CLOSED_SURGE_OVERWASH",
          "Landfall": "SUBMERGED_APPROACHES",
          "T+12h": "DEBRIS_INSPECTION"
        },
        impactDescription: "Waves crash over low-lying causeway spans; closed by Florida Highway Patrol."
      },
      {
        id: "us_road_01",
        name: "Interstate 4 (I-4 Eastbound Evacuation Corridor)",
        type: "highway",
        coords: [28.005, -82.355],
        elevationM: 14.2,
        capacity: "Designated Emergency Contraflow Evacuation Corridor",
        criticalLevel: "CRITICAL",
        statusByStep: {
          "T-72h": "NORMAL",
          "T-48h": "CONTRAFLOW_ACTIVE",
          "T-24h": "GRIDLOCK_CLEARING",
          "Landfall": "HIGH_WIND_SUSPENSION",
          "T+12h": "RELIEF_SUPPLY_ROUTE"
        },
        impactDescription: "Primary escape route for 1.2M Tampa Bay residents heading inland toward Orlando."
      },
      {
        id: "us_shelter_01",
        name: "Florida State Fairgrounds Mega-Shelter",
        type: "shelter",
        coords: [27.990, -82.360],
        elevationM: 12.5,
        capacity: "Design Capacity: 8,500 evacuees",
        criticalLevel: "HIGH",
        statusByStep: {
          "T-72h": "STAGED",
          "T-48h": "RECEIVING",
          "T-24h": "AT_CAPACITY",
          "Landfall": "FORTIFIED_SAFE",
          "T+12h": "TRANSITIONAL_CARE"
        },
        impactDescription: "Elevated inland site provides secure refuge outside all coastal storm surge zones."
      }
    ],
    highways: [
      {
        id: "us_hw_01",
        name: "Interstate 275 (I-275 Tampa-St. Petersburg Spinal Freeway)",
        code: "I-275",
        lanes: "8-10 Lanes Divided",
        evacCapacity: "110,000 veh/day",
        coords: [
          [27.55, -82.60],
          [27.62, -82.66],
          [27.76, -82.64],
          [27.92, -82.60],
          [27.96, -82.48],
          [28.05, -82.45]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "HEAVY_EVACUATION",
          "T-24h": "BRIDGES_CLOSED_SURGE",
          "Landfall": "CLOSED_OVERWASH",
          "T+12h": "INSPECTING_SPANS"
        },
        description: "Primary expressway crossing Tampa Bay over both the Sunshine Skyway and Howard Frankland bridges."
      },
      {
        id: "us_hw_02",
        name: "Interstate 4 (I-4 Eastbound Central Florida Mega-Corridor)",
        code: "I-4",
        lanes: "6-8 Lanes Contraflow",
        evacCapacity: "140,000 veh/day",
        coords: [
          [27.96, -82.45],
          [28.00, -82.35],
          [28.04, -82.20],
          [28.08, -82.00]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "CONTRAFLOW_ACTIVE",
          "T-24h": "HEAVY_CONGESTION",
          "Landfall": "SUSPENDED_HIGH_WINDS",
          "T+12h": "OPEN_CONVOYS"
        },
        description: "Major cross-peninsula evacuation expressway linking Tampa Bay to Orlando and Daytona Beach."
      },
      {
        id: "us_hw_03",
        name: "Gandy Boulevard & Bridge (FL-600)",
        code: "FL-600",
        lanes: "6 Lanes",
        evacCapacity: "50,000 veh/day",
        coords: [
          [27.88, -82.63],
          [27.88, -82.55],
          [27.89, -82.51]
        ],
        statusByStep: {
          "T-72h": "OPEN",
          "T-48h": "OPEN",
          "T-24h": "RESTRICTED",
          "Landfall": "CLOSED_SUBMERGED_CAUSEWAY",
          "T+12h": "CLEARING"
        },
        description: "Vital mid-bay crossing connecting south Tampa to Saint Petersburg."
      }
    ]
  }
};

export const GLOBAL_BASINS = BRICS_BASINS;
