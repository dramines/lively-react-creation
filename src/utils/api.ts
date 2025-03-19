
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'https://respizenmedical.com/vilartprod/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add longer timeout for potentially slow connections
  timeout: 15000,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic GET function
export const fetchData = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Generic POST function
export const createData = async (endpoint: string, data = {}, isFormData = false) => {
  try {
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    } : {};
    
    const response = await api.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${endpoint}:`, error);
    throw error;
  }
};

// Generic PUT function
export const updateData = async (endpoint: string, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

// Updated deleteData function to properly handle parameters
export const deleteData = async (endpoint: string) => {
  try {
    // For DELETE requests, we'll use the endpoint directly which should include
    // any query parameters
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};

export default api;
