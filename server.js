import express from 'express';  
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Load blackspot data (hardcoded values)
const zones = JSON.parse(fs.readFileSync('data/zone.json', 'utf-8'));
// console.log(zones)

app.use(cors());

app.get('/zones/nearby', (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing 'lat' or 'lng' query parameters" });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  const radius = 1; // km
  const nearby = zones
    .map(zone => {
      const dist = haversineDistance(userLat, userLng, zone.lat, zone.lng);
      return dist <= radius ? { ...zone, distance_km: +dist.toFixed(3) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json({ nearby_zones: nearby });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });