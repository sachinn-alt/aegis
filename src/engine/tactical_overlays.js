// Aegis - Advanced Tactical Overlays Engine
// Generates specialized spatial analysis layers for EOC decision makers:
// 1. Tiered Coastal Evacuation Zones (Zone A Mandatory / Zone B Advisory)
// 2. Coastal Bathymetry & Shoaling Contours (GEBCO Depth Isobaths)
// 3. High-Voltage Power Transmission Lines & Substation Inter-Ties (CIKR Grid)
// 4. Commercial Maritime Navigational Channels & Vessel Shelter Anchorages

export class TacticalOverlaysEngine {
  constructor() {}

  // 1. Coastal Evacuation Zones (Polygons & Status by Step)
  getEvacZones(basinKey, currentStep) {
    const isLandfall = currentStep.step === "Landfall";
    const isT24 = currentStep.step === "T-24h";

    const zonesByBasin = {
      india: [
        {
          id: "in_evac_zone_a",
          name: "Zone A: Dhamra-Bhadrak Coastal Inundation Corridor",
          tier: "ZONE A (MANDATORY)",
          tierClass: "zone-mandatory",
          color: "#EF4444",
          fillOpacity: isLandfall ? 0.45 : 0.3,
          polygon: [
            [20.72, 86.85],
            [20.80, 87.05],
            [20.95, 87.12],
            [21.20, 87.05],
            [21.15, 86.85],
            [20.92, 86.75],
            [20.80, 86.78]
          ],
          popAtRisk: "420,000 residents",
          clearanceStatus: isLandfall ? "100% COMPLETED / CURFEW" : (isT24 ? "84% CLEARED (72,000 REMAINING)" : "EVACUATION IN PROGRESS (45%)"),
          designatedShelters: "68 Multipurpose Cyclone Shelters (ODSMA)",
          elevationProfile: "0.8m - 2.5m MSL (Extreme Flooding Risk)"
        },
        {
          id: "in_evac_zone_b",
          name: "Zone B: Baitarani Riverine Surge Backwater Basin",
          tier: "ZONE B (SECONDARY / HIGH-RISK)",
          tierClass: "zone-advisory",
          color: "#F59E0B",
          fillOpacity: 0.25,
          polygon: [
            [20.75, 86.55],
            [20.92, 86.74],
            [21.15, 86.84],
            [21.28, 86.65],
            [21.10, 86.48],
            [20.88, 86.42]
          ],
          popAtRisk: "680,000 residents",
          clearanceStatus: isLandfall ? "SHELTER-IN-PLACE ORDERED" : "VOLUNTARY / SPECIAL-NEEDS EVACUATION",
          designatedShelters: "42 Pucca School & College Elevated Hubs",
          elevationProfile: "2.5m - 5.0m MSL (Estuary Overbank Surge)"
        }
      ],
      south_africa: [
        {
          id: "za_evac_zone_a",
          name: "Zone A: Isipingo-Umlazi Lowland Coastal Belt",
          tier: "ZONE A (MANDATORY)",
          tierClass: "zone-mandatory",
          color: "#EF4444",
          fillOpacity: 0.35,
          polygon: [
            [-29.98, 30.92],
            [-29.95, 31.02],
            [-30.05, 31.00],
            [-30.08, 30.90]
          ],
          popAtRisk: "195,000 residents",
          clearanceStatus: isLandfall ? "COMPLETED" : "SEARCH & RELOCATION ACTIVE",
          designatedShelters: "eThekwini Civic Center & Elevated Halls",
          elevationProfile: "1.2m - 3.8m MSL"
        }
      ],
      brazil: [
        {
          id: "br_evac_zone_a",
          name: "Zona A: Balneário Cassino & Molhes da Barra",
          tier: "ZONA A (EVACUAÇÃO OBRIGATÓRIA)",
          tierClass: "zone-mandatory",
          color: "#EF4444",
          fillOpacity: 0.35,
          polygon: [
            [-32.18, -52.18],
            [-32.12, -52.05],
            [-32.25, -52.12],
            [-32.28, -52.22]
          ],
          popAtRisk: "62,000 residentes",
          clearanceStatus: isLandfall ? "ÁREA BLOQUEADA / 100%" : "EM ANDAMENTO (70%)",
          designatedShelters: "Ginásio Municipal e FURG Campus Carreiros",
          elevationProfile: "0.5m - 2.0m MSL"
        }
      ],
      china: [
        {
          id: "cn_evac_zone_a",
          name: "Zone A: Quanzhou Bay & Chongwu Peninsula Lowlands",
          tier: "ZONE A (MANDATORY CURFEW / RED)",
          tierClass: "zone-mandatory",
          color: "#EF4444",
          fillOpacity: 0.35,
          polygon: [
            [24.82, 118.68],
            [24.88, 118.88],
            [24.98, 118.95],
            [24.92, 118.72]
          ],
          popAtRisk: "310,000 residents",
          clearanceStatus: isLandfall ? "100% RELOCATED" : "MANDATORY THREE-HALT NOTICE",
          designatedShelters: "Quanzhou High-School Concrete Gymnasiums",
          elevationProfile: "1.0m - 3.2m MSL"
        }
      ],
      philippines: [
        {
          id: "ph_evac_zone_a",
          name: "Zone A: Tacloban San Pedro Bay Shoreline & Anibong",
          tier: "ZONE A (MANDATORY EVACUATION)",
          tierClass: "zone-mandatory",
          color: "#EF4444",
          fillOpacity: 0.35,
          polygon: [
            [11.21, 124.98],
            [11.26, 125.04],
            [11.28, 124.97],
            [11.23, 124.95]
          ],
          popAtRisk: "120,000 residents",
          clearanceStatus: isLandfall ? "NO ENTRY / DANGER ZONE" : "PRE-EMPTIVE RELOCATION (88%)",
          designatedShelters: "Tacloban Astrodome & Leyte Sports Complex",
          elevationProfile: "0.4m - 2.2m MSL"
        }
      ],
      usa: [
        {
          id: "us_evac_zone_a",
          name: "Zone A: South Tampa, Bayshore & Barrier Islands",
          tier: "ZONE A (MANDATORY ORDER)",
          tierClass: "zone-mandatory",
          color: "#EF4444",
          fillOpacity: 0.35,
          polygon: [
            [27.85, -82.52],
            [27.95, -82.48],
            [27.94, -82.43],
            [27.84, -82.45]
          ],
          popAtRisk: "380,000 residents",
          clearanceStatus: isLandfall ? "MANDATORY EVAC COMPLETE / ROADS CLOSED" : "CONTRAFLOW ACTIVE (78% EVACUATED)",
          designatedShelters: "Hillsborough County Special Needs Shelters",
          elevationProfile: "0.5m - 2.8m MSL"
        }
      ]
    };

    return zonesByBasin[basinKey] || zonesByBasin.india;
  }

  // 2. Coastal Bathymetry & Shoaling Contours (GEBCO Depth Isobaths)
  getBathymetry(basinKey) {
    const bathyByBasin = {
      india: [
        {
          depthM: -10,
          label: "-10m Shallow Coastal Shoal",
          color: "#38BDF8",
          weight: 2,
          shoalingFactor: "+45% Wave Surge Height Amplification",
          coords: [
            [20.65, 87.20],
            [20.85, 87.15],
            [21.10, 87.25],
            [21.45, 87.35]
          ]
        },
        {
          depthM: -20,
          label: "-20m Continental Transition Isobath",
          color: "#0284C7",
          weight: 2.5,
          shoalingFactor: "+20% Surge Shoaling Onset",
          coords: [
            [20.50, 87.40],
            [20.75, 87.35],
            [21.05, 87.48],
            [21.40, 87.60]
          ]
        },
        {
          depthM: -50,
          label: "-50m Continental Shelf Edge",
          color: "#0369A1",
          weight: 3,
          shoalingFactor: "Deepwater Propagation Limit",
          coords: [
            [20.30, 87.75],
            [20.60, 87.70],
            [20.90, 87.85],
            [21.25, 88.00]
          ]
        }
      ],
      south_africa: [
        {
          depthM: -20,
          label: "-20m Durban Coastal Bluff Shelf",
          color: "#38BDF8",
          weight: 2,
          shoalingFactor: "+30% Shoaling Wave Steepening",
          coords: [
            [-29.85, 31.10],
            [-29.95, 31.08],
            [-30.08, 31.02]
          ]
        },
        {
          depthM: -50,
          label: "-50m Agulhas Steep Shelf Edge",
          color: "#0369A1",
          weight: 3,
          shoalingFactor: "Rapid Oceanic Drop-off",
          coords: [
            [-29.80, 31.25],
            [-29.95, 31.20],
            [-30.12, 31.15]
          ]
        }
      ],
      brazil: [
        {
          depthM: -10,
          label: "-10m Barra do Rio Grande Banco dos Pargos",
          color: "#38BDF8",
          weight: 2,
          shoalingFactor: "+50% Surge Resonator Shoal",
          coords: [
            [-32.10, -52.00],
            [-32.22, -52.05],
            [-32.35, -52.12]
          ]
        },
        {
          depthM: -30,
          label: "-30m Atlântico Sul Plataforma",
          color: "#0369A1",
          weight: 2.5,
          shoalingFactor: "Ondas de Maré de Tempestade",
          coords: [
            [-32.05, -51.85],
            [-32.20, -51.90],
            [-32.40, -51.98]
          ]
        }
      ],
      china: [
        {
          depthM: -15,
          label: "-15m Quanzhou Bay Shallow Shoal",
          color: "#38BDF8",
          weight: 2,
          shoalingFactor: "+38% Channel Funneling Amplification",
          coords: [
            [24.75, 118.85],
            [24.88, 118.98],
            [25.02, 119.10]
          ]
        },
        {
          depthM: -40,
          label: "-40m Taiwan Strait Deep Passage",
          color: "#0369A1",
          weight: 2.5,
          shoalingFactor: "High-Current Tidal Waveguide",
          coords: [
            [24.70, 119.05],
            [24.85, 119.20],
            [25.00, 119.35]
          ]
        }
      ],
      philippines: [
        {
          depthM: -10,
          label: "-10m San Pedro Bay Funneling Shoal",
          color: "#38BDF8",
          weight: 2,
          shoalingFactor: "+60% Extreme Hydrodynamic Shoaling",
          coords: [
            [11.18, 125.05],
            [11.25, 125.08],
            [11.30, 125.02]
          ]
        },
        {
          depthM: -40,
          label: "-40m Leyte Gulf Deep Entrance",
          color: "#0369A1",
          weight: 3,
          shoalingFactor: "Oceanic Long-Period Waveguide",
          coords: [
            [11.10, 125.20],
            [11.20, 125.25],
            [11.35, 125.18]
          ]
        }
      ],
      usa: [
        {
          depthM: -5,
          label: "-5m Tampa Bay Inner Shallow Basin",
          color: "#38BDF8",
          weight: 2,
          shoalingFactor: "+55% Wind-Driven Water Pileup",
          coords: [
            [27.75, -82.60],
            [27.85, -82.55],
            [27.95, -82.46]
          ]
        },
        {
          depthM: -20,
          label: "-20m West Florida Continental Shelf",
          color: "#0369A1",
          weight: 2.5,
          shoalingFactor: "Extensive Shallow Continental Slope",
          coords: [
            [27.65, -82.85],
            [27.80, -82.80],
            [28.00, -82.75]
          ]
        }
      ]
    };

    return bathyByBasin[basinKey] || bathyByBasin.india;
  }

  // 3. High-Voltage Power Transmission Lines & Substation Inter-Ties
  getPowerGrid(basinKey, currentStep, isMicrogridIslanding = false) {
    const isLandfall = currentStep.step === "Landfall";
    const surge = currentStep.surgeHeightM;
    const isTripped = (isLandfall || surge > 2.5) && !isMicrogridIslanding;

    const gridByBasin = {
      india: [
        {
          id: "in_grid_01",
          name: "OPTCL 400kV Balasore-Bhadrak Bulk Corridor",
          voltage: "400 kV Extra-High Voltage",
          operator: "Odisha Power Transmission Corp (State Grid)",
          status: "ENERGIZED_NORMAL",
          color: "#10B981",
          coords: [
            [21.50, 86.92],
            [21.15, 86.68],
            [20.91, 86.51]
          ],
          capacityMw: "1,200 MW",
          downstream: "Feeds North Odisha industrial centers and hospital hubs."
        },
        {
          id: "in_grid_02",
          name: "OPTCL 220kV Bhadrak-Dhamra Quayside Inter-Tie",
          voltage: "220 kV Coastal Sub-Transmission",
          operator: "Tata Power Discom & DPCL Concession",
          status: isTripped ? "TRIPPED (SURGE INUNDATION AT 18KM POST)" : (isMicrogridIslanding ? "ISLANDED (LOCAL DIESEL/BATTERY ACTIVE)" : "STANDBY RESILIENT"),
          color: isTripped ? "#EF4444" : (isMicrogridIslanding ? "#F59E0B" : "#10B981"),
          coords: [
            [21.05, 86.50],
            [20.92, 86.65],
            [20.81, 86.95]
          ],
          capacityMw: "350 MW",
          downstream: "Primary feed to Dhamra LNG Terminal & Basudevpur Emergency Health Center."
        }
      ],
      south_africa: [
        {
          id: "za_grid_01",
          name: "Eskom 275kV Klaarwater-Prospecton Heavy Industrial Corridor",
          voltage: "275 kV Industrial Transmission",
          operator: "Eskom Holdings SOC Ltd",
          status: isTripped ? "SUBSTATION FLOODED" : "ISLANDED MICROGRID",
          color: isTripped ? "#EF4444" : "#10B981",
          coords: [
            [-29.88, 30.85],
            [-29.95, 30.95],
            [-29.98, 31.00]
          ],
          capacityMw: "800 MW",
          downstream: "Powers Toyota Prospecton auto manufacturing and port container pumps."
        }
      ],
      brazil: [
        {
          id: "br_grid_01",
          name: "CEEE / Equatorial 230kV Linha Candiota-Pelotas-Rio Grande",
          voltage: "230 kV Rede Básica Costeira",
          operator: "Equatorial Energia RS",
          status: isTripped ? "LINHA DESLIGADA POR SEGURANÇA" : "SUBESTAÇÃO BLINDADA",
          color: isTripped ? "#EF4444" : "#10B981",
          coords: [
            [-31.75, -52.35],
            [-31.95, -52.22],
            [-32.05, -52.10]
          ],
          capacityMw: "600 MW",
          downstream: "Alimenta os Terminais Portuários do Superporto e Hospital Universitário."
        }
      ],
      china: [
        {
          id: "cn_grid_01",
          name: "State Grid Fujian 500kV Quanzhou Coastal Double Circuit",
          voltage: "500 kV Ultra-Reliable Coastal Loop",
          operator: "State Grid Fujian Electric Power Co.",
          status: isTripped ? "LINE DISPATCH CONTINGENCY" : "AUTOMATED SECTIONALIZED",
          color: isTripped ? "#EF4444" : "#10B981",
          coords: [
            [25.10, 118.60],
            [24.95, 118.70],
            [24.80, 118.65]
          ],
          capacityMw: "2,400 MW",
          downstream: "Guarantees uninterruptible supply to Jinjiang Microchip Fab & Harbor Cranes."
        }
      ],
      philippines: [
        {
          id: "ph_grid_01",
          name: "NGCP 138kV Tongonan Geothermal-Ormoc-Tacloban Grid",
          voltage: "138 kV Regional Transmission Line",
          operator: "National Grid Corporation of the Philippines",
          status: isTripped ? "LINE DE-ENERGIZED (STORM GUST BREACH)" : "MICROGRID BACKUP",
          color: isTripped ? "#EF4444" : "#10B981",
          coords: [
            [11.10, 124.60],
            [11.20, 124.80],
            [11.24, 124.98]
          ],
          capacityMw: "220 MW",
          downstream: "Supplies EVRMC Hospital, municipal water treatment, and relief hub."
        }
      ],
      usa: [
        {
          id: "us_grid_01",
          name: "TECO 230kV Big Bend Power Plant to Tampa Bulk Substation",
          voltage: "230 kV Metro Backbone",
          operator: "Tampa Electric (TECO / Emera)",
          status: isTripped ? "BREAKER TRIPPED AT WATER LEVEL +2.6M" : "AQUAFENCE DEFENDED",
          color: isTripped ? "#EF4444" : "#10B981",
          coords: [
            [27.79, -82.40],
            [27.88, -82.42],
            [27.95, -82.45]
          ],
          capacityMw: "1,800 MW",
          downstream: "Supplies Port Tampa Bay jet fuel pump farm and Tampa General Hospital."
        }
      ]
    };

    return gridByBasin[basinKey] || gridByBasin.india;
  }

  // 4. Commercial Maritime Navigational Channels & Vessel Shelter Anchorages
  getMarineCorridors(basinKey, currentStep) {
    const isLandfall = currentStep.step === "Landfall";
    const portStatus = isLandfall ? "CONDITION ZULU (PORT CLOSED / ALL SHIPS EVACUATED)" : "CONDITION YANKEE (CONTAINER GANTRY CRANES LASHED)";

    const marineByBasin = {
      india: [
        {
          id: "in_mar_channel",
          name: "Dhamra Port Deepwater Navigation Fairway (18.5m Draft)",
          type: "COMMERCIAL SHIPPING CHANNEL",
          status: portStatus,
          color: "#06B6D4",
          weight: 4,
          dashArray: "8, 6",
          coords: [
            [20.78, 87.00],
            [20.80, 87.10],
            [20.85, 87.25],
            [20.90, 87.40]
          ],
          details: "Dredged approach channel for Capesize LNG and dry bulk carriers. Clearance width: 250m."
        },
        {
          id: "in_mar_anchorage",
          name: "Designated Storm Anchorage Zone C (Offshore Standoff)",
          type: "OFFSHORE SAFE ANCHORAGE",
          status: "ANCHORAGE EVACUATION ORDERED (35NM OFFSHORE)",
          color: "#14B8A6",
          polygon: [
            [20.65, 87.35],
            [20.75, 87.45],
            [20.70, 87.55],
            [20.60, 87.45]
          ],
          details: "Safe deepwater holding area for container vessels during minor squalls; vacated during Category 3+ surge."
        }
      ],
      south_africa: [
        {
          id: "za_mar_channel",
          name: "Port of Durban Harbour Entrance Fairway (16m Draft)",
          type: "COMMERCIAL SHIPPING CHANNEL",
          status: portStatus,
          color: "#06B6D4",
          weight: 4,
          dashArray: "8, 6",
          coords: [
            [-29.86, 31.05],
            [-29.87, 31.10],
            [-29.88, 31.18]
          ],
          details: "Main navigation fairway into Pier 1 and Pier 2 container terminals."
        }
      ],
      brazil: [
        {
          id: "br_mar_channel",
          name: "Canal de Acesso ao Porto de Rio Grande (18m Calado)",
          type: "CANAL DE NAVEGAÇÃO MARÍTIMA",
          status: portStatus,
          color: "#06B6D4",
          weight: 4,
          dashArray: "8, 6",
          coords: [
            [-32.12, -52.08],
            [-32.18, -52.05],
            [-32.25, -51.98]
          ],
          details: "Canal dragado protegido pelos Molhes da Barra; fechado pela Capitania dos Portos."
        }
      ],
      china: [
        {
          id: "cn_mar_channel",
          name: "Quanzhou Bay Commercial Approach Channel",
          type: "MAIN VESSEL FAIRWAY",
          status: portStatus,
          color: "#06B6D4",
          weight: 4,
          dashArray: "8, 6",
          coords: [
            [24.85, 118.75],
            [24.82, 118.88],
            [24.80, 119.00]
          ],
          details: "Strict vessel standoff enforced by Maritime Safety Administration (MSA)."
        }
      ],
      philippines: [
        {
          id: "ph_mar_channel",
          name: "San Pedro Bay Navigation & Ferry Route",
          type: "INTER-ISLAND MARITIME FAIRWAY",
          status: portStatus,
          color: "#06B6D4",
          weight: 4,
          dashArray: "8, 6",
          coords: [
            [11.23, 125.00],
            [11.20, 125.08],
            [11.15, 125.18]
          ],
          details: "Philippine Coast Guard no-sail directive enforced across all RORO vessels."
        }
      ],
      usa: [
        {
          id: "us_mar_channel",
          name: "Tampa Bay Cut A / Egmont Key Deepwater Channel",
          type: "DEEPWATER TANKER FAIRWAY (43ft)",
          status: portStatus,
          color: "#06B6D4",
          weight: 4,
          dashArray: "8, 6",
          coords: [
            [27.60, -82.78],
            [27.70, -82.68],
            [27.85, -82.52]
          ],
          details: "USCG Sector St. Petersburg Port Condition Zulu. Commercial petroleum transit suspended."
        }
      ]
    };

    return marineByBasin[basinKey] || marineByBasin.india;
  }
}
