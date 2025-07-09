import haversineDistance from './utils/haversine.js';
import express from 'express';  
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Load blackspot data (hardcoded values)
const zones = JSON.parse(fs.readFileSync('data/zone.json', 'utf-8'));
// console.log(zones)

app.use(cors());
app.use(express.json())

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

app.post('/zones', (req, res) => {
  const { name, lat, lng, dangerLevel } = req.body;

  if (!name || !lat || !lng || !dangerLevel) {
    return res.status(400).json({ error: 'All fields (name, lat, lng, dangerLevel) are required' });
  }

  const newZone = {
    id: zones.length ? Math.max(...zones.map(z => z.id)) + 1 : 1,
    name,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    dangerLevel
  };

  zones.push(newZone);

  res.status(201).json({
    message: "Zone created successfully",
    zone: newZone
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });