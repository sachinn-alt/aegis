// Aegis - National Systems & Global Interoperability Adapter
// Scales Aegis to any country by interfacing with native emergency systems,
// telecom networks (Cell Broadcast, VHF, NAVTEX, SMS), and OASIS CAP v1.2 standards.

export class NationalSystemAdapter {
  constructor() {
    this.networkMode = "adaptive"; // "high-speed" | "adaptive" | "satcom-low-bandwidth"
    this.countryProfiles = this.getDefaultCountryProfiles();
    this.customBasins = {};
  }

  getDefaultCountryProfiles() {
    return {
      india: {
        countryCode: "IN",
        countryName: "India",
        agencyName: "National Disaster Management Authority (NDMA) & OSDMA",
        agencyAcronym: "NDMA",
        capAuthority: "in.gov.ndma.sachet",
        capStandard: "OASIS CAP v1.2 / ITU-T X.1303 (Sachet Profile)",
        cellBroadcast: {
          standard: "3GPP TS 23.041 (Sachet Cell Broadcast)",
          primaryChannel: "Channel 919 / 4370",
          status: "Direct Tower Broadcast Active"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 67", "Ch. 68", "Ch. 77"],
          navtexStation: "Kolkata (518 kHz International / 490 kHz National)",
          gmdssSeaArea: "A1/A2 (Bay of Bengal)"
        },
        emergencyHotlines: {
          unified: "112",
          disasterSpecific: "1077 (District Disaster Cell)",
          coastGuard: "1554"
        },
        nativeLanguages: [
          { name: "Odia", code: "or-IN" },
          { name: "Bengali", code: "bn-IN" },
          { name: "Hindi", code: "hi-IN" },
          { name: "English", code: "en-IN" }
        ],
        spatialDatum: "WGS84 / Kalianpur 1975 (EPSG:4326 / EPSG:24378)"
      },
      south_africa: {
        countryCode: "ZA",
        countryName: "South Africa",
        agencyName: "National Disaster Management Centre (NDMC) & SAWS",
        agencyAcronym: "NDMC",
        capAuthority: "za.gov.cogta.ndmc",
        capStandard: "OASIS CAP-ZA v1.2 (SADC Harmonized)",
        cellBroadcast: {
          standard: "3GPP TS 23.041 (National Public Warning)",
          primaryChannel: "Channel 4370",
          status: "Cellular Emergency Alert Active"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 26", "Ch. 27", "Ch. 87"],
          navtexStation: "Durban Radio / Cape Town Radio (518 kHz)",
          gmdssSeaArea: "A1/A2/A3 (Agulhas / SW Indian Ocean)"
        },
        emergencyHotlines: {
          unified: "112 (Mobile) / 10177",
          disasterSpecific: "031 361 0000 (eThekwini EOC)",
          seaRescue: "112 (NSRI)"
        },
        nativeLanguages: [
          { name: "isiZulu", code: "zu-ZA" },
          { name: "English", code: "en-ZA" },
          { name: "Afrikaans", code: "af-ZA" }
        ],
        spatialDatum: "WGS84 / Hartebeesthoek94 (EPSG:4326 / EPSG:2048)"
      },
      brazil: {
        countryCode: "BR",
        countryName: "Brazil",
        agencyName: "Secretaria Nacional de Proteção e Defesa Civil (SEDEC) & CEMADEN",
        agencyAcronym: "Defesa Civil",
        capAuthority: "br.gov.mdr.defesacivil",
        capStandard: "OASIS CAP-BR v1.2 (Interface Defesa Civil Alertas)",
        cellBroadcast: {
          standard: "Anatel Cell Broadcast / Defesa Civil Alerta",
          primaryChannel: "Channel 4370 (Alerta Extremo)",
          status: "CBS Redes Móveis Ativo"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 10", "Ch. 68", "Ch. 70 DSC"],
          navtexStation: "Rio Grande Radio (518 kHz / 490 kHz)",
          gmdssSeaArea: "A1/A2 (Atlântico Sul - Área V)"
        },
        emergencyHotlines: {
          unified: "190 (Polícia) / 193 (Bombeiros)",
          disasterSpecific: "199 (Defesa Civil Nacional)",
          marineRescue: "185 (SALVAMAR)"
        },
        nativeLanguages: [
          { name: "Portuguese", code: "pt-BR" },
          { name: "English", code: "en-US" }
        ],
        spatialDatum: "SIRGAS 2000 / WGS84 (EPSG:4674 / EPSG:4326)"
      },
      china: {
        countryCode: "CN",
        countryName: "China",
        agencyName: "Ministry of Emergency Management (MEM) & China Meteorological Administration (CMA)",
        agencyAcronym: "MEM / CMA",
        capAuthority: "cn.gov.cma.warning",
        capStandard: "National Early Warning Dissemination CAP-CN v1.2",
        cellBroadcast: {
          standard: "MIIT National Emergency Cell Broadcast",
          primaryChannel: "Channel 4370 / Emergency SMS Gateway",
          status: "National Broadcast Grid Active"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 08", "Ch. 09", "Ch. 65"],
          navtexStation: "Guangzhou / Shanghai Maritime (518 kHz / 486 kHz)",
          gmdssSeaArea: "A1/A2 (South China Sea / East China Sea)"
        },
        emergencyHotlines: {
          unified: "110 (Police) / 119 (Fire & Rescue)",
          disasterSpecific: "12345 (Civil Emergency Command)",
          maritimeRescue: "12395"
        },
        nativeLanguages: [
          { name: "Mandarin", code: "zh-CN" },
          { name: "English", code: "en-US" }
        ],
        spatialDatum: "CGCS2000 / WGS84 (EPSG:4490 / EPSG:4326)"
      },
      philippines: {
        countryCode: "PH",
        countryName: "Philippines",
        agencyName: "National Disaster Risk Reduction and Management Council (NDRRMC) & PAGASA",
        agencyAcronym: "NDRRMC",
        capAuthority: "ph.gov.ndrrmc.alerts",
        capStandard: "OASIS CAP v1.2 (Philippine Standard Profile)",
        cellBroadcast: {
          standard: "Free Mobile Disaster Alerts Act (RA 10639 / 3GPP CBS)",
          primaryChannel: "Channel 4370",
          status: "Telco Emergency Push (Smart/Globe) Active"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 12", "Ch. 68", "Ch. 88"],
          navtexStation: "Manila Coast Guard Radio (518 kHz)",
          gmdssSeaArea: "A1/A2 (Philippine Sea / West Philippine Sea)"
        },
        emergencyHotlines: {
          unified: "911",
          disasterSpecific: "8911-5061 (NDRRMC Operations Center)",
          coastGuard: "8527-8481"
        },
        nativeLanguages: [
          { name: "Tagalog", code: "tl-PH" },
          { name: "Waray", code: "war-PH" },
          { name: "Cebuano", code: "ceb-PH" },
          { name: "English", code: "en-PH" }
        ],
        spatialDatum: "PRS92 / WGS84 (EPSG:3123 / EPSG:4326)"
      },
      usa: {
        countryCode: "US",
        countryName: "United States",
        agencyName: "Federal Emergency Management Agency (FEMA) & NOAA / National Hurricane Center",
        agencyAcronym: "FEMA / NOAA",
        capAuthority: "gov.fema.ipaws",
        capStandard: "OASIS CAP v1.2 IPAWS Profile (FEMA / EAS / WEA)",
        cellBroadcast: {
          standard: "Wireless Emergency Alerts (WEA 3.0 / ATIS-0700010)",
          primaryChannel: "Channel 4370 (Presidential) / 4371 (Severe Threat)",
          status: "IPAWS Commercial Mobile Alert Service (CMAS)"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 22A", "Ch. 68", "Ch. 83A"],
          navtexStation: "Miami / New Orleans USCG (518 kHz)",
          gmdssSeaArea: "A1/A2 (Gulf of Mexico / Western Atlantic)"
        },
        emergencyHotlines: {
          unified: "911",
          disasterSpecific: "1-800-621-3362 (FEMA Helpline)",
          coastGuard: "VHF-16 or 911"
        },
        nativeLanguages: [
          { name: "English", code: "en-US" },
          { name: "Spanish", code: "es-US" }
        ],
        spatialDatum: "NAD83 / WGS84 (EPSG:4269 / EPSG:4326)"
      },
      mozambique: {
        countryCode: "MZ",
        countryName: "Mozambique",
        agencyName: "Instituto Nacional de Gestão e Redução do Risco de Desastres (INGD) & INAM",
        agencyAcronym: "INGD",
        capAuthority: "mz.gov.ingd.alerta",
        capStandard: "OASIS CAP v1.2 (SADC Harmonized Profile)",
        cellBroadcast: {
          standard: "3GPP TS 23.041 / Emergency SMS Aggregation",
          primaryChannel: "Channel 4370 / Tmcel & Vodacom Push",
          status: "Cellular & Community Radio Net"
        },
        marineVHF: {
          primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
          workingChannels: ["Ch. 06", "Ch. 12", "Ch. 73"],
          navtexStation: "Maputo / Beira Radio (518 kHz)",
          gmdssSeaArea: "A1/A2 (Mozambique Channel)"
        },
        emergencyHotlines: {
          unified: "112 / 119",
          disasterSpecific: "800 112 112 (INGD Linha Verde)",
          redCross: "117"
        },
        nativeLanguages: [
          { name: "Portuguese", code: "pt-MZ" },
          { name: "Sena", code: "seh-MZ" },
          { name: "Ndau", code: "ndc-MZ" },
          { name: "English", code: "en-GB" }
        ],
        spatialDatum: "Moznet / WGS84 (EPSG:4130 / EPSG:4326)"
      }
    };
  }

  getProfile(basinId) {
    if (this.customBasins[basinId]?.countryProfile) {
      return this.customBasins[basinId].countryProfile;
    }
    return this.countryProfiles[basinId] || this.countryProfiles.india;
  }

  registerCustomProfile(key, profile) {
    this.countryProfiles[key] = {
      countryCode: profile.countryCode || "XX",
      countryName: profile.countryName || "Custom Territory",
      agencyName: profile.agencyName || "National Emergency Management Agency",
      agencyAcronym: profile.agencyAcronym || "NEMA",
      capAuthority: profile.capAuthority || `org.emergency.${key}`,
      capStandard: profile.capStandard || "OASIS CAP v1.2 / ITU-T X.1303",
      cellBroadcast: profile.cellBroadcast || {
        standard: "3GPP TS 23.041",
        primaryChannel: "Channel 4370",
        status: "Active"
      },
      marineVHF: profile.marineVHF || {
        primaryEmergencyChannel: "VHF Ch. 16 (156.800 MHz)",
        workingChannels: ["Ch. 68"],
        navtexStation: "National Coastal Radio (518 kHz)",
        gmdssSeaArea: "A1/A2"
      },
      emergencyHotlines: profile.emergencyHotlines || {
        unified: "112 / 911",
        disasterSpecific: "Emergency EOC Center",
        coastGuard: "VHF Ch. 16"
      },
      nativeLanguages: profile.nativeLanguages || [{ name: "English", code: "en-US" }],
      spatialDatum: profile.spatialDatum || "WGS84 (EPSG:4326)"
    };
  }

  // Generate ITU-T X.1303 / OASIS CAP v1.2 XML compliant document
  generateCapXml({ basin, timeStep, exposedAssets = [], advisory = {} }) {
    const profile = this.getProfile(basin.id);
    const alertId = `urn:oid:2.49.0.0.${profile.countryCode}.${Date.now()}`;
    const sentIso = new Date().toISOString();
    const effectiveIso = sentIso;
    const expiresDate = new Date(Date.now() + 24 * 3600 * 1000);
    const expiresIso = expiresDate.toISOString();

    const severity = timeStep.alertLevel.includes("RED") || timeStep.alertLevel.includes("CRITICAL")
      ? "Extreme"
      : timeStep.alertLevel.includes("ORANGE") || timeStep.alertLevel.includes("HIGH")
      ? "Severe"
      : "Moderate";

    const urgency = timeStep.step === "Landfall" || timeStep.step === "T-24h" ? "Immediate" : "Expected";
    const certainty = "Observed";

    // Build bounding polygon from eyeCoord and surge reach
    const [lat, lon] = timeStep.eyeCoord;
    const delta = (timeStep.coneRadiusKm || 80) / 111.0;
    const polygonCoords = [
      `${(lat + delta).toFixed(4)},${(lon - delta).toFixed(4)}`,
      `${(lat + delta).toFixed(4)},${(lon + delta).toFixed(4)}`,
      `${(lat - delta).toFixed(4)},${(lon + delta).toFixed(4)}`,
      `${(lat - delta).toFixed(4)},${(lon - delta).toFixed(4)}`,
      `${(lat + delta).toFixed(4)},${(lon - delta).toFixed(4)}`
    ].join(" ");

    const failedAssets = exposedAssets
      .filter(a => a.currentStatus && (a.currentStatus.includes("FAIL") || a.currentStatus.includes("SUBMERG") || a.currentStatus.includes("HIGH")))
      .map(a => `${a.name} (${a.currentStatus})`)
      .slice(0, 5)
      .join(", ");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alertId}</identifier>
  <sender>${profile.capAuthority}@eoc.gov</sender>
  <sent>${sentIso}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <source>Aegis Global Anticipatory Early Warning System</source>
  <scope>Public</scope>
  <code>3GPP-CBS-4370</code>
  <code>WMO-CYCLONE-WARNING</code>
  <info>
    <language>${advisory.langCode || "en"}</language>
    <category>Met</category>
    <category>Safety</category>
    <event>${basin.stormName || "Tropical Cyclone / Coastal Surge Event"}</event>
    <urgency>${urgency}</urgency>
    <severity>${severity}</severity>
    <certainty>${certainty}</certainty>
    <eventCode>
      <valueName>SAME</valueName>
      <value>SVR</value>
    </eventCode>
    <eventCode>
      <valueName>WMO</valueName>
      <value>TC</value>
    </eventCode>
    <expires>${expiresIso}</expires>
    <senderName>${profile.agencyName}</senderName>
    <headline>${advisory.title || `EMERGENCY ALERT: ${basin.stormName} Landfall Imminent`}</headline>
    <description>${advisory.message || `Severe coastal surge risk of ${timeStep.surgeHeightM}m and winds of ${timeStep.maxWindSpeedKmph} km/h forecast near ${basin.landfallLocation}. Impacting ${basin.populationAtRisk} residents.`}</description>
    <instruction>${timeStep.advisoryAction || "Initiate immediate evacuation of designated flood inundation zones. Dial national emergency services for assistance."}</instruction>
    <web>https://aegis.brics-resilience.org</web>
    <contact>${profile.emergencyHotlines.unified} / ${profile.emergencyHotlines.disasterSpecific}</contact>
    <parameter>
      <valueName>CellBroadcastChannel</valueName>
      <value>${profile.cellBroadcast.primaryChannel}</value>
    </parameter>
    <parameter>
      <valueName>MarineVHFChannel</valueName>
      <value>${profile.marineVHF.primaryEmergencyChannel}</value>
    </parameter>
    <parameter>
      <valueName>CentralPressureHpa</valueName>
      <value>${timeStep.centralPressureHpa}</value>
    </parameter>
    <parameter>
      <valueName>PeakSurgeMeters</valueName>
      <value>${timeStep.surgeHeightM}</value>
    </parameter>
    <parameter>
      <valueName>CriticalInfrastructureThreats</valueName>
      <value>${failedAssets || "None detected"}</value>
    </parameter>
    <area>
      <areaDesc>${basin.regionDescription}</areaDesc>
      <polygon>${polygonCoords}</polygon>
      <circle>${lat.toFixed(4)},${lon.toFixed(4)},${timeStep.coneRadiusKm || 80}</circle>
    </area>
  </info>
</alert>`;

    return xml;
  }

  // Generate JSON format CAP for modern national REST API gateways
  generateCapJson({ basin, timeStep, exposedAssets = [], advisory = {} }) {
    const profile = this.getProfile(basin.id);
    const [lat, lon] = timeStep.eyeCoord;
    return {
      capVersion: "1.2",
      identifier: `urn:oid:2.49.0.0.${profile.countryCode}.${Date.now()}`,
      sender: `${profile.capAuthority}@eoc.gov`,
      sent: new Date().toISOString(),
      status: "Actual",
      msgType: "Alert",
      scope: "Public",
      country: profile.countryName,
      nationalAgency: profile.agencyName,
      dispatchChannels: {
        cellBroadcast: profile.cellBroadcast,
        marineVHF: profile.marineVHF,
        emergencyHotlines: profile.emergencyHotlines
      },
      info: {
        category: ["Met", "Safety"],
        event: basin.stormName,
        urgency: timeStep.step === "Landfall" || timeStep.step === "T-24h" ? "Immediate" : "Expected",
        severity: timeStep.alertLevel.includes("RED") ? "Extreme" : "Severe",
        certainty: "Observed",
        headline: advisory.title || `ALERT: ${basin.stormName}`,
        description: advisory.message,
        instruction: timeStep.advisoryAction,
        coordinates: {
          eyeLatitude: lat,
          eyeLongitude: lon,
          coneRadiusKm: timeStep.coneRadiusKm,
          surgeHeightM: timeStep.surgeHeightM,
          maxWindSpeedKmph: timeStep.maxWindSpeedKmph
        },
        impactedInfrastructure: exposedAssets
          .filter(a => a.currentStatus && !a.currentStatus.includes("NORMAL"))
          .map(a => ({ name: a.name, status: a.currentStatus, coords: a.coords }))
      }
    };
  }

  // Low-Bandwidth / Satcom Telemetry Packet (< 1.2 KB) for HF Radio (Winlink/APRS) & Satellite SBD
  getCompactSatcomPacket(basin, timeStep, exposedAssets = []) {
    const profile = this.getProfile(basin.id);
    const criticals = exposedAssets
      .filter(a => a.currentStatus && (a.currentStatus.includes("FAIL") || a.currentStatus.includes("SUBMERG")))
      .map(a => `${a.name.slice(0, 14)}:${a.currentStatus.slice(0, 8)}`)
      .join("|");

    return [
      `AEGIS-TACTICAL-V1`,
      `ISO:${profile.countryCode}`,
      `BASIN:${basin.id.toUpperCase()}`,
      `STORM:${basin.stormName.split(" ")[0]}`,
      `STEP:${timeStep.step}`,
      `EYE:${timeStep.eyeCoord[0].toFixed(2)},${timeStep.eyeCoord[1].toFixed(2)}`,
      `HPA:${timeStep.centralPressureHpa}`,
      `WIND:${timeStep.maxWindSpeedKmph}KPH`,
      `SURGE:${timeStep.surgeHeightM}M`,
      `RAIN:${timeStep.rainfallForecastMm24h}MM`,
      `ALERT:${timeStep.alertLevel}`,
      `CRIT_NODES:${criticals || "NONE"}`,
      `VHF:${profile.marineVHF.primaryEmergencyChannel.split(" ")[1] || "CH16"}`,
      `CB:${profile.cellBroadcast.primaryChannel.split(" ")[1] || "4370"}`,
      `HOTLINE:${profile.emergencyHotlines.unified}`,
      `CHECKSUM:${Math.abs((timeStep.centralPressureHpa * 7) ^ (timeStep.maxWindSpeedKmph * 13)).toString(16).toUpperCase()}`
    ].join(";");
  }

  // Parses user-provided Custom GeoJSON or JSON Basin profile
  importCustomBasinFromGeoJson(jsonData) {
    if (!jsonData || typeof jsonData !== "object") {
      throw new Error("Invalid GeoJSON or scenario data structure.");
    }

    // Support both direct scenario schema and Standard GeoJSON FeatureCollection
    if (jsonData.type === "FeatureCollection" && Array.isArray(jsonData.features)) {
      const firstFeature = jsonData.features[0] || {};
      const centerCoords = firstFeature.geometry?.coordinates || [85.0, 20.0];
      const basinId = (jsonData.properties?.id || `custom_${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, "");

      const customBasin = {
        id: basinId,
        country: jsonData.properties?.country || "Sovereign Coastal Territory",
        flag: jsonData.properties?.flag || "🌐",
        basinName: jsonData.properties?.basinName || "Custom Inundation Basin",
        stormName: jsonData.properties?.stormName || "Active Maritime Surge System",
        category: jsonData.properties?.category || "Category 3 Equivalent",
        regionDescription: jsonData.properties?.regionDescription || "Imported Coastal Corridor",
        center: [centerCoords[1] || 20.0, centerCoords[0] || 85.0],
        zoom: jsonData.properties?.zoom || 9,
        landfallLocation: jsonData.properties?.landfallLocation || "Primary Coastal Hub",
        populationAtRisk: jsonData.properties?.populationAtRisk || "1,250,000",
        languages: jsonData.properties?.languages || ["English"],
        defaultLanguage: jsonData.properties?.defaultLanguage || "English",
        maxSurgeEstimate: jsonData.properties?.maxSurgeEstimate || "3.2m above astronomical tide",
        historicalAnalog: jsonData.properties?.historicalAnalog || "Analog Event",
        timeSteps: jsonData.timeSteps || this.generateDefaultTimeSteps(centerCoords),
        infrastructure: jsonData.features
          .filter(f => f.geometry && f.geometry.type === "Point")
          .map((f, i) => ({
            id: f.properties?.id || `asset_${i + 1}`,
            name: f.properties?.name || `Critical Asset #${i + 1}`,
            type: f.properties?.type || "substation",
            coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
            elevationM: f.properties?.elevationM ?? 4.5,
            capacity: f.properties?.capacity || "100%",
            impactDescription: f.properties?.impactDescription || "Asset monitored by Aegis.",
            statusByStep: f.properties?.statusByStep || {
              "T-72h": "NORMAL",
              "T-48h": "NORMAL",
              "T-24h": "HIGH_COMPROMISED",
              "Landfall": "SUBMERGED_FAILURE",
              "T+12h": "SALT_CORROSION_LOCK"
            }
          }))
      };

      if (customBasin.infrastructure.length === 0) {
        customBasin.infrastructure = [
          {
            id: "asset_01",
            name: "Regional Inundation Defense Hub",
            type: "substation",
            coords: [customBasin.center[0] - 0.1, customBasin.center[1] + 0.1],
            elevationM: 3.2,
            capacity: "Primary Grid Node",
            impactDescription: "Critical regional power and communication distribution center.",
            statusByStep: {
              "T-72h": "NORMAL",
              "T-48h": "PRE_ALERT",
              "T-24h": "ISLANDING_STANDBY",
              "Landfall": "SUBMERGED_FAILURE",
              "T+12h": "ISOLATED_BY_FLOOD"
            }
          }
        ];
      }

      this.customBasins[basinId] = customBasin;
      this.registerCustomProfile(basinId, {
        countryCode: jsonData.properties?.countryCode || "XX",
        countryName: customBasin.country,
        agencyName: jsonData.properties?.agencyName || "Territorial Disaster Management Directorate",
        agencyAcronym: jsonData.properties?.agencyAcronym || "TDMD",
        capAuthority: `gov.${basinId}.emergency`,
        nativeLanguages: customBasin.languages.map(l => ({ name: l, code: "en-US" }))
      });

      return customBasin;
    } else if (jsonData.id && jsonData.timeSteps && jsonData.infrastructure) {
      // Direct scenario JSON schema
      this.customBasins[jsonData.id] = jsonData;
      this.registerCustomProfile(jsonData.id, {
        countryCode: jsonData.countryCode || "XX",
        countryName: jsonData.country,
        agencyName: jsonData.agencyName || "National Disaster Center",
        agencyAcronym: jsonData.agencyAcronym || "NDC"
      });
      return jsonData;
    } else {
      throw new Error("JSON structure does not match GeoJSON FeatureCollection or Aegis Scenario Schema.");
    }
  }

  generateDefaultTimeSteps(centerCoords) {
    const lat = centerCoords[1] || 20.0;
    const lon = centerCoords[0] || 85.0;
    return [
      {
        step: "T-72h",
        label: "72 Hours Before Landfall",
        timestamp: "Day -3, 06:00 UTC",
        eyeCoord: [lat - 2.5, lon + 2.0],
        coneRadiusKm: 180,
        centralPressureHpa: 992,
        maxWindSpeedKmph: 75,
        forwardSpeedKmph: 18,
        surgeHeightM: 0.9,
        rainfallForecastMm24h: 60,
        status: "TROPICAL STORM",
        alertLevel: "YELLOW",
        advisoryAction: "Fisheries advisory broadcast via Marine VHF and coastal SMS."
      },
      {
        step: "T-48h",
        label: "48 Hours Before Landfall",
        timestamp: "Day -2, 06:00 UTC",
        eyeCoord: [lat - 1.5, lon + 1.2],
        coneRadiusKm: 130,
        centralPressureHpa: 984,
        maxWindSpeedKmph: 110,
        forwardSpeedKmph: 15,
        surgeHeightM: 1.8,
        rainfallForecastMm24h: 150,
        status: "SEVERE STORM",
        alertLevel: "ORANGE",
        advisoryAction: "Mandatory coastal evacuation initiated via national Cell Broadcast."
      },
      {
        step: "T-24h",
        label: "24 Hours Before Landfall",
        timestamp: "Day -1, 06:00 UTC",
        eyeCoord: [lat - 0.7, lon + 0.6],
        coneRadiusKm: 85,
        centralPressureHpa: 974,
        maxWindSpeedKmph: 135,
        forwardSpeedKmph: 12,
        surgeHeightM: 2.9,
        rainfallForecastMm24h: 280,
        status: "VERY SEVERE STORM",
        alertLevel: "RED",
        advisoryAction: "Port operations halted; critical hospitals switched to islanded diesel generation."
      },
      {
        step: "Landfall",
        label: "Peak Landfall Window",
        timestamp: "Landfall Hour, 02:00 UTC",
        eyeCoord: [lat, lon],
        coneRadiusKm: 45,
        centralPressureHpa: 965,
        maxWindSpeedKmph: 150,
        forwardSpeedKmph: 10,
        surgeHeightM: 3.8,
        rainfallForecastMm24h: 390,
        status: "LANDFALL INTENSITY",
        alertLevel: "EXTREME CRITICAL",
        advisoryAction: "Total movement curfew; full deployment of national search and rescue assets."
      },
      {
        step: "T+12h",
        label: "12 Hours Post-Landfall",
        timestamp: "Day +1, 14:00 UTC",
        eyeCoord: [lat + 0.9, lon - 0.6],
        coneRadiusKm: 90,
        centralPressureHpa: 986,
        maxWindSpeedKmph: 75,
        forwardSpeedKmph: 15,
        surgeHeightM: 1.3,
        rainfallForecastMm24h: 120,
        status: "DEGRADING INLAND",
        alertLevel: "AMBER RESTORATION",
        advisoryAction: "Arterial road clearance; rapid damage assessment via satellite SAR imagery."
      }
    ];
  }

  detectNetworkCapabilities() {
    if (typeof navigator !== "undefined" && navigator.connection) {
      const conn = navigator.connection;
      const type = conn.effectiveType || conn.type || "unknown";
      const isLowBandwidth = type === "slow-2g" || type === "2g" || type === "3g" || conn.saveData;
      return {
        effectiveType: type,
        downlink: conn.downlink || "N/A",
        rtt: conn.rtt || "N/A",
        saveData: conn.saveData || false,
        recommendedMode: isLowBandwidth ? "satcom-low-bandwidth" : "high-speed"
      };
    }
    return {
      effectiveType: "broadband",
      downlink: "10+ Mbps",
      rtt: "30ms",
      saveData: false,
      recommendedMode: "high-speed"
    };
  }
}
