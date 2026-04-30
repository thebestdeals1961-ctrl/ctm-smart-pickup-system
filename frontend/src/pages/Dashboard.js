/**
 * Dashboard Page
 * Overview statistics and recent activity
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import {
  FaUsers,
  FaCar,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaUserTie,
  FaExclamationTriangle
} from 'react-icons/fa';

function Dashboard() {
  const { get, loading } = useApi();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRides, setRecentRides] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch stats
    const statsResult = await get('/dashboard/stats');
    if (statsResult.data) {
      setStats(statsResult.data.stats);
    }

    // Fetch recent rides
    const ridesResult = await get('/dashboard/recent-rides');
    if (ridesResult.data) {
      setRecentRides(ridesResult.data.rides);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: <FaUsers />, color: '#1a73e8' },
    { label: 'Total Drivers', value: stats?.total_drivers || 0, icon: <FaUserTie />, color: '#fbbc04' },
    { label: 'Total Passengers', value: stats?.total_passengers || 0, icon: <FaUsers />, color: '#34a853' },
    { label: 'Total Rides', value: stats?.total_rides || 0, icon: <FaClipboardList />, color: '#ea4335' },
    { label: "Today's Rides", value: stats?.today_rides || 0, icon: <FaClock />, color: '#1a73e8' },
    { label: 'Pending Rides', value: stats?.pending_rides || 0, icon: <FaExclamationTriangle />, color: '#fbbc04' },
    { label: 'Active Rides', value: stats?.active_rides || 0, icon: <FaCar />, color: '#34a853' },
    { label: 'Completed', value: stats?.completed_rides || 0, icon: <FaCheckCircle />, color: '#34a853' },
  ];

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'badge-pending',
      assigned: 'badge-assigned',
      picked_up: 'badge-picked_up',
      in_progress: 'badge-in_progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled'
    };
    return classes[status] || 'badge-pending';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dashboard</h1>
        <Link to="/rides/new" className="btn btn-primary">
          + New Ride
        </Link>
      </div>

      {loading && !stats && <div className="loading">Loading dashboard...</div>}

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <p>{card.label}</p>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <h3>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Rides */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="card-title">Recent Rides</h2>
          <Link to="/rides" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none' }}>
            View All
          </Link>
        </div>

        {recentRides.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '20px' }}>
            No rides yet. Create your first ride!
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ride #</th>
                  <th>Passenger</th>
                  <th>Driver</th>
                  <th>Pickup</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentRides.map((ride) => (
                  <tr key={ride.id}>
                    <td style={{ fontWeight: 600 }}>{ride.ride_number}</td>
                    <td>{ride.passengers?.users?.full_name || 'N/A'}</td>
                    <td>{ride.drivers?.users?.full_name || 'Unassigned'}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ride.pickup_location}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(ride.status)}`}>
                        {ride.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--gray)' }}>
                      {new Date(ride.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
