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

    // Mock store locations (in production, query store_locations table)
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
        retailer: 'Target',
        storeName: 'Target - Downtown',
        address: '456 High St, Columbus, OH 43215',
        lat: 39.9642,
        lng: -83.0007,
      },
      {
        id: '3',
        retailer: 'Walmart',
        storeName: 'Walmart Supercenter',
        address: '789 Broad St, Columbus, OH 43215',
        lat: 39.9580,
        lng: -82.9950,
      },
      {
        id: '4',
        retailer: 'CVS',
        storeName: 'CVS Pharmacy #2341',
        address: '321 Oak Ave, Columbus, OH 43215',
        lat: 39.9670,
        lng: -83.0020,
      },
      {
        id: '5',
        retailer: 'Walgreens',
        storeName: 'Walgreens #5678',
        address: '654 Elm St, Columbus, OH 43215',
        lat: 39.9600,
        lng: -82.9900,
      },
    ];

    // Calculate distance for each store and filter by radius
    const nearbyStores = mockStores
      .map(store => {
        const distance = calculateDistance(userLat, userLng, store.lat, store.lng);
        return { ...store, distance: parseFloat(distance.toFixed(2)) };
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
