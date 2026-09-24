// Aegis — Incident Triage & Operational Queue Management Engine
// Handles multi-source distress calls (112/911/CAD, VHF Ch. 16, Panchayats),
// automated spatial deduplication, urgency scoring, and priority dispatch lifecycle.

export const IncidentPriority = {
  P1_LIFE_THREATENING: { code: "P1", weight: 1000, label: "Immediate Life Threat / Rescue" },
  P2_CRITICAL_INFRASTRUCTURE: { code: "P2", weight: 500, label: "Lifeline Failure / Grid Breach" },
  P3_EVACUATION_CHOKE: { code: "P3", weight: 200, label: "Evacuation Corridors & Shelters" },
  P4_STABILIZATION: { code: "P4", weight: 50, label: "Logistics & Routine Relief" }
};

export const IncidentStatus = {
  QUEUED: "QUEUED",
  TRIAGED: "TRIAGED",
  DISPATCHED: "DISPATCHED",
  ON_SCENE: "ON_SCENE",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED"
};

export class IncidentTriageEngine {
  constructor() {
    this.incidents = new Map();
    this.history = [];
    this.sequence = 1001;
  }

  /**
   * Ingest a new incident from CAD, VHF, or field distress beacon
   */
  ingestIncident({
    source = "CAD_112",
    caller = "Anonymous / DEOC Relay",
    locationName,
    coords, // [lat, lng]
    priority = IncidentPriority.P2_CRITICAL_INFRASTRUCTURE,
    category = "FLOOD_RESCUE",
    description,
    affectedPersons = 0,
    surgeDepthM = 0
  }) {
    // Spatial deduplication: Check if there is an active incident within 400m
    const existing = this.findNearbyActiveIncident(coords, 0.4);
    if (existing) {
      existing.callCount = (existing.callCount || 1) + 1;
      existing.affectedPersons = Math.max(existing.affectedPersons, affectedPersons);
      existing.lastReportedAt = new Date().toISOString();
      existing.reports.push({
        source,
        caller,
        timestamp: existing.lastReportedAt,
        notes: description
      });
      this.recalculateScore(existing);
      return { incident: existing, isDuplicate: true };
    }

    const id = `INC-${new Date().getFullYear()}-${this.sequence++}`;
    const timestamp = new Date().toISOString();

    const incident = {
      id,
      source,
      locationName,
      coords,
      priority,
      category,
      description,
      affectedPersons,
      surgeDepthM,
      status: IncidentStatus.QUEUED,
      assignedResources: [],
      createdAt: timestamp,
      lastReportedAt: timestamp,
      callCount: 1,
      reports: [{ source, caller, timestamp, notes: description }],
      triageScore: 0,
      resolutionNotes: null,
      resolvedAt: null
    };

    this.recalculateScore(incident);
    this.incidents.set(id, incident);
    return { incident, isDuplicate: false };
  }

  /**
   * Recalculates dynamic triage priority score based on NIMS priority,
   * surge depth anomaly, exposed lives, and waiting duration.
   */
  recalculateScore(incident) {
    const baseWeight = incident.priority.weight || 100;
    const peopleWeight = Math.min(incident.affectedPersons * 15, 600);
    const surgeWeight = Math.round(incident.surgeDepthM * 80);
    
    // Urgency Aging: older queued calls gain urgency (10 points per 10 minutes)
    const minutesQueued = (Date.now() - new Date(incident.createdAt).getTime()) / (1000 * 60);
    const agingFactor = Math.min(Math.round(minutesQueued), 250);

    incident.triageScore = baseWeight + peopleWeight + surgeWeight + agingFactor;
    return incident.triageScore;
  }

  /**
   * Spatial proximity check (distance in km via Haversine)
   */
  findNearbyActiveIncident(coords, radiusKm = 0.4) {
    if (!coords || coords.length < 2) return null;
    for (const inc of this.incidents.values()) {
      if (inc.status === IncidentStatus.RESOLVED || inc.status === IncidentStatus.CANCELLED) continue;
      const d = this.calculateDistance(coords[0], coords[1], inc.coords[0], inc.coords[1]);
      if (d <= radiusKm) return inc;
    }
    return null;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Assign a first-responder resource to an incident
   */
  assignResource(incidentId, resourceId, resourceSummary = "") {
    const inc = this.incidents.get(incidentId);
    if (!inc) throw new Error(`Incident ${incidentId} not found`);

    if (!inc.assignedResources.includes(resourceId)) {
      inc.assignedResources.push(resourceId);
    }
    inc.status = IncidentStatus.DISPATCHED;
    inc.dispatchedAt = new Date().toISOString();
    return inc;
  }

  /**
   * Transition incident state
   */
  updateStatus(incidentId, newStatus, notes = "") {
    const inc = this.incidents.get(incidentId);
    if (!inc) throw new Error(`Incident ${incidentId} not found`);

    inc.status = newStatus;
    if (newStatus === IncidentStatus.RESOLVED || newStatus === IncidentStatus.CANCELLED) {
      inc.resolvedAt = new Date().toISOString();
      inc.resolutionNotes = notes;
    }
    return inc;
  }

  /**
   * Returns queue sorted by descending urgency score
   */
  getPrioritizedQueue(filterStatus = null) {
    let list = Array.from(this.incidents.values());
    if (filterStatus) {
      list = list.filter(i => i.status === filterStatus);
    } else {
      // Exclude resolved by default from active queue
      list = list.filter(i => i.status !== IncidentStatus.RESOLVED && i.status !== IncidentStatus.CANCELLED);
    }

    // Refresh dynamic scores
    list.forEach(i => this.recalculateScore(i));
    return list.sort((a, b) => b.triageScore - a.triageScore);
  }

  /**
   * Metrics snapshot for EOC executive dashboard and SITREPs
   */
  getQueueMetrics() {
    const all = Array.from(this.incidents.values());
    const active = all.filter(i => i.status !== IncidentStatus.RESOLVED && i.status !== IncidentStatus.CANCELLED);

    return {
      totalReported: all.length,
      activeQueued: active.filter(i => i.status === IncidentStatus.QUEUED).length,
      dispatched: active.filter(i => i.status === IncidentStatus.DISPATCHED).length,
      onScene: active.filter(i => i.status === IncidentStatus.ON_SCENE).length,
      resolved: all.filter(i => i.status === IncidentStatus.RESOLVED).length,
      p1Count: active.filter(i => i.priority.code === "P1").length,
      p2Count: active.filter(i => i.priority.code === "P2").length,
      p3Count: active.filter(i => i.priority.code === "P3").length,
      p4Count: active.filter(i => i.priority.code === "P4").length,
      totalLivesAtRisk: active.reduce((sum, i) => sum + (i.affectedPersons || 0), 0)
    };
  }

  /**
   * Bootstrap baseline scenario incidents for EOC active operations
   */
  seedBasinIncidents(basinKey) {
    this.incidents.clear();

    if (basinKey === "india") {
      this.ingestIncident({
        source: "VHF_CH16_DISTRESS",
        caller: "Dhamra Port Vessel Traffic Service",
        locationName: "Dhamra River Mouth Fishing Jetty",
        coords: [20.795, 86.975],
        priority: IncidentPriority.P1_LIFE_THREATENING,
        category: "MARITIME_STRANDING",
        description: "3 motorized trawlers capsized during 3.6m storm surge; 18 fishermen stranded on navigational beacons.",
        affectedPersons: 18,
        surgeDepthM: 3.6
      });

      this.ingestIncident({
        source: "SCADA_TELEMETRY",
        caller: "Gridco Odisha Control Center",
        locationName: "Bhadrak 220kV Main Transmission Substation",
        coords: [21.057, 86.495],
        priority: IncidentPriority.P2_CRITICAL_INFRASTRUCTURE,
        category: "POWER_GRID_INUNDATION",
        description: "Saltwater surge penetration exceeds 1.8m barrier; secondary 33kV switchyard tripping imminent.",
        affectedPersons: 240000,
        surgeDepthM: 1.85
      });

      this.ingestIncident({
        source: "PANCHAYAT_BEACON",
        caller: "Basudevpur Block Development Officer",
        locationName: "Basudevpur Community Health Center",
        coords: [21.141, 86.745],
        priority: IncidentPriority.P1_LIFE_THREATENING,
        category: "HOSPITAL_POWER_FAILURE",
        description: "Primary power severed; auxiliary generator fuel supply compromised by 1.2m surge flooding.",
        affectedPersons: 145,
        surgeDepthM: 1.2
      });

      this.ingestIncident({
        source: "DISTRICT_POLICE_RADIO",
        caller: "Chandbali Station House Officer",
        locationName: "Baitarani River Bridge Access Corridor (SH-9)",
        coords: [20.778, 86.745],
        priority: IncidentPriority.P3_EVACUATION_CHOKE,
        category: "CORRIDOR_BLOCKAGE",
        description: "Uprooted Casuarina timber belts and 0.8m over-topping flood blocking primary civilian evacuation buses.",
        affectedPersons: 1200,
        surgeDepthM: 0.8
      });
    } else {
      // Default baseline incident for other international basins
      this.ingestIncident({
        source: "EOC_TELEMETRY",
        caller: "Regional Coastline Surveillance",
        locationName: "Central Coastal Corridor Hub",
        coords: [0, 0],
        priority: IncidentPriority.P2_CRITICAL_INFRASTRUCTURE,
        category: "COASTAL_SURGE_ALERT",
        description: "Surge anomaly monitoring active across critical marine infrastructure lifeline sectors.",
        affectedPersons: 15000,
        surgeDepthM: 2.1
      });
    }
  }
}
