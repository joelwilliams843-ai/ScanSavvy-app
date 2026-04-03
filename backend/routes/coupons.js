const express = require('express');
const { supabase } = require('../lib/supabase');
const router = express.Router();

/**
 * GET /api/coupons/:retailer
 * Get available coupons for a retailer
 * Query params: ?category=&limit=20
 */
router.get('/:retailer', async (req, res) => {
  try {
    const { retailer } = req.params;
    const { category, limit = 20 } = req.query;

    // For now, return mock coupons since we don't have a coupons table yet
    // In production, this would query the coupons table
    const mockCoupons = [
      {
        id: '1',
        retailer: 'Target',
        discount: '25% OFF',
        description: 'All Household Essentials',
        category: 'Household',
        value: 25,
        claimed: 2340,
        badge: 'HOT',
      },
      {
        id: '2',
        retailer: 'Walmart',
        discount: '$10 OFF $50',
        description: 'Grocery Purchases',
        category: 'Grocery',
        value: 10,
        claimed: 1892,
        badge: 'NEW',
      },
      {
        id: '3',
        retailer: 'Kroger',
        discount: 'BOGO Free',
        description: 'Select Snacks & Beverages',
        category: 'Grocery',
        value: 15,
        claimed: 1567,
      },
      {
        id: '4',
        retailer: 'CVS',
        discount: '40% OFF',
        description: 'Health & Wellness Items',
        category: 'Personal Care',
        value: 40,
        claimed: 987,
      },
      {
        id: '5',
        retailer: 'Walgreens',
        discount: '$5 OFF $20',
        description: 'Beauty Purchase',
        category: 'Beauty',
        value: 5,
        claimed: 743,
      },
    ];

    let filteredCoupons = mockCoupons;

    // Filter by retailer
    if (retailer && retailer.toLowerCase() !== 'all') {
      filteredCoupons = filteredCoupons.filter(
        c => c.retailer.toLowerCase() === retailer.toLowerCase()
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      filteredCoupons = filteredCoupons.filter(c => c.category === category);
    }

    // Limit results
    filteredCoupons = filteredCoupons.slice(0, parseInt(limit));

    res.json({
      retailer,
      coupons: filteredCoupons,
      count: filteredCoupons.length,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons', details: error.message });
  }
});

/**
 * POST /api/coupons/clip
 * Clip coupons for a user
 * Body: { userId, couponIds[] }
 */
router.post('/clip', async (req, res) => {
  try {
    const { userId, couponIds } = req.body;

    // Validate required fields
    if (!userId || !couponIds || !Array.isArray(couponIds)) {
      return res.status(400).json({ error: 'Missing required fields: userId, couponIds (array)' });
    }

    if (couponIds.length === 0) {
      return res.status(400).json({ error: 'couponIds array cannot be empty' });
    }

    // Prepare records for insertion
    const records = couponIds.map(couponId => ({
      user_id: userId,
      coupon_id: couponId,
    }));

    // Insert clipped coupons (ignore duplicates)
    const { data, error } = await supabase
      .from('clipped_coupons')
      .upsert(records, { onConflict: 'user_id,coupon_id', ignoreDuplicates: true })
      .select();

    if (error) throw error;

    res.json({
      clipped: data ? data.length : couponIds.length,
      success: true,
    });
  } catch (error) {
    console.error('Error clipping coupons:', error);
    res.status(500).json({ error: 'Failed to clip coupons', details: error.message });
  }
});

/**
 * DELETE /api/coupons/unclip
 * Unclip a coupon for a user
 * Body: { userId, couponId }
 */
router.delete('/unclip', async (req, res) => {
  try {
    const { userId, couponId } = req.body;

    // Validate required fields
    if (!userId || !couponId) {
      return res.status(400).json({ error: 'Missing required fields: userId, couponId' });
    }

    // Delete the clipped coupon
    const { error } = await supabase
      .from('clipped_coupons')
      .delete()
      .eq('user_id', userId)
      .eq('coupon_id', couponId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Coupon unclipped successfully',
    });
  } catch (error) {
    console.error('Error unclipping coupon:', error);
    res.status(500).json({ error: 'Failed to unclip coupon', details: error.message });
  }
});

module.exports = router;
