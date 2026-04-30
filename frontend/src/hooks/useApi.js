/**
 * API Helper Hook
 * Simplifies making authenticated API requests
 */

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useApi() {
  const { getAuthHeader, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic GET request
  const get = useCallback(async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: getAuthHeader()
      });
      setLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      const errorMsg = err.response?.data?.error || 'Request failed';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    }
  }, [getAuthHeader, logout]);

  // Generic POST request
  const post = useCallback(async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, body, {
        headers: getAuthHeader()
      });
      setLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      const errorMsg = err.response?.data?.error || 'Request failed';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    }
  }, [getAuthHeader, logout]);

  // Generic PUT request
  const put = useCallback(async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, body, {
        headers: getAuthHeader()
      });
      setLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      const errorMsg = err.response?.data?.error || 'Request failed';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    }
  }, [getAuthHeader, logout]);

  return { get, post, put, loading, error };
}
