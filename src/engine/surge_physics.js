// Aegis - Surge Physics & Vulnerability Engine
// Simulates storm surge geometry, wind swaths, and infrastructure exposure calculation

export class SurgePhysicsEngine {
  constructor() {
    this.EARTH_RADIUS_KM = 6371;
  }

  // Calculate destination point given distance and bearing
  destinationPoint(lat, lng, distanceKm, bearingDeg) {
    const dR = distanceKm / this.EARTH_RADIUS_KM;
    const bRad = (bearingDeg * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;

    const destLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(dR) + Math.cos(latRad) * Math.sin(dR) * Math.cos(bRad)
    );
    const destLngRad =
      lngRad +
      Math.atan2(
        Math.sin(bRad) * Math.sin(dR) * Math.cos(latRad),
        Math.cos(dR) - Math.sin(latRad) * Math.sin(destLatRad)
      );

    return [(destLatRad * 180) / Math.PI, (destLngRad * 180) / Math.PI];
  }

  // Generate an asymmetric storm surge inundation polygon oriented towards the right of the cyclone eye (Northern Hemisphere) or left (Southern Hemisphere)
  generateSurgePolygon(eyeCoord, surgeHeightM, forwardBearingDeg = 310, isSouthernHemisphere = false) {
    const [eyeLat, eyeLng] = eyeCoord;
    const points = [];
    const numPoints = 24;
    
    // In Northern Hemisphere, onshore surge is concentrated in the right-forward quadrant
    const peakAngleOffset = isSouthernHemisphere ? -70 : 70;
    const peakBearing = (forwardBearingDeg + peakAngleOffset + 360) % 360;

    const baseRadiusKm = Math.min(90, Math.max(25, surgeHeightM * 22));

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 360) / numPoints;
      // Angle difference relative to peak onshore winds
      const angleDiff = Math.abs(((angle - peakBearing + 180) % 360) - 180);
      const intensityFactor = Math.max(0.25, Math.cos((angleDiff * Math.PI) / 280));
      const radius = baseRadiusKm * intensityFactor * (0.85 + Math.random() * 0.15);

      const pt = this.destinationPoint(eyeLat, eyeLng, radius, angle);
      points.push(pt);
    }

    return points;
  }

  // Calculate distance between two coordinates in km
  haversineDistance(lat1, lon1, lat2, lon2) {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_KM * c;
  }

  // Assess vulnerability of an infrastructure asset based on eye distance and elevation
  assessAssetExposure(asset, eyeCoord, surgeHeightM, maxWindSpeedKmph) {
    const distanceKm = this.haversineDistance(asset.coords[0], asset.coords[1], eyeCoord[0], eyeCoord[1]);
    
    // Wind factor decreases with distance
    const localWind = maxWindSpeedKmph * Math.exp(-distanceKm / 120);
    // Surge water level anomaly at asset location
    const localSurge = Math.max(0, surgeHeightM * Math.exp(-distanceKm / 75));
    const inundationDepthM = Math.max(0, localSurge - (asset.elevationM || 2.0));

    let riskLevel = "LOW";
    if (inundationDepthM > 0.8 || localWind > 130) {
      riskLevel = "CRITICAL_FAILURE";
    } else if (inundationDepthM > 0.1 || localWind > 90) {
      riskLevel = "HIGH_COMPROMISED";
    } else if (distanceKm < 80) {
      riskLevel = "MODERATE_WARNING";
    }

    return {
      assetId: asset.id,
      distanceKm: Math.round(distanceKm),
      localWindKmph: Math.round(localWind),
      localSurgeM: Number(localSurge.toFixed(2)),
      inundationDepthM: Number(inundationDepthM.toFixed(2)),
      riskLevel
    };
  }
}
