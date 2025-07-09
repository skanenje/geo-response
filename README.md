# Keep Safe Nearby Zones API

🚨 Simple geolocation backend that finds nearby danger zones (blackspots) based on user location.

### 🔥 Endpoint

`GET /zones/nearby?lat=LAT&lng=LNG`

### ✅ Example

GET /zones/nearby?lat=-0.0920&lng=34.7685

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