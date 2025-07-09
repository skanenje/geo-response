// Import the haversine distance calculation function
import haversineDistance from './utils/haversine.js';
// Import the express framework
import express from 'express';
// Import the cors middleware
import cors from 'cors';
// Import the file system module
import fs from 'fs';

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
app.post('/zones', (req, res) => {
  // Extract the zone details from the request body
  const { name, lat, lng, dangerLevel } = req.body;

  // Check if any of the required fields are missing
  if (!name || !lat || !lng || !dangerLevel) {
    return res.status(400).json({ error: 'All fields (name, lat, lng, dangerLevel) are required' });
  }

  // Create a new zone object
  const newZone = {
    id: zones.length ? Math.max(...zones.map(z => z.id)) + 1 : 1,
    name,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    dangerLevel
  };

  // Add the new zone to the zones array
  zones.push(newZone);

  // Return a success message with the newly created zone
  res.status(201).json({
    message: "Zone created successfully",
    zone: newZone
  });
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });