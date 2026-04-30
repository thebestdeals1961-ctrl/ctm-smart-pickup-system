/**
 * Create Ride Page
 * Form to create a new ride request
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

function CreateRide() {
  const { get, post, loading } = useApi();
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [formData, setFormData] = useState({
    passenger_id: '',
    pickup_location: '',
    dropoff_location: '',
    pickup_lat: '',
    pickup_lng: '',
    dropoff_lat: '',
    dropoff_lng: '',
    estimated_fare: '',
    notes: ''
  });

  useEffect(() => {
    fetchPassengers();
    fetchAvailableDrivers();
  }, []);

  const fetchPassengers = async () => {
    const result = await get('/passengers');
    if (result.data) {
      setPassengers(result.data.passengers);
    }
  };

  const fetchAvailableDrivers = async () => {
    const result = await get('/drivers/available');
    if (result.data) {
      setDrivers(result.data.drivers);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await post('/rides', formData);

    if (result.data) {
      navigate('/rides');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        Create New Ride
      </h1>

      <div className="card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Passenger *</label>
            <select
              name="passenger_id"
              value={formData.passenger_id}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select a passenger</option>
              {passengers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.users?.full_name} ({p.users?.phone})
                </option>
              ))}
            </select>
            {passengers.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '6px' }}>
                No passengers registered yet. Add passengers first.
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Pickup Location *</label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 123 Main Street, Downtown"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Pickup Latitude (optional)</label>
              <input
                type="number"
                step="any"
                name="pickup_lat"
                value={formData.pickup_lat}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 40.7128"
              />
            </div>
            <div className="form-group">
              <label>Pickup Longitude (optional)</label>
              <input
                type="number"
                step="any"
                name="pickup_lng"
                value={formData.pickup_lng}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dropoff Location *</label>
            <input
              type="text"
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 456 Airport Road"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Dropoff Latitude (optional)</label>
              <input
                type="number"
                step="any"
                name="dropoff_lat"
                value={formData.dropoff_lat}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 40.7589"
              />
            </div>
            <div className="form-group">
              <label>Dropoff Longitude (optional)</label>
              <input
                type="number"
                step="any"
                name="dropoff_lng"
                value={formData.dropoff_lng}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., -73.9851"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estimated Fare (optional)</label>
            <input
              type="number"
              step="0.01"
              name="estimated_fare"
              value={formData.estimated_fare}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 25.00"
            />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Any special instructions..."
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ride'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/rides')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRide;
