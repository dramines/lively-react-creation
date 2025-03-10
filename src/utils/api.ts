import axios from 'axios';
import { toast } from 'react-hot-toast';

// Base URL for API requests
const API_BASE_URL = 'https://respizenmedical.com/vilartprod/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error cases
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response.status === 401) {
      toast.error('Authentication error. Please log in again.');
      // Clear auth data if we get a 401
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      // Redirect to login if we're not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to get auth user data for API requests
const getUserForRequest = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// This function handles API fetch requests
export const fetchData = async (endpoint: string, params: Record<string, any> = {}) => {
  try {
    const user = getUserForRequest();
    let requestParams = { ...params };
    
    // Add user_id to params if user exists and params doesn't already have it
    if (user && user.id && !('user_id' in requestParams)) {
      requestParams.user_id = user.id;
    }
    
    const response = await api.get(endpoint, { params: requestParams });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Generic POST function
export const createData = async (endpoint: string, data = {}, isFormData = false) => {
  try {
    const user = getUserForRequest();
    let requestData: any = { ...data };
    
    // Add user_id to data if user exists and it's not a FormData object
    if (user && user.id && !isFormData && !('user_id' in requestData)) {
      requestData.user_id = user.id;
    } else if (user && user.id && isFormData && data instanceof FormData) {
      // For FormData, append user_id if not already there
      if (!data.has('user_id')) {
        data.append('user_id', user.id);
      }
      requestData = data;
    }
    
    let config = {};
    
    if (isFormData) {
      // For FormData, let the browser set the correct Content-Type with boundary
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      };
    }
    
    const response = await api.post(endpoint, requestData, config);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${endpoint}:`, error);
    throw error;
  }
};

// Generic PUT function
export const updateData = async (endpoint: string, data = {}) => {
  try {
    const user = getUserForRequest();
    let requestData: any = { ...data };
    
    // Add user_id to data if user exists
    if (user && user.id && !('user_id' in requestData)) {
      requestData.user_id = user.id;
    }
    
    const response = await api.put(endpoint, requestData);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

// Generic DELETE function
export const deleteData = async (endpoint: string, id: string) => {
  try {
    const user = getUserForRequest();
    let requestData: any = { id };
    
    // Add user_id to data if user exists
    if (user && user.id) {
      requestData.user_id = user.id;
    }
    
    // For most PHP backends, DELETE with JSON body works better
    const response = await api.delete(endpoint, { 
      data: requestData 
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};

export default api;
