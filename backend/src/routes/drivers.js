/**
 * Driver Management Routes
 * Manage driver profiles, status, and availability
 */

const express = require('express');
const supabase = require('../utils/supabase');
const { authenticateToken, requireAdmin, requireDriver } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/drivers
 * Get all drivers
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: drivers, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users (full_name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch drivers' });
    }

    res.json({ drivers });

  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

/**
 * GET /api/drivers/available
 * Get available drivers (ready for pickup)
 */
router.get('/available', authenticateToken, async (req, res) => {
  try {
    const { data: drivers, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users (full_name, email, phone)
      `)
      .eq('status', 'available')
      .eq('is_online', true);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch available drivers' });
    }

    res.json({ drivers });

  } catch (error) {
    console.error('Get available drivers error:', error);
    res.status(500).json({ error: 'Failed to fetch available drivers' });
  }
});

/**
 * POST /api/drivers/register
 * Register a new driver profile (admin only)
 */
router.post('/register', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_id, vehicle_type, vehicle_plate, license_number } = req.body;

    if (!user_id || !vehicle_type || !vehicle_plate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: driver, error } = await supabase
      .from('drivers')
      .insert([{
        user_id,
        vehicle_type,
        vehicle_plate,
        license_number: license_number || null,
        status: 'offline',
        is_online: false,
        current_location: null,
        rating: 0,
        total_rides: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to register driver' });
    }

    res.status(201).json({ message: 'Driver registered', driver });

  } catch (error) {
    console.error('Register driver error:', error);
    res.status(500).json({ error: 'Failed to register driver' });
  }
});

/**
 * PUT /api/drivers/:id/status
 * Update driver status (driver or admin)
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, is_online, current_location } = req.body;

    // Build update object dynamically
    const updates = {};
    if (status) updates.status = status;
    if (is_online !== undefined) updates.is_online = is_online;
    if (current_location) updates.current_location = current_location;

    const { data: driver, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update driver status' });
    }

    res.json({ message: 'Driver status updated', driver });

  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

module.exports = router;
