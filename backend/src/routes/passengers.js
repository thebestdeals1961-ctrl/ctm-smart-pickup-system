/**
 * Passenger Routes
 * Manage passenger profiles and ride history
 */

const express = require('express');
const supabase = require('../utils/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/passengers
 * Get all passengers
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: passengers, error } = await supabase
      .from('passengers')
      .select(`
        *,
        users (full_name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch passengers' });
    }

    res.json({ passengers });

  } catch (error) {
    console.error('Get passengers error:', error);
    res.status(500).json({ error: 'Failed to fetch passengers' });
  }
});

/**
 * POST /api/passengers/register
 * Register a new passenger
 */
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { user_id, home_address, work_address } = req.body;

    const { data: passenger, error } = await supabase
      .from('passengers')
      .insert([{
        user_id,
        home_address: home_address || null,
        work_address: work_address || null,
        total_rides: 0,
        rating: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to register passenger' });
    }

    res.status(201).json({ message: 'Passenger registered', passenger });

  } catch (error) {
    console.error('Register passenger error:', error);
    res.status(500).json({ error: 'Failed to register passenger' });
  }
});

module.exports = router;
