// Aegis — NIMS/ICS Resource Tracking Engine (Kind & Type)
// Implements FEMA/NIMS standardized Resource Typing definitions for emergency disaster operations.
// Tracks asset capability (Type 1-4), owning agency, operational status, and GIS telemetry.

export const ResourceCategory = {
  SEARCH_AND_RESCUE: "SEARCH_AND_RESCUE",
  PUBLIC_WORKS_ENGINEERING: "PUBLIC_WORKS_ENGINEERING",
  EMERGENCY_MEDICAL: "EMERGENCY_MEDICAL",
  MASS_CARE_SHELTER: "MASS_CARE_SHELTER",
  HAZMAT_DECONTAMINATION: "HAZMAT_DECONTAMINATION",
  TACTICAL_COMMS: "TACTICAL_COMMS"
};

export const ResourceStatus = {
  AVAILABLE_STAGED: "AVAILABLE_STAGED",
  ASSIGNED_DISPATCHED: "ASSIGNED_DISPATCHED",
  ON_SCENE_ACTIVE: "ON_SCENE_ACTIVE",
  DEMOBILIZING: "DEMOBILIZING",
  OUT_OF_SERVICE: "OUT_OF_SERVICE"
};

export class ResourceTracker {
  constructor() {
    this.inventory = new Map();
    this.deployments = [];
    this.sequence = 501;
  }

  /**
   * Register a standardized resource into EOC inventory
   */
  registerResource({
    category,
    kind,               // e.g. "Boat, Flood / Swiftwater Rescue", "Generator, Mobile Electric"
    type,               // "Type 1", "Type 2", "Type 3", "Type 4"
    callsign,           // e.g. "NDRF-BOAT-04"
    owningAgency,       // e.g. "National Disaster Response Force (NDRF)"
    specifications,     // e.g. { capacityLpm: 15000, personnel: 6, powerKva: 500 }
    homeBase,           // Staging area name
    coords,             // [lat, lng]
    status = ResourceStatus.AVAILABLE_STAGED
  }) {
    const id = `RES-${category.substring(0, 3)}-${this.sequence++}`;
    const entry = {
      id,
      category,
      kind,
      type,
      callsign,
      owningAgency,
      specifications,
      homeBase,
      coords,
      status,
      assignedIncidentId: null,
      assignedAssetName: null,
      dispatchedAt: null,
      lastStatusUpdate: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toISOString(),
          status,
          notes: "Resource checked in to EOC staging base"
        }
      ]
    };

    this.inventory.set(id, entry);
    return entry;
  }

  /**
   * Dispatch a typed resource to an incident or critical infrastructure asset
   */
  dispatchResource(resourceId, { incidentId = null, assetName = null, destinationCoords = null, notes = "" }) {
    const res = this.inventory.get(resourceId);
    if (!res) throw new Error(`Resource ${resourceId} not found`);

    if (res.status === ResourceStatus.ASSIGNED_DISPATCHED || res.status === ResourceStatus.ON_SCENE_ACTIVE) {
      throw new Error(`Resource ${res.callsign} is already committed to ${res.assignedIncidentId || res.assignedAssetName}`);
    }

    const timestamp = new Date().toISOString();
    res.status = ResourceStatus.ASSIGNED_DISPATCHED;
    res.assignedIncidentId = incidentId;
    res.assignedAssetName = assetName;
    res.dispatchedAt = timestamp;
    res.lastStatusUpdate = timestamp;

    if (destinationCoords) {
      res.coords = destinationCoords;
    }

    res.history.push({
      timestamp,
      status: res.status,
      destination: assetName || incidentId,
      notes: notes || `Dispatched to mission: ${assetName || incidentId}`
    });

    this.deployments.push({
      dispatchId: `DISP-${Date.now().toString().slice(-6)}`,
      resourceId: res.id,
      callsign: res.callsign,
      kind: res.kind,
      type: res.type,
      assignedTo: assetName || incidentId,
      dispatchedAt: timestamp
    });

    return res;
  }

  /**
   * Update status of a resource (e.g. arriving on-scene or returning to staging)
   */
  updateResourceStatus(resourceId, newStatus, notes = "") {
    const res = this.inventory.get(resourceId);
    if (!res) throw new Error(`Resource ${resourceId} not found`);

    const timestamp = new Date().toISOString();
    res.status = newStatus;
    res.lastStatusUpdate = timestamp;

    if (newStatus === ResourceStatus.AVAILABLE_STAGED) {
      res.assignedIncidentId = null;
      res.assignedAssetName = null;
    }

    res.history.push({
      timestamp,
      status: newStatus,
      notes
    });

    return res;
  }

  /**
   * Query inventory with filters
   */
  queryResources({ category = null, kind = null, type = null, status = null } = {}) {
    let list = Array.from(this.inventory.values());
    if (category) list = list.filter(r => r.category === category);
    if (kind) list = list.filter(r => r.kind.toLowerCase().includes(kind.toLowerCase()));
    if (type) list = list.filter(r => r.type === type);
    if (status) list = list.filter(r => r.status === status);
    return list;
  }

  /**
   * Executive Resource Summary Breakdown for SITREPs
   */
  getResourceSummary() {
    const all = Array.from(this.inventory.values());
    const available = all.filter(r => r.status === ResourceStatus.AVAILABLE_STAGED);
    const deployed = all.filter(r => r.status === ResourceStatus.ASSIGNED_DISPATCHED || r.status === ResourceStatus.ON_SCENE_ACTIVE);
    const maintenance = all.filter(r => r.status === ResourceStatus.OUT_OF_SERVICE);

    // Group by Kind
    const byKind = {};
    all.forEach(r => {
      const key = `${r.kind} (${r.type})`;
      if (!byKind[key]) {
        byKind[key] = { total: 0, staged: 0, active: 0 };
      }
      byKind[key].total++;
      if (r.status === ResourceStatus.AVAILABLE_STAGED) byKind[key].staged++;
      if (r.status === ResourceStatus.ASSIGNED_DISPATCHED || r.status === ResourceStatus.ON_SCENE_ACTIVE) byKind[key].active++;
    });

    return {
      totalAssets: all.length,
      stagedAvailable: available.length,
      deployedActive: deployed.length,
      outOfService: maintenance.length,
      kindBreakdown: byKind
    };
  }

  /**
   * Seed realistic regional disaster response assets
   */
  seedBasinResources(basinKey) {
    this.inventory.clear();

    if (basinKey === "india") {
      // NDRF Swiftwater Rescue Boats
      this.registerResource({
        category: ResourceCategory.SEARCH_AND_RESCUE,
        kind: "Boat, Flood / Swiftwater Rescue",
        type: "Type 1",
        callsign: "NDRF-SWR-01",
        owningAgency: "National Disaster Response Force (3rd Bn)",
        specifications: { capacity: "12 Persons", engine: "150 HP Inboard Jet", sonar: "Chirp High-Res" },
        homeBase: "Chandbali Coastal Staging Depot",
        coords: [20.782, 86.745]
      });

      this.registerResource({
        category: ResourceCategory.SEARCH_AND_RESCUE,
        kind: "Boat, Flood / Swiftwater Rescue",
        type: "Type 2",
        callsign: "OSDMA-BOAT-08",
        owningAgency: "Odisha Disaster Rapid Action Force (ODRAF)",
        specifications: { capacity: "8 Persons", engine: "50 HP Outboard", hull: "Reinforced Hypalon" },
        homeBase: "Basudevpur Marine Base",
        coords: [21.140, 86.750]
      });

      // Dewatering Pumps for Substation & Inundated Lifelines
      this.registerResource({
        category: ResourceCategory.PUBLIC_WORKS_ENGINEERING,
        kind: "Pump, High-Capacity Dewatering",
        type: "Type 1",
        callsign: "OFD-PUMP-MAX-01",
        owningAgency: "Odisha Fire & Emergency Service",
        specifications: { capacityLpm: 18000, dischargeDiamInches: 12, primeType: "Automatic Vacuum" },
        homeBase: "Bhadrak District Fire Headquarters",
        coords: [21.055, 86.502]
      });

      // Mobile High-Output Diesel Power Generators for Hospitals & Pumping
      this.registerResource({
        category: ResourceCategory.PUBLIC_WORKS_ENGINEERING,
        kind: "Generator, Mobile Electric Power",
        type: "Type 1",
        callsign: "DISCOM-GEN-500KVA",
        owningAgency: "TP Northern Odisha Distribution Ltd (TPNODL)",
        specifications: { powerOutputKva: 500, voltage: "415V 3-Phase", fuelRunHours: 36 },
        homeBase: "Bhadrak 220kV Grid Substation Staging",
        coords: [21.060, 86.492]
      });

      this.registerResource({
        category: ResourceCategory.PUBLIC_WORKS_ENGINEERING,
        kind: "Generator, Mobile Electric Power",
        type: "Type 2",
        callsign: "OSDMA-GEN-250KVA",
        owningAgency: "District EOC Relief Reserve",
        specifications: { powerOutputKva: 250, voltage: "415V 3-Phase", fuelRunHours: 48 },
        homeBase: "Kendrapara Civil Hospital Reserve",
        coords: [20.505, 86.425]
      });

      // Medical Mobile Evacuation
      this.registerResource({
        category: ResourceCategory.EMERGENCY_MEDICAL,
        kind: "Ambulance, Critical Care Transport",
        type: "Type 1",
        callsign: "108-ADVANCED-MED-03",
        owningAgency: "National Health Mission / 108 Emergency",
        specifications: { ventilator: "Twin High-Flow", monitors: "Multi-Para 12-Lead", offroadDrive: "4x4 Raised Chassis" },
        homeBase: "Basudevpur CHC Medical Bay",
        coords: [21.138, 86.740]
      });

      // Tactical Satellite Cell On Wheels (COW)
      this.registerResource({
        category: ResourceCategory.TACTICAL_COMMS,
        kind: "Mobile Telecommunications Cell-on-Wheels (COW)",
        type: "Type 1",
        callsign: "BSNL-TACTICAL-COW-02",
        owningAgency: "BSNL Disaster Restoration Taskforce",
        specifications: { backhaul: "GSAT-11 Satellite Transponder", coverageRadiusKm: 12, channels: "4G LTE + VHF Repeat" },
        homeBase: "Dhamra Port Strategic Gate Hub",
        coords: [20.820, 86.950]
      });
    } else {
      // Default international asset registry
      this.registerResource({
        category: ResourceCategory.SEARCH_AND_RESCUE,
        kind: "Boat, Flood / Swiftwater Rescue",
        type: "Type 1",
        callsign: "UN-SAR-TASKFORCE-01",
        owningAgency: "International Disaster Defense Wing",
        specifications: { capacity: "12 Persons", engine: "150 HP Jet" },
        homeBase: "Coastal Regional EOC Logistics Pier",
        coords: [0, 0]
      });

      this.registerResource({
        category: ResourceCategory.PUBLIC_WORKS_ENGINEERING,
        kind: "Generator, Mobile Electric Power",
        type: "Type 1",
        callsign: "GRID-EMERGENCY-GEN-01",
        owningAgency: "National Energy Resilience Grid",
        specifications: { powerOutputKva: 500, fuelRunHours: 48 },
        homeBase: "Metropolitan Grid Reserve",
        coords: [0, 0]
      });
    }
  }
}
