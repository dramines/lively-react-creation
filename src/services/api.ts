// Fix the headers issue in the API service
import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders } from 'axios';

// Base API URL
const API_URL = 'http://localhost:3000/api';

// Custom API error class
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Set up axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Create a new headers object if it doesn't exist
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Transform axios error to ApiError
    const message = 
      error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : error.message || 
          'Une erreur est survenue';
    
    const status = error.response?.status || 500;
    
    return Promise.reject(new ApiError(message, status));
  }
);

// Generic API functions
const fetchData = async (endpoint: string) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

const postData = async (endpoint: string, data: any) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

const updateData = async (endpoint: string, data: any) => {
  const response = await apiClient.put(endpoint, data);
  return response.data;
};

const deleteData = async (endpoint: string) => {
  const response = await apiClient.delete(endpoint);
  return response.data;
};

// User API
export interface User {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const userApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const data = await postData('/auth/login', credentials);
    
    // Save token if returned
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  logout: async (): Promise<void> => {
    try {
      await postData('/auth/logout', {});
    } finally {
      // Clear token regardless of API response
      localStorage.removeItem('token');
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    return await fetchData('/users/me');
  },
  
  getUsers: async (): Promise<User[]> => {
    return await fetchData('/users');
  },
  
  getAllUsers: async (): Promise<User[]> => {
    return await fetchData('/users');
  },
  
  getUserById: async (id: number): Promise<User> => {
    return await fetchData(`/users/${id}`);
  },
  
  register: async (userData: { 
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> => {
    return await postData('/auth/register', userData);
  },
  
  createUser: async (userData: Partial<User> & { password?: string }): Promise<User> => {
    return await postData('/users', userData);
  },
  
  updateUser: async (id: number, userData: Partial<User> & { password?: string }): Promise<User> => {
    return await updateData(`/users/${id}`, userData);
  },
  
  deleteUser: async (id: number): Promise<void> => {
    return await deleteData(`/users/${id}`);
  }
};

// Property types and API
export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: 'available' | 'booked' | 'maintenance';
  property_type: 'office' | 'residential';
  description?: string;
  image_url?: string;
  rating: number;
  workstations?: number;
  meeting_rooms?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  wifi?: boolean;
  parking?: boolean;
  coffee?: boolean;
  reception?: boolean;
  kitchen?: boolean;
  secured?: boolean;
  accessible?: boolean;
  printers?: boolean;
  flexible_hours?: boolean;
  country?: string;
  region?: string;
}

export interface PropertyCreate extends Omit<Property, 'id'> {}
export interface PropertyUpdate extends Partial<Property> {}

// Import the OfficePropertyData interface from OfficePropertyCard to ensure compatibility
import { OfficePropertyData as CardOfficePropertyData } from '@/components/OfficePropertyCard';

// Export our implementation of OfficePropertyData that matches the card component
export type OfficePropertyData = CardOfficePropertyData;

// Cache for properties data to avoid multiple API calls
let propertiesCache: Property[] | null = null;
let propertiesCacheTimestamp: number | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

export const propertyApi = {
  getAllProperties: async (): Promise<Property[]> => {
    // Check if we have a valid cache
    const now = Date.now();
    if (propertiesCache && propertiesCacheTimestamp && (now - propertiesCacheTimestamp < CACHE_DURATION)) {
      console.log('Using cached properties data');
      return propertiesCache;
    }
    
    try {
      console.log('Fetching properties from API');
      const response = await fetchData('/properties');
      
      // Handle API response structure
      let properties: Property[] = [];
      if (response && response.success && Array.isArray(response.data)) {
        // If the API returns { success: true, data: [...] }
        properties = response.data.map((prop: any) => ({
          ...prop,
          // Convert numeric strings to numbers
          price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
          area: prop.area ? (typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area) : undefined,
          rating: typeof prop.rating === 'string' ? parseFloat(prop.rating) : prop.rating,
          // Convert DB booleans (0/1) to actual booleans
          wifi: prop.wifi === 1 || prop.wifi === true,
          parking: prop.parking === 1 || prop.parking === true,
          coffee: prop.coffee === 1 || prop.coffee === true,
          reception: prop.reception === 1 || prop.reception === true,
          kitchen: prop.kitchen === 1 || prop.kitchen === true,
          secured: prop.secured === 1 || prop.secured === true,
          accessible: prop.accessible === 1 || prop.accessible === true,
          printers: prop.printers === 1 || prop.printers === true,
          flexible_hours: prop.flexible_hours === 1 || prop.flexible_hours === true,
          // Include country and region
          country: prop.country || 'fr',
          region: prop.region || ''
        }));
      } else if (Array.isArray(response)) {
        // If the API directly returns an array
        properties = response.map((prop: any) => ({
          ...prop,
          price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
          area: prop.area ? (typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area) : undefined,
          rating: typeof prop.rating === 'string' ? parseFloat(prop.rating) : prop.rating,
          wifi: prop.wifi === 1 || prop.wifi === true,
          parking: prop.parking === 1 || prop.parking === true,
          coffee: prop.coffee === 1 || prop.coffee === true,
          reception: prop.reception === 1 || prop.reception === true,
          kitchen: prop.kitchen === 1 || prop.kitchen === true,
          secured: prop.secured === 1 || prop.secured === true,
          accessible: prop.accessible === 1 || prop.accessible === true,
          printers: prop.printers === 1 || prop.printers === true,
          flexible_hours: prop.flexible_hours === 1 || prop.flexible_hours === true,
          // Include country and region
          country: prop.country || 'fr',
          region: prop.region || ''
        }));
      } else {
        console.warn('API response format unexpected:', response);
        throw new Error('Invalid API response format');
      }
      
      // Update the cache
      propertiesCache = properties;
      propertiesCacheTimestamp = now;
      
      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
  
  getPropertyById: async (id: string): Promise<Property> => {
    try {
      // First check if we have it in cache to avoid an API call
      if (propertiesCache) {
        const cachedProperty = propertiesCache.find(p => p.id === id);
        if (cachedProperty) {
          console.log('Using cached property:', id);
          return cachedProperty;
        }
      }
      
      // Try to fetch from API
      const response = await fetchData(`/properties/${id}`);
      
      // Handle API response structure
      let property: Property;
      if (response && response.success && response.data) {
        const prop = response.data;
        property = {
          ...prop,
          price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
          area: prop.area ? (typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area) : undefined,
          rating: typeof prop.rating === 'string' ? parseFloat(prop.rating) : prop.rating,
          wifi: prop.wifi === 1 || prop.wifi === true,
          parking: prop.parking === 1 || prop.parking === true,
          coffee: prop.coffee === 1 || prop.coffee === true,
          reception: prop.reception === 1 || prop.reception === true,
          kitchen: prop.kitchen === 1 || prop.kitchen === true,
          secured: prop.secured === 1 || prop.secured === true,
          accessible: prop.accessible === 1 || prop.accessible === true,
          printers: prop.printers === 1 || prop.printers === true,
          flexible_hours: prop.flexible_hours === 1 || prop.flexible_hours === true,
          // Include country and region
          country: prop.country || 'fr',
          region: prop.region || ''
        };
      } else {
        property = response;
      }
      
      return property;
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      throw error;
    }
  },
  
  createProperty: async (propertyData: PropertyCreate, imageFile?: File): Promise<Property> => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Add all property data to formData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      const response = await apiClient.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Clear cache after creating a new property
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      
      return response.data;
    } else {
      const result = await postData('/properties', propertyData);
      // Clear cache after creating a new property
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      return result;
    }
  },
  
  updateProperty: async (id: string, propertyData: PropertyUpdate, imageFile?: File): Promise<Property> => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Add all property data to formData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      const response = await apiClient.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Clear cache after updating a property
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      
      return response.data;
    } else {
      const result = await updateData(`/properties/${id}`, propertyData);
      // Clear cache after updating a property
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      return result;
    }
  },
  
  deleteProperty: async (id: string): Promise<void> => {
    await deleteData(`/properties/${id}`);
    // Clear cache after deleting a property
    propertiesCache = null;
    propertiesCacheTimestamp = null;
  },
  
  mapApiPropertyToOfficePropertyData: (property: Property): CardOfficePropertyData => {
    // Create an array of available amenities
    const amenities = [];
    if (property.wifi) amenities.push('wifi');
    if (property.parking) amenities.push('parking');
    if (property.coffee) amenities.push('coffee');
    if (property.kitchen) amenities.push('kitchen');
    if (property.printers) amenities.push('printers');
    if (property.reception) amenities.push('reception');
    if (property.accessible) amenities.push('accessible');
    if (property.secured) amenities.push('secured');
    if (property.flexible_hours) amenities.push('flexible_hours');
    
    return {
      id: property.id,
      title: property.title,
      address: property.address,
      price: property.price,
      type: property.type,
      status: property.status,
      imageUrl: property.image_url || '/placeholder.svg',
      rating: property.rating || 4.0,
      workstations: property.workstations || 0,
      meetingRooms: property.meeting_rooms || 0,
      area: property.area || 0,
      wifi: property.wifi || false,
      parking: property.parking || false,
      flexibleHours: property.flexible_hours || false,
      amenities,
      country: property.country,
      region: property.region
    };
  }
};

// Export generic API functions
export { fetchData, postData, updateData, deleteData };

// Export the axios instance for direct use
export default apiClient;
