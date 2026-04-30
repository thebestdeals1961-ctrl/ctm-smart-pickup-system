/**
 * Passengers Page
 * View registered passengers
 */

import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { FaPhone, FaHome, FaBuilding } from 'react-icons/fa';

function Passengers() {
  const { get, loading } = useApi();
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    const result = await get('/passengers');
    if (result.data) {
      setPassengers(result.data.passengers);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Passengers</h1>
      </div>

      {loading && <div className="loading">Loading passengers...</div>}

      <div className="card">
        {passengers.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '40px' }}>
            No passengers registered yet.
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Home Address</th>
                  <th>Work Address</th>
                  <th>Total Rides</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((passenger) => (
                  <tr key={passenger.id}>
                    <td style={{ fontWeight: 600 }}>
                      {passenger.users?.full_name || 'N/A'}
                    </td>
                    <td>{passenger.users?.email || 'N/A'}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaPhone size={12} />
                        {passenger.users?.phone || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {passenger.home_address ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaHome size={12} />
                          {passenger.home_address}
                        </span>
                      ) : (
                        <span style={{ color: '#aaa' }}>-</span>
                      )}
                    </td>
                    <td>
                      {passenger.work_address ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaBuilding size={12} />
                          {passenger.work_address}
                        </span>
                      ) : (
                        <span style={{ color: '#aaa' }}>-</span>
                      )}
                    </td>
                    <td>{passenger.total_rides || 0}</td>
                    <td>{passenger.rating || '0.0'}</td>
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

export default Passengers;
