// Aegis — Executive Situation Report (SITREP) & Disaster Intelligence Generator
// Implements client-side, 100% offline-capable PDF/Printable SITREPs, Incident Action Plans (IAP), and Audit CSV ledgers

export class ReportGenerator {
  // 1. Plaintext SITREP Briefing
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

    if (resourceSummary) {
      reportContent += `
5. NIMS / ICS RESOURCE TRACKING (KIND & TYPE INVENTORY)
--------------------------------------------------------------------------------
- Total Registered Tactical Resources: ${resourceSummary.totalAssets}
- Staged / Available for Immediate Tasking: ${resourceSummary.stagedAvailable}
- Actively Committed / Deployed On-Scene: ${resourceSummary.deployedActive}
- Out of Service / Maintenance: ${resourceSummary.outOfService}

Standardized Resource Fleet (Kind & Type Breakdown):
${allResources.map((res) => `
  * Callsign: ${res.callsign.padEnd(24, " ")} | ${res.kind} (${res.type})
    Owning Agency: ${res.owningAgency}
    Current Status: ${res.status.padEnd(20, " ")} | Staged At: ${res.homeBase}
    Mission Assignment: ${res.assignedAssetName || res.assignedIncidentId || "AVAILABLE"}
`).join("")}`;
    }

    if (logEntries.length > 0) {
      reportContent += `
6. INTER-AGENCY OPERATIONS LEDGER (ICS-214 VERIFIED AUDIT CHAIN)
--------------------------------------------------------------------------------
${logEntries.map(e => `
[${e.entryId}] ${new Date(e.timestamp).toISOString().slice(11, 19)} UTC | Agency: ${e.agency}
Action Type: ${e.actionType} | Officer: ${e.officerInCharge || "EOC Commander"}
Summary: ${e.summary}
Cryptographic Hash: ${e.verificationHash.slice(0, 16)}...
`).join("\n")}`;
    }

    reportContent += `
================================================================================
REPORT GENERATED BY AEGIS PLATFORM | OPERATIONAL EOC NODE
CROSS-BORDER BRICS RESILIENCE FRAMEWORK — OFFICIAL USE ONLY
================================================================================`;

    return reportContent;
  }

  // 2. High-Contrast, Strict 2-Page Client-Side Printable/PDF SITREP (ICS-209 Equivalent)
  generatePrintableHtmlSitrep({
    basin,
    currentStep,
    exposedAssets,
    geminiAnalysis,
    incidentTriage = null,
    resourceTracker = null,
    interagencyLogger = null
  }) {
    const timestamp = new Date().toUTCString();
    const incidentMetrics = incidentTriage ? incidentTriage.getQueueMetrics() : { totalReported: 0, activeQueued: 0, dispatched: 0, onScene: 0, p1Count: 0, p2Count: 0, totalLivesAtRisk: 0 };
    const prioritizedQueue = incidentTriage ? incidentTriage.getPrioritizedQueue() : [];
    const resourceSummary = resourceTracker ? resourceTracker.getResourceSummary() : { totalAssets: 0, stagedAvailable: 0, deployedActive: 0 };
    const allResources = resourceTracker ? resourceTracker.queryResources() : [];
    const logEntries = interagencyLogger ? interagencyLogger.getEntries() : [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Aegis Executive SITREP — ${basin.stormName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.35;
    }
    .page {
      width: 100%;
      height: 100%;
      page-break-after: always;
      position: relative;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .header-bar {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f172a;
    }
    .brand-sub {
      font-size: 9px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .classification-tag {
      background: #dc2626;
      color: #ffffff;
      padding: 3px 8px;
      font-weight: 800;
      font-size: 9px;
      letter-spacing: 0.5px;
      border-radius: 2px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      margin-bottom: 8px;
      border-radius: 3px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 8px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .meta-val {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #0f172a;
      color: #ffffff;
      padding: 3px 6px;
      margin: 8px 0 4px 0;
      display: flex;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 10px;
    }
    th {
      background: #e2e8f0;
      color: #1e293b;
      font-weight: 800;
      text-align: left;
      padding: 4px 6px;
      border: 1px solid #cbd5e1;
      font-size: 9px;
      text-transform: uppercase;
    }
    td {
      padding: 4px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .status-badge {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 2px;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .badge-critical { background: #fee2e2; color: #dc2626; border: 1px solid #f87171; }
    .badge-warning { background: #fef3c7; color: #d97706; border: 1px solid #fbbf24; }
    .badge-safe { background: #d1fae5; color: #059669; border: 1px solid #34d399; }
    .gemini-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-left: 3px solid #0284c7;
      padding: 6px 8px;
      font-size: 9.5px;
      margin-bottom: 6px;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 14px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 10px;
    }
    .sign-box {
      border: 1px solid #cbd5e1;
      padding: 8px;
      border-radius: 2px;
      background: #f8fafc;
    }
    .sign-line {
      margin-top: 24px;
      border-bottom: 1px solid #0f172a;
      width: 80%;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    .print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
    }
    .btn-print {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <div class="print-bar no-print">
    <span>Aegis Tactical EOC Situation Report — Official PDF Print Preview</span>
    <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
  </div>

  <div style="padding-top: 36px;" class="no-print"></div>

  <!-- PAGE 1: SITUATION OVERVIEW & INFRASTRUCTURE MATRIX -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">AEGIS // NATIONAL EOC SITREP</div>
        <div class="brand-sub">Anticipatory Impact &amp; Infrastructure Forecaster · ITU-T X.1303 / OASIS CAP Compliant</div>
      </div>
      <div style="text-align: right;">
        <span class="classification-tag">OFFICIAL USE ONLY</span>
        <div style="font-size: 8px; color: #64748b; margin-top: 3px;">BULLETIN: ${basin.country.toUpperCase()}-${currentStep.step.toUpperCase()}-04</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><span class="meta-label">Active Cyclone</span><span class="meta-val">${basin.stormName} (${basin.category})</span></div>
      <div class="meta-item"><span class="meta-label">Target Corridor</span><span class="meta-val">${basin.regionDescription}</span></div>
      <div class="meta-item"><span class="meta-label">Time Horizon</span><span class="meta-val">${currentStep.label} (${currentStep.timestamp})</span></div>
      <div class="meta-item"><span class="meta-label">Population at Risk</span><span class="meta-val">${basin.populationAtRisk}</span></div>
    </div>

    <div class="meta-grid" style="margin-top: -3px; background: #ffffff;">
      <div class="meta-item"><span class="meta-label">Central Pressure</span><span class="meta-val">${currentStep.centralPressureHpa} hPa</span></div>
      <div class="meta-item"><span class="meta-label">Max Sustained Wind</span><span class="meta-val" style="color: #d97706;">${currentStep.maxWindSpeedKmph} km/h</span></div>
      <div class="meta-item"><span class="meta-label">Peak Surge Height</span><span class="meta-val" style="color: #0284c7;">${currentStep.surgeHeightM} m</span></div>
      <div class="meta-item"><span class="meta-label">24h Rainfall Forecast</span><span class="meta-val">${currentStep.rainfallForecastMm24h} mm</span></div>
    </div>

    <div class="section-title">
      <span>1. Critical Infrastructure Impact &amp; Exposure Matrix</span>
      <span>${exposedAssets.length} Strategic Nodes Monitored</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 28%;">Asset Name</th>
          <th style="width: 14%;">Type / MSL</th>
          <th style="width: 16%;">Operational Status</th>
          <th style="width: 14%;">Surge Exposure</th>
          <th style="width: 28%;">Diagnostic Impact Summary</th>
        </tr>
      </thead>
      <tbody>
        ${exposedAssets.map(a => `
          <tr>
            <td><strong>${a.name}</strong></td>
            <td>${a.type.toUpperCase()}<br/><span style="color:#64748b;">${a.elevationM}m MSL</span></td>
            <td>
              <span class="status-badge ${
                a.currentStatus.includes("FAIL") || a.currentStatus.includes("SUBMERG") ? "badge-critical" :
                a.currentStatus.includes("CUT") || a.currentStatus.includes("ALERT") ? "badge-warning" : "badge-safe"
              }">${a.currentStatus}</span>
            </td>
            <td>Depth: <strong>+${a.inundationDepthM}m</strong></td>
            <td>${a.impactDescription}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="section-title">
      <span>2. Gemini 3.7 Flash Multimodal Spatial Reasoning</span>
      <span>Google Earth Engine Telemetry Synthesis</span>
    </div>

    <div class="gemini-box">
      ${geminiAnalysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br/><br/>')}
    </div>
  </div>

  <!-- PAGE 2: CAD TRIAGE, RESOURCE FLEET & ICS-214 LOGS -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">AEGIS // OPERATIONAL DISPATCH &amp; RESOURCE LEDGER</div>
        <div class="brand-sub">NIMS Resource Typed Inventory · Computer-Aided Dispatch (CAD) · ICS-214 Chronology</div>
      </div>
      <div style="font-size: 8px; color: #64748b; text-align: right;">Page 2 of 2 · DEOC Verified</div>
    </div>

    <div class="section-title">
      <span>3. Computer-Aided Dispatch (CAD) Incident Triage Queue</span>
      <span>${incidentMetrics.totalLivesAtRisk} Lives Under Immediate Hazard</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Call ID</th>
          <th style="width: 10%;">Priority</th>
          <th style="width: 26%;">Incident Location</th>
          <th style="width: 14%;">Persons / State</th>
          <th style="width: 38%;">Operational Description &amp; Assigned Unit</th>
        </tr>
      </thead>
      <tbody>
        ${prioritizedQueue.slice(0, 4).map(inc => `
          <tr>
            <td><strong>${inc.id}</strong></td>
            <td><span class="status-badge badge-critical">${inc.priority.code}</span></td>
            <td>${inc.locationName}</td>
            <td>${inc.affectedPersons} Persons<br/><span style="color:#0284c7; font-weight:700;">${inc.status}</span></td>
            <td>${inc.description}<br/><em>Units: ${inc.assignedResources.join(", ") || "En-route"}</em></td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="section-title">
      <span>4. NIMS / FEMA Standardized Resource Fleet Deployments</span>
      <span>${resourceSummary.stagedAvailable} Staged Available · ${resourceSummary.deployedActive} On-Scene</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Callsign</th>
          <th style="width: 24%;">NIMS Kind &amp; Capability Type</th>
          <th style="width: 20%;">Owning Agency</th>
          <th style="width: 16%;">Current Status</th>
          <th style="width: 18%;">Staging Location</th>
        </tr>
      </thead>
      <tbody>
        ${allResources.slice(0, 4).map(res => `
          <tr>
            <td><strong>${res.callsign}</strong></td>
            <td>${res.kind}<br/><span style="color:#64748b;">${res.type}</span></td>
            <td>${res.owningAgency}</td>
            <td><span class="status-badge badge-safe">${res.status}</span></td>
            <td>${res.homeBase}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="section-title">
      <span>5. Inter-Agency Activity Log (ICS-214 Chronology)</span>
      <span>Cryptographically Hashed Chain</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Time (UTC)</th>
          <th style="width: 16%;">Agency</th>
          <th style="width: 52%;">Directive Summary &amp; Target Assets</th>
          <th style="width: 20%;">Hash Verification</th>
        </tr>
      </thead>
      <tbody>
        ${logEntries.slice(0, 3).map(e => `
          <tr>
            <td>${new Date(e.timestamp).toISOString().slice(11, 19)}</td>
            <td><strong>${e.agency}</strong></td>
            <td>${e.summary}</td>
            <td style="font-family: monospace; font-size: 8px;">${e.verificationHash.slice(0, 14)}...</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="signature-grid">
      <div class="sign-box">
        <span class="meta-label">PREPARED BY (PLANNING SECTION CHIEF):</span>
        <div class="sign-line"></div>
        <div style="font-size: 9px; color: #475569; margin-top: 4px;">Name: Tactical Operations Intelligence Officer · EOC</div>
      </div>
      <div class="sign-box">
        <span class="meta-label">AUTHORIZED BY (INCIDENT COMMANDER):</span>
        <div class="sign-line"></div>
        <div style="font-size: 9px; color: #475569; margin-top: 4px;">Name: District Magistrate / Incident Commander · Approved</div>
      </div>
    </div>
  </div>

</body>
</html>`;
  }

  // 3. Tabular Disaster Audit Ledger (CSV) for Financial Relief & Funding Compliance
  generateCsvAuditLedger({
    basin,
    currentStep,
    exposedAssets,
    incidentTriage = null,
    resourceTracker = null
  }) {
    const lines = [];
    const timestamp = new Date().toISOString();

    // Section 1: Header metadata
    lines.push(`"AEGIS DISASTER AUDIT LEDGER - FINANCIAL & DAMAGE COMPLIANCE"`);
    lines.push(`"Generated At","${timestamp}"`);
    lines.push(`"Country","${basin.country}"`);
    lines.push(`"Storm Name","${basin.stormName}"`);
    lines.push(`"Category","${basin.category}"`);
    lines.push(`"Step","${currentStep.step}"`);
    lines.push(`"Surge Peak (m)","${currentStep.surgeHeightM}"`);
    lines.push(`"Max Sustained Wind (km/h)","${currentStep.maxWindSpeedKmph}"`);
    lines.push(``);

    // Section 2: Asset Damage Matrix
    lines.push(`"=== SECTION 1: CRITICAL INFRASTRUCTURE DAMAGE MATRIX ==="`);
    lines.push(`"Asset ID","Asset Name","Type","Elevation MSL (m)","Surge Depth (m)","Operational Status","Capacity","Population Exposed","Damage Severity"`);
    exposedAssets.forEach(a => {
      const severity = a.currentStatus.includes("FAIL") || a.currentStatus.includes("SUBMERG") ? "CRITICAL FAILURE" :
                       a.currentStatus.includes("CUT") || a.currentStatus.includes("ALERT") ? "HIGH LOSS" : "NORMAL";
      lines.push(`"${a.id}","${a.name}","${a.type}","${a.elevationM}","${a.inundationDepthM}","${a.currentStatus}","${a.capacity}","${basin.populationAtRisk}","${severity}"`);
    });
    lines.push(``);

    // Section 3: CAD Incident Queue
    if (incidentTriage) {
      lines.push(`"=== SECTION 2: CAD EMERGENCY DISTRESS QUEUE ==="`);
      lines.push(`"Incident ID","Priority","Triage Score","Location","Affected Persons","Category","Status","Source","Assigned Units"`);
      const queue = incidentTriage.getPrioritizedQueue();
      queue.forEach(q => {
        lines.push(`"${q.id}","${q.priority.code}","${q.triageScore}","${q.locationName}","${q.affectedPersons}","${q.category}","${q.status}","${q.source}","${q.assignedResources.join("; ")}"`);
      });
      lines.push(``);
    }

    // Section 4: NIMS Resource Fleet & Expenditure Allocation
    if (resourceTracker) {
      lines.push(`"=== SECTION 3: NIMS RESOURCE FLEET & DEPLOYMENT INVENTORY ==="`);
      lines.push(`"Callsign","Kind","Type","Owning Agency","Current Status","Home Base","Assignment","Deployment Cost Category"`);
      const resources = resourceTracker.queryResources();
      resources.forEach(r => {
        lines.push(`"${r.callsign}","${r.kind}","${r.type}","${r.owningAgency}","${r.status}","${r.homeBase}","${r.assignedAssetName || r.assignedIncidentId || "AVAILABLE"}","PUBLIC_ASSISTANCE_CATEGORY_B"`);
      });
    }

    return lines.join("\n");
  }

  // 4. Download Plaintext
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

  // 5. Download CSV
  downloadCsv(content, filename = "Aegis_Disaster_Audit_Ledger.csv") {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 6. Open Clean Printable / PDF Window
  openPrintableSitrep(htmlContent) {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      alert("Please allow popups to open the official printable SITREP report.");
    }
  }
}
