/**
 * Dashboard Routes
 * Admin analytics and statistics
 */

const express = require('express');
const supabase = require('../utils/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics (admin only)
 */
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get today's date range
    const today = new Date().toISOString().split('T')[0];
    const todayStart = `${today}T00:00:00Z`;
    const todayEnd = `${today}T23:59:59Z`;

    // Count total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Count total drivers
    const { count: totalDrivers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true });

    // Count total passengers
    const { count: totalPassengers } = await supabase
      .from('passengers')
      .select('*', { count: 'exact', head: true });

    // Count total rides
    const { count: totalRides } = await supabase
      .from('rides')
      .select('*', { count: 'exact', head: true });

    // Count today's rides
    const { count: todayRides } = await supabase
      .from('rides')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart)
      .lte('created_at', todayEnd);

    // Count pending rides
    const { count: pendingRides } = await supabase
      .from('rides')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Count active (in progress) rides
    const { count: activeRides } = await supabase
      .from('rides')
      .select('*', { count: 'exact', head: true })
      .in('status', ['assigned', 'picked_up', 'in_progress']);

    // Count completed rides
    const { count: completedRides } = await supabase
      .from('rides')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Count available drivers
    const { count: availableDrivers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')
      .eq('is_online', true);

    res.json({
      stats: {
        total_users: totalUsers || 0,
        total_drivers: totalDrivers || 0,
        total_passengers: totalPassengers || 0,
        total_rides: totalRides || 0,
        today_rides: todayRides || 0,
        pending_rides: pendingRides || 0,
        active_rides: activeRides || 0,
        completed_rides: completedRides || 0,
        available_drivers: availableDrivers || 0
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

/**
 * GET /api/dashboard/recent-rides
 * Get recent rides for dashboard (admin only)
 */
router.get('/recent-rides', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        drivers (vehicle_type, vehicle_plate, users (full_name)),
        passengers (users (full_name))
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch recent rides' });
    }

    res.json({ rides });

  } catch (error) {
    console.error('Recent rides error:', error);
    res.status(500).json({ error: 'Failed to fetch recent rides' });
  }
});

module.exports = router;
