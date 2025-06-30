import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Add auth token to requests
  api.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  const request = async (method, url, data = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api[method](url, data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get: (url) => request('get', url),
    post: (url, data) => request('post', url, data),
    put: (url, data) => request('put', url, data),
    delete: (url) => request('delete', url),
  };
};

export default useApi; 