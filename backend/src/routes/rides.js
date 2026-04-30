/**
 * Ride Management Routes
 * Core dispatch system - create, assign, track, and complete rides
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/rides
 * Get all rides with filters
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, driver_id, passenger_id, limit = 50 } = req.query;

    let query = supabase
      .from('rides')
      .select(`
        *,
        drivers (vehicle_type, vehicle_plate, users (full_name, phone)),
        passengers (users (full_name, phone))
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (status) query = query.eq('status', status);
    if (driver_id) query = query.eq('driver_id', driver_id);
    if (passenger_id) query = query.eq('passenger_id', passenger_id);

    const { data: rides, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch rides' });
    }

    res.json({ rides });

  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

/**
 * GET /api/rides/:id
 * Get single ride by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: ride, error } = await supabase
      .from('rides')
      .select(`
        *,
        drivers (vehicle_type, vehicle_plate, users (full_name, phone)),
        passengers (users (full_name, phone))
      `)
      .eq('id', id)
      .single();

    if (error || !ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json({ ride });

  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ error: 'Failed to fetch ride' });
  }
});

/**
 * POST /api/rides
 * Create a new ride request
 */
router.post('/', [
  authenticateToken,
  body('passenger_id').notEmpty(),
  body('pickup_location').trim().notEmpty(),
  body('dropoff_location').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      passenger_id,
      pickup_location,
      dropoff_location,
      pickup_lat,
      pickup_lng,
      dropoff_lat,
      dropoff_lng,
      estimated_fare,
      notes
    } = req.body;

    // Generate ride number
    const rideNumber = `RIDE-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${uuidv4().slice(0,4).toUpperCase()}`;

    const { data: ride, error } = await supabase
      .from('rides')
      .insert([{
        ride_number: rideNumber,
        passenger_id,
        driver_id: null,
        pickup_location,
        dropoff_location,
        pickup_lat: pickup_lat || null,
        pickup_lng: pickup_lng || null,
        dropoff_lat: dropoff_lat || null,
        dropoff_lng: dropoff_lng || null,
        status: 'pending',
        estimated_fare: estimated_fare || null,
        actual_fare: null,
        notes: notes || null,
        created_by: req.user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create ride' });
    }

    res.status(201).json({
      message: 'Ride created successfully',
      ride
    });

  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ error: 'Failed to create ride' });
  }
});

/**
 * PUT /api/rides/:id/assign
 * Assign a driver to a ride
 */
router.put('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_id } = req.body;

    if (!driver_id) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    // Check if driver is available
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('status, is_online')
      .eq('id', driver_id)
      .single();

    if (driverError || !driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    if (!driver.is_online || driver.status !== 'available') {
      return res.status(400).json({ error: 'Driver is not available' });
    }

    // Update ride with driver assignment
    const { data: ride, error } = await supabase
      .from('rides')
      .update({
        driver_id,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to assign driver' });
    }

    // Update driver status to busy
    await supabase
      .from('drivers')
      .update({ status: 'busy' })
      .eq('id', driver_id);

    res.json({
      message: 'Driver assigned successfully',
      ride
    });

  } catch (error) {
    console.error('Assign driver error:', error);
    res.status(500).json({ error: 'Failed to assign driver' });
  }
});

/**
 * PUT /api/rides/:id/status
 * Update ride status
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_fare, cancellation_reason } = req.body;

    const validStatuses = ['picked_up', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = { status };

    if (status === 'picked_up') updates.picked_up_at = new Date().toISOString();
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      if (actual_fare) updates.actual_fare = actual_fare;
    }
    if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString();
      if (cancellation_reason) updates.cancellation_reason = cancellation_reason;
    }

    const { data: ride, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update ride status' });
    }

    // Free up driver if ride completed or cancelled
    if ((status === 'completed' || status === 'cancelled') && ride.driver_id) {
      await supabase
        .from('drivers')
        .update({ status: 'available' })
        .eq('id', ride.driver_id);
    }

    res.json({
      message: `Ride status updated to ${status}`,
      ride
    });

  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ error: 'Failed to update ride status' });
  }
});

module.exports = router;
