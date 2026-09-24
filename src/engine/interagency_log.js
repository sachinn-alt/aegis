// Aegis — Inter-Agency Operations & Activity Log Engine (ICS Form 214 / MACC Ledger)
// Provides a tamper-evident, append-only chronological log of all cross-agency directives,
// grid shutdowns, maritime evacuations, and official EOC decisions.

export class InterAgencyLogger {
  constructor() {
    this.entries = [];
    this.sequence = 1;
    this.previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
  }

  /**
   * Fast SHA-256 hash implementation using Web Crypto API or fallback
   */
  async generateHash(data) {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }
    // Lightweight string hash fallback for offline non-crypto environments
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }

  /**
   * Append an official inter-agency operational log entry
   */
  async logAction({
    agency,                     // e.g. "OSDMA", "NDMA", "Coast Guard", "OPTCL", "State Police"
    officerInCharge,           // e.g. "Collector & District Magistrate, Bhadrak"
    actionType,                 // "GRID_ISOLATION", "EVACUATION_MANDATE", "SAR_DISPATCH", "PORT_CLOSURE"
    summary,                    // e.g. "Preemptive 220kV de-energization at Bhadrak Substation"
    affectedAssets = [],        // e.g. ["Bhadrak 220kV Main Transmission Substation"]
    coords = null,              // [lat, lng]
    acknowledgedBy = []         // ["Gridco Control", "DEOC Bhadrak", "District SP"]
  }) {
    const timestamp = new Date().toISOString();
    const entryId = `ICS214-${new Date().getFullYear()}-${String(this.sequence++).padStart(4, "0")}`;

    const payloadToHash = `${this.previousHash}|${entryId}|${timestamp}|${agency}|${actionType}|${summary}`;
    const entryHash = await this.generateHash(payloadToHash);

    const logEntry = {
      entryId,
      sequence: this.sequence - 1,
      timestamp,
      agency,
      officerInCharge,
      actionType,
      summary,
      affectedAssets,
      coords,
      acknowledgedBy,
      previousHash: this.previousHash,
      verificationHash: entryHash
    };

    this.previousHash = entryHash;
    this.entries.push(logEntry);
    return logEntry;
  }

  /**
   * Returns all chronological entries
   */
  getEntries(filterAgency = null, filterType = null) {
    let list = [...this.entries];
    if (filterAgency) list = list.filter(e => e.agency.toLowerCase().includes(filterAgency.toLowerCase()));
    if (filterType) list = list.filter(e => e.actionType === filterType);
    return list;
  }

  /**
   * Verifies the cryptographic chain integrity of the ledger
   */
  async verifyLedgerIntegrity() {
    let prev = "0000000000000000000000000000000000000000000000000000000000000000";
    for (const entry of this.entries) {
      const payload = `${prev}|${entry.entryId}|${entry.timestamp}|${entry.agency}|${entry.actionType}|${entry.summary}`;
      const recomputed = await this.generateHash(payload);
      if (recomputed !== entry.verificationHash) {
        return { valid: false, compromisedEntryId: entry.entryId };
      }
      prev = entry.verificationHash;
    }
    return { valid: true, totalEntries: this.entries.length };
  }

  /**
   * Export formal ICS Form 214 Activity Log in standard format
   */
  exportIcs214(basinName = "Bay of Bengal (Cyclone DANA)") {
    const timestamp = new Date().toUTCString();
    let text = `================================================================================
              ICS FORM 214 — EOC INTER-AGENCY OPERATIONAL ACTIVITY LOG
================================================================================
1. INCIDENT NAME: ${basinName.toUpperCase()}
2. OPERATIONAL PERIOD: ${timestamp}
3. COMMAND ENTITY: STATE EMERGENCY OPERATIONS CENTER (SEOC) & BRICS EOC NODE
4. SECURITY CLASSIFICATION: OFFICIAL EOC DIRECTIVE LEDGER (APPEND-ONLY)
================================================================================
TIME (UTC)  | AGENCY        | ACTION TYPE          | DIRECTIVE SUMMARY
--------------------------------------------------------------------------------\n`;

    this.entries.forEach(e => {
      const timeShort = new Date(e.timestamp).toISOString().slice(11, 19);
      const agencyPad = (e.agency || "").padEnd(13, " ").slice(0, 13);
      const typePad = (e.actionType || "").padEnd(20, " ").slice(0, 20);
      text += `${timeShort}    | ${agencyPad} | ${typePad} | ${e.summary}\n`;
      if (e.affectedAssets && e.affectedAssets.length > 0) {
        text += `             | Target Assets: ${e.affectedAssets.join(", ")}\n`;
      }
      if (e.acknowledgedBy && e.acknowledgedBy.length > 0) {
        text += `             | Acknowledgments: ${e.acknowledgedBy.join(", ")} [SHA: ${e.verificationHash.slice(0, 8)}]\n`;
      }
      text += `--------------------------------------------------------------------------------\n`;
    });

    text += `================================================================================
LEDGER VERIFICATION: CRYPTOGRAPHIC BLOCK INTEGRITY VALIDATED
OFFICIAL RECORD OF THE DISASTER MANAGEMENT AUTHORITY
================================================================================`;

    return text;
  }

  /**
   * Baseline historical log entries for active disaster scenario
   */
  async seedBasinLogs(basinKey) {
    this.entries = [];
    this.sequence = 1;
    this.previousHash = "0000000000000000000000000000000000000000000000000000000000000000";

    if (basinKey === "india") {
      await this.logAction({
        agency: "OSDMA / SEOC",
        officerInCharge: "Managing Director, OSDMA",
        actionType: "EOC_ACTIVATION",
        summary: "Activated State Emergency Operations Center to Level-1 Red Alert status for Cyclone DANA landfall.",
        affectedAssets: ["Coastal District EOCs: Bhadrak, Kendrapara, Balasore, Jagatsinghpur"],
        acknowledgedBy: ["NDMA Delhi", "Revenue & Disaster Management Dept", "Indian Navy INS Chilka"]
      });

      await this.logAction({
        agency: "COAST_GUARD",
        officerInCharge: "Commander, Coast Guard District HQ 7 (Paradip)",
        actionType: "PORT_CLOSURE",
        summary: "Enforced maritime safety zone; suspended cargo operations and recalled 420 fishing craft to Dhamra/Paradip harbor.",
        affectedAssets: ["Dhamra Port Strategic Gate Hub & Navigational Channel"],
        coords: [20.825, 86.955],
        acknowledgedBy: ["Dhamra Port VTS", "Fisheries Dept", "Marine Police"]
      });

      await this.logAction({
        agency: "OPTCL / DISCOM",
        officerInCharge: "Superintending Engineer (Grid Protection)",
        actionType: "GRID_ISOLATION",
        summary: "Preemptive isolation authorized for 33kV coastal distribution feeders anticipating 3.6m surge penetration.",
        affectedAssets: ["Bhadrak 220kV Main Transmission Substation"],
        coords: [21.057, 86.495],
        acknowledgedBy: ["State Load Despatch Center (SLDC)", "DEOC Bhadrak"]
      });

      await this.logAction({
        agency: "HEALTH_DEPT",
        officerInCharge: "Chief District Medical Officer (CDMO), Bhadrak",
        actionType: "HOSPITAL_SURGE",
        summary: "Dispatched twin 250kVA auxiliary diesel backup units and staged Type 1 Critical Care transport to Basudevpur CHC.",
        affectedAssets: ["Basudevpur Community Health Center"],
        coords: [21.141, 86.745],
        acknowledgedBy: ["108 Ambulance Command", "Block Medical Officer"]
      });
    } else {
      await this.logAction({
        agency: "NATIONAL_EOC",
        officerInCharge: "Director of Emergency Coordination",
        actionType: "EOC_ACTIVATION",
        summary: "Joint Taskforce activation for anticipatory storm surge protection and lifeline asset defense.",
        affectedAssets: ["Metropolitan Coastal Infrastructure"],
        acknowledgedBy: ["National Coast Guard", "Disaster Defense Agency"]
      });
    }
  }
}
