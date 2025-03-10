
import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from '../utils/localStorage';

const API_URL = import.meta.env.VITE_API_URL || '';

// Create a custom Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// Intercept requests to add the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Instead of using array, convert to record
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic API functions
export const getData = async (endpoint: string, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async (endpoint: string, data = {}, config: AxiosRequestConfig = {}) => {
  try {
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const putData = async (endpoint: string, data = {}, config: AxiosRequestConfig = {}) => {
  try {
    const response = await apiClient.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async (endpoint: string, id: string) => {
  try {
    const response = await apiClient.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error);
    throw error;
  }
};
