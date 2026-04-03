const express = require('express');
const { supabase } = require('../lib/supabase');
const router = express.Router();

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * GET /api/stores/nearby
 * Find stores near a location
 * Query params: ?lat=&lng=&radius=0.5
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 0.5 } = req.query;

    // Validate required params
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing required query params: lat, lng' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(userLat) || isNaN(userLng) || isNaN(searchRadius)) {
      return res.status(400).json({ error: 'Invalid coordinates or radius' });
    }

    // Query all stores from database
    const { data: stores, error } = await supabase
      .from('store_locations')
      .select('*');

    if (error) throw error;

    // If no stores in database, return empty array
    if (!stores || stores.length === 0) {
      return res.json({
        stores: [],
        count: 0,
        searchRadius,
        userLocation: { lat: userLat, lng: userLng },
      });
    }

    // Calculate distance for each store and filter by radius
    const nearbyStores = stores
      .map(store => {
        const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);
        return {
          id: store.id,
          retailer: store.retailer,
          storeName: store.store_name,
          address: store.address,
          city: store.city,
          state: store.state,
          zip: store.zip,
          lat: parseFloat(store.latitude),
          lng: parseFloat(store.longitude),
          distance: parseFloat(distance.toFixed(2)),
        };
      })
      .filter(store => store.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      stores: nearbyStores,
      count: nearbyStores.length,
      searchRadius,
      userLocation: { lat: userLat, lng: userLng },
    });
  } catch (error) {
    console.error('Error finding nearby stores:', error);
    res.status(500).json({ error: 'Failed to find nearby stores', details: error.message });
  }
});

/**
 * GET /api/stores/:retailer/locations
 * Get all locations for a specific retailer
 */
router.get('/:retailer/locations', async (req, res) => {
  try {
    const { retailer } = req.params;
    const { limit = 10 } = req.query;

    // Mock store locations for the retailer
    const mockStores = [
      {
        id: '1',
        retailer: 'Kroger',
        storeName: 'Kroger - Main Street',
        address: '123 Main St, Columbus, OH 43215',
        lat: 39.9612,
        lng: -82.9988,
      },
      {
        id: '2',
        retailer: 'Kroger',
        storeName: 'Kroger - Riverside',
        address: '890 River Rd, Columbus, OH 43214',
        lat: 39.9700,
        lng: -83.0100,
      },
    ];

    const filteredStores = mockStores
      .filter(s => s.retailer.toLowerCase() === retailer.toLowerCase())
      .slice(0, parseInt(limit));

    res.json({
      retailer,
      stores: filteredStores,
      count: filteredStores.length,
    });
  } catch (error) {
    console.error('Error fetching store locations:', error);
    res.status(500).json({ error: 'Failed to fetch store locations', details: error.message });
  }
});

module.exports = router;
