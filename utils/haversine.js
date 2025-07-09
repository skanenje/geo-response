/**
 * Calculates the haversine distance between two points on Earth.
 * @param {number} lat1 Latitude of the first point.
 * @param {number} lon1 Longitude of the first point.
 * @param {number} lat2 Latitude of the second point.
 * @param {number} lon2 Longitude of the second point.
 * @returns {number} The distance in kilometers.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians
    const toRad = (x) => x * Math.PI / 180;
  
    // Earth radius in km
    const R = 6371;
    // Difference in latitude
    const dLat = toRad(lat2 - lat1);
    // Difference in longitude
    const dLon = toRad(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}
  
export default haversineDistance;
  