# Keep Safe Nearby Zones API

🚨 Simple geolocation backend that finds and manages nearby danger zones (blackspots) based on user location.

### 🔥 Endpoints

`GET /zones/nearby?lat=LAT&lng=LNG` - Retrieves nearby danger zones.

### ✅ Example

GET /zones/nearby?lat=-0.0920&lng=34.7685 - Example request to retrieve nearby zones.

### 📦 Response

```json
{
  "nearby_zones": [
    {
      "id": 1,
      "name": "Kisumu Junction A",
      "lat": -0.0917,
      "lng": 34.768,
      "dangerLevel": "red",
      "distance_km": 0.034
    }
  ]
}
```

### ➕ Create Zone

`POST /zones` - Creates a new danger zone.

Example:

```json
{
  "lat": -0.0920,
  "lng": 34.7685,
  "dangerLevel": "red"
}
```

Response:

```json
{
  "message": "Zone created and enriched with location info",
  "zone": {
    "id": 2,
    "name": "Unnamed zone at -0.092, 34.7685",
    "lat": -0.092,
    "lng": 34.7685,
    "dangerLevel": "red"
  }
}