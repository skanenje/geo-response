// Import the haversine distance calculation function
import haversineDistance from './utils/haversine.js';
// Import the express framework
import express from 'express';
// Import the cors middleware
import cors from 'cors';
// Import the file system module
import fs from 'fs';
import fetch from 'node-fetch';


// Create an express application
const app = express();
// Define the port the server will listen on
const PORT = 3000;

// Load blackspot data from the zone.json file
const zones = JSON.parse(fs.readFileSync('data/zone.json', 'utf-8'));
// console.log(zones)

// Enable Cross-Origin Resource Sharing
app.use(cors());
// Parse JSON request bodies
app.use(express.json())

// Define a GET endpoint to retrieve nearby zones
app.get('/zones/nearby', (req, res) => {
  // Extract latitude and longitude from the query parameters
  const { lat, lng } = req.query;

  // Check if latitude or longitude are missing
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing 'lat' or 'lng' query parameters" });
  }

  // Parse the latitude and longitude to floating point numbers
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  // Define the search radius in kilometers
  const radius = 1; // km
  // Filter zones based on distance from the user's location
  const nearby = zones
    .map(zone => {
      // Calculate the distance between the user and the zone
      const dist = haversineDistance(userLat, userLng, zone.lat, zone.lng);
      // If the zone is within the radius, return the zone with the distance
      return dist <= radius ? { ...zone, distance_km: +dist.toFixed(3) } : null;
    })
    .filter(Boolean)
    // Sort the zones by distance
    .sort((a, b) => a.distance_km - b.distance_km);

  // Return the nearby zones as a JSON response
  res.json({ nearby_zones: nearby });
});

// Define a POST endpoint to create new zones
app.post('/zones', async (req, res) => {
  const { lat, lng, dangerLevel } = req.body;

  if (!lat || !lng || !dangerLevel) {
    return res.status(400).json({ error: 'lat, lng, and dangerLevel are required' });
  }

  try {
    // Step 1: Reverse geocode the location
    const nominatimURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const response = await fetch(nominatimURL, {
      headers: {
        'User-Agent': 'KeepSafeApp/1.0 (student@example.com)'
      }
    });

    const data = await response.json();

    const name = data.display_name || `Unnamed zone at ${lat}, ${lng}`;

    // Step 2: Create new zone
    const newZone = {
      id: zones.length ? Math.max(...zones.map(z => z.id)) + 1 : 1,
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      dangerLevel
    };

    zones.push(newZone);

    res.status(201).json({
      message: "Zone created and enriched with location info",
      zone: newZone
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch location details" });
  }
});


// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });