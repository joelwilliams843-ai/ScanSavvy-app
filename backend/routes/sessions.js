const express = require('express');
const jwt = require('jsonwebtoken');
const { supabase } = require('../lib/supabase');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '6h';

/**
 * POST /api/sessions/create
 * Create a new QR code session
 * Body: { userId, retailer, storeId }
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, retailer, storeId } = req.body;

    // Validate required fields
    if (!userId || !retailer) {
      return res.status(400).json({ error: 'Missing required fields: userId, retailer' });
    }

    // Get clipped coupons for this user
    const { data: clippedCoupons, error: clippedError } = await supabase
      .from('clipped_coupons')
      .select('coupon_id')
      .eq('user_id', userId);

    if (clippedError) throw clippedError;

    const couponIds = (clippedCoupons || []).map(c => c.coupon_id);
    const couponCount = couponIds.length;

    // Calculate estimated savings (mock calculation for now)
    const estimatedSavings = couponCount * 3.95; // Average $3.95 per coupon

    // Create visit session in database
    const { data: session, error: sessionError } = await supabase
      .from('visit_sessions')
      .insert([
        {
          user_id: userId,
          store_name: retailer,
          estimated_savings: estimatedSavings,
          coupon_count: couponCount,
        },
      ])
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Generate JWT token
    const qrToken = jwt.sign(
      {
        sessionId: session.id,
        userId,
        retailer,
        storeId: storeId || null,
        couponIds,
        estimatedSavings,
        couponCount,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

    res.json({
      sessionId: session.id,
      qrToken,
      expiresAt,
      couponCount,
      estimatedSavings,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session', details: error.message });
  }
});

/**
 * GET /api/sessions/:sessionId/validate
 * Validate a QR session token
 */
router.get('/:sessionId/validate', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired', expired: true });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Verify session ID matches
    if (decoded.sessionId !== sessionId) {
      return res.status(401).json({ error: 'Session ID mismatch' });
    }

    // Get session from database
    const { data: session, error: sessionError } = await supabase
      .from('visit_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get clipped coupons for this user
    const { data: clippedCoupons, error: clippedError } = await supabase
      .from('clipped_coupons')
      .select('coupon_id')
      .eq('user_id', decoded.userId);

    if (clippedError) throw clippedError;

    const couponIds = (clippedCoupons || []).map(c => c.coupon_id);

    res.json({
      valid: true,
      session: {
        id: session.id,
        userId: session.user_id,
        storeName: session.store_name,
        estimatedSavings: session.estimated_savings,
        couponCount: session.coupon_count,
        createdAt: session.created_at,
      },
      clippedCoupons: couponIds,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ error: 'Failed to validate session', details: error.message });
  }
});

module.exports = router;
