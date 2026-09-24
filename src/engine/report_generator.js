// Aegis - Executive Situation Report (SITREP) Generator
// Generates official disaster intelligence briefings for EOC Incident Commanders, Cabinets, and Multi-Agency Coordination Centers (MACC)

export class ReportGenerator {
  generateSitrep({
    basin,
    currentStep,
    exposedAssets,
    geminiAnalysis,
    incidentTriage = null,
    resourceTracker = null,
    interagencyLogger = null
  }) {
    const timestamp = new Date().toUTCString();
    const compromised = exposedAssets.filter(a => 
      a.currentStatus.includes("FAIL") || 
      a.currentStatus.includes("SUBMERG") || 
      a.currentStatus.includes("CUT") || 
      a.currentStatus.includes("CRITICAL") ||
      a.currentStatus.includes("HIGH")
    );

    // Retrieve live queue and resource stats if engines provided
    const incidentMetrics = incidentTriage ? incidentTriage.getQueueMetrics() : null;
    const prioritizedQueue = incidentTriage ? incidentTriage.getPrioritizedQueue() : [];
    const resourceSummary = resourceTracker ? resourceTracker.getResourceSummary() : null;
    const allResources = resourceTracker ? resourceTracker.queryResources() : [];
    const logEntries = interagencyLogger ? interagencyLogger.getEntries() : [];

    let reportContent = `================================================================================
                    AEGIS — BRICS DISASTER RESILIENCE NETWORK
                  EXECUTIVE SITUATION REPORT (SITREP) — BULLETIN #04
================================================================================
ISSUED AT: ${timestamp}
AUTHORITY: NATIONAL DISASTER MANAGEMENT & DISTRICT EMERGENCY OPERATIONS CENTER (DEOC)
GEO-CORRIDOR: ${basin.country.toUpperCase()} — ${basin.basinName.toUpperCase()}
ACTIVE EVENT: ${basin.stormName} (${basin.category})
LANDFALL ZONE: ${basin.landfallLocation}
TIME-HORIZON: ${currentStep.label} (${currentStep.timestamp})
ALERT STATUS: ${currentStep.alertLevel}
================================================================================

1. METEOROLOGICAL & HYDRODYNAMIC SNAPSHOT
--------------------------------------------------------------------------------
- Eye Coordinates: Lat ${currentStep.eyeCoord[0]}°N, Lng ${currentStep.eyeCoord[1]}°E
- Central Atmospheric Pressure: ${currentStep.centralPressureHpa} hPa
- Maximum Sustained Surface Winds: ${currentStep.maxWindSpeedKmph} km/h (Gusting higher)
- Forward Track Translation Speed: ${currentStep.forwardSpeedKmph} km/h
- Peak Coastal Storm Surge Anomaly: ${currentStep.surgeHeightM}m above mean sea level
- 24-Hour Precipitation Accumulation: ${currentStep.rainfallForecastMm24h} mm
- Estimated Coastal Population at Risk: ${basin.populationAtRisk}

2. CRITICAL INFRASTRUCTURE IMPACT & EXPOSURE MATRIX
--------------------------------------------------------------------------------
${exposedAssets.map((asset, idx) => `
[${idx + 1}] ${asset.name}
    Type: ${asset.type.toUpperCase()} | Elevation: ${asset.elevationM}m MSL
    Operational State: ${asset.currentStatus}
    Impact Diagnosis: ${asset.impactDescription}
    Asset Capacity: ${asset.capacity}
`).join("")}

3. GEMINI 3.7 FLASH SPATIAL REASONING SYNTHESIS
--------------------------------------------------------------------------------
${geminiAnalysis.replace(/\*\*/g, "")}
`;

    // 4. Incident Triage & Queue Management Section
    if (incidentMetrics) {
      reportContent += `
4. INCIDENT CAD TRIAGE & QUEUE MANAGEMENT (ACTIVE INCIDENT DISPATCH)
--------------------------------------------------------------------------------
- Total Emergency Distress Calls Ingested: ${incidentMetrics.totalReported}
- Active Queued: ${incidentMetrics.activeQueued} | Dispatched: ${incidentMetrics.dispatched} | On-Scene: ${incidentMetrics.onScene}
- Priority Triage Breakdown:
    * P1 (Life Threatening / Drowning / Collapse): ${incidentMetrics.p1Count}
    * P2 (Critical Infrastructure / Substation Tripped): ${incidentMetrics.p2Count}
    * P3 (Evacuation Chokepoints / Road Blocked): ${incidentMetrics.p3Count}
    * P4 (Logistics & Relief Requests): ${incidentMetrics.p4Count}
- Estimated Lives Under Immediate Hazard: ${incidentMetrics.totalLivesAtRisk}

Prioritized Queue Snapshot (Top Priority Dispatches):
${prioritizedQueue.slice(0, 5).map((inc, i) => `
  [${i + 1}] ${inc.id} [${inc.priority.code}] - Score: ${inc.triageScore}
      Location: ${inc.locationName}
      Category: ${inc.category} | State: ${inc.status}
      Details: ${inc.description}
      Assigned Units: ${inc.assignedResources.length > 0 ? inc.assignedResources.join(", ") : "UNASSIGNED — STANDBY"}
`).join("")}`;
    }

    // 5. NIMS Resource Tracking (Kind & Type) Section
    if (resourceSummary) {
      reportContent += `
5. NIMS / ICS RESOURCE TRACKING (KIND & TYPE INVENTORY)
--------------------------------------------------------------------------------
- Total Registered Tactical Resources: ${resourceSummary.totalAssets}
- Staged / Available for Immediate Tasking: ${resourceSummary.stagedAvailable}
- Actively Committed / Deployed On-Scene: ${resourceSummary.deployedActive}
- Out of Service / Maintenance: ${resourceSummary.outOfService}

Standardized Resource Fleet (Kind & Type Breakdown):
${allResources.map((res, i) => `
  * Callsign: ${res.callsign.padEnd(24, " ")} | ${res.kind} (${res.type})
    Owning Agency: ${res.owningAgency}
    Current Status: ${res.status.padEnd(20, " ")} | Staged At: ${res.homeBase}
    Mission Assignment: ${res.assignedAssetName || res.assignedIncidentId || "AVAILABLE"}
`).join("")}`;
    }

    // 6. Inter-Agency Activity Ledger (ICS-214) Section
    if (logEntries.length > 0) {
      reportContent += `
6. INTER-AGENCY OPERATIONS LEDGER (ICS-214 VERIFIED AUDIT CHAIN)
--------------------------------------------------------------------------------
${logEntries.map(e => `
[${e.entryId}] ${new Date(e.timestamp).toISOString().slice(11, 19)} UTC | Agency: ${e.agency}
Action Type: ${e.actionType}
Officer in Charge: ${e.officerInCharge || "EOC Commander"}
Summary: ${e.summary}
Target Assets: ${(e.affectedAssets || []).join(", ") || "General Sector"}
Acknowledgments: ${(e.acknowledgedBy || []).join(", ")}
Cryptographic SHA-256 Hash: ${e.verificationHash.slice(0, 16)}...
`).join("\n")}`;
    }

    reportContent += `
================================================================================
REPORT GENERATED BY AEGIS PLATFORM | OPERATIONAL EOC NODE
CROSS-BORDER BRICS RESILIENCE FRAMEWORK — OFFICIAL USE ONLY
================================================================================`;

    return reportContent;
  }

  downloadReport(content, filename = "Aegis_SITREP_Briefing.txt") {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
