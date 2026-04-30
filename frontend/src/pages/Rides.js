/**
 * Rides Page
 * View and manage all rides
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { FaEye, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';

function Rides() {
  const { get, put, loading } = useApi();
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRides();
  }, [filter]);

  const fetchRides = async () => {
    let endpoint = '/rides';
    if (filter !== 'all') {
      endpoint += `?status=${filter}`;
    }

    const result = await get(endpoint);
    if (result.data) {
      setRides(result.data.rides);
    }
  };

  const handleStatusUpdate = async (rideId, newStatus) => {
    const result = await put(`/rides/${rideId}/status`, { status: newStatus });
    if (result.data) {
      fetchRides(); // Refresh the list
    }
  };

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

  const statusOptions = [
    { value: 'all', label: 'All Rides' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Rides</h1>
        <Link to="/rides/new" className="btn btn-primary">
          + New Ride
        </Link>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
          style={{ width: '200px' }}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading rides...</div>}

      <div className="card">
        {rides.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '40px' }}>
            No rides found. <Link to="/rides/new" style={{ color: 'var(--primary)' }}>Create one</Link>
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ride #</th>
                  <th>Passenger</th>
                  <th>Driver</th>
                  <th>Pickup Location</th>
                  <th>Dropoff Location</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id}>
                    <td style={{ fontWeight: 600 }}>{ride.ride_number}</td>
                    <td>{ride.passengers?.users?.full_name || 'N/A'}</td>
                    <td>{ride.drivers?.users?.full_name || 'Unassigned'}</td>
                    <td style={{ maxWidth: '150px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ride.pickup_location}
                      </div>
                    </td>
                    <td style={{ maxWidth: '150px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ride.dropoff_location}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(ride.status)}`}>
                        {ride.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--gray)' }}>
                      {new Date(ride.created_at).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {ride.status === 'pending' && (
                          <Link
                            to={`/rides/${ride.id}`}
                            className="btn btn-sm btn-primary"
                            title="Assign Driver"
                          >
                            <FaEdit />
                          </Link>
                        )}
                        {ride.status === 'assigned' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(ride.id, 'picked_up')}
                            title="Mark Picked Up"
                          >
                            <FaEye />
                          </button>
                        )}
                        {ride.status === 'picked_up' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(ride.id, 'in_progress')}
                            title="Start Ride"
                          >
                            <FaEye />
                          </button>
                        )}
                        {ride.status === 'in_progress' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(ride.id, 'completed')}
                            title="Complete Ride"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {['pending', 'assigned'].includes(ride.status) && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatusUpdate(ride.id, 'cancelled')}
                            title="Cancel Ride"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
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

export default Rides;
