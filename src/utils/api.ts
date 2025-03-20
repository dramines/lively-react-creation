
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'https://respizenmedical.com/vilartprod/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    let config = {};
    
    if (isFormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      };
    }
    
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
