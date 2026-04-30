/**
 * Drivers Page
 * View and manage drivers
 */

import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { FaCar, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Drivers() {
  const { get, put, loading } = useApi();
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const result = await get('/drivers');
    if (result.data) {
      setDrivers(result.data.drivers);
    }
  };

  const toggleOnlineStatus = async (driverId, currentStatus) => {
    const result = await put(`/drivers/${driverId}/status`, {
      is_online: !currentStatus,
      status: !currentStatus ? 'available' : 'offline'
    });
    if (result.data) {
      fetchDrivers();
    }
  };

  const getStatusBadge = (status, isOnline) => {
    if (!isOnline) return 'badge-offline';
    const classes = {
      available: 'badge-available',
      busy: 'badge-busy',
      offline: 'badge-offline'
    };
    return classes[status] || 'badge-offline';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Drivers</h1>
      </div>

      {loading && <div className="loading">Loading drivers...</div>}

      <div className="card">
        {drivers.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '40px' }}>
            No drivers registered yet.
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Vehicle</th>
                  <th>Plate</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Online</th>
                  <th>Rating</th>
                  <th>Total Rides</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id}>
                    <td style={{ fontWeight: 600 }}>
                      {driver.users?.full_name || 'N/A'}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCar size={14} />
                        {driver.vehicle_type}
                      </span>
                    </td>
                    <td>{driver.vehicle_plate}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaPhone size={12} />
                        {driver.users?.phone || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(driver.status, driver.is_online)}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${driver.is_online ? 'badge-active' : 'badge-inactive'}`}>
                        {driver.is_online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td>{driver.rating || '0.0'}</td>
                    <td>{driver.total_rides || 0}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${driver.is_online ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleOnlineStatus(driver.id, driver.is_online)}
                      >
                        {driver.is_online ? 'Go Offline' : 'Go Online'}
                      </button>
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

export default Drivers;
