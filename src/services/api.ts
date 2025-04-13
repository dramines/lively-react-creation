
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Define an ApiError class for consistent error handling
export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

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

export interface PropertyUpdate {
  id?: string;
  title?: string;
  type?: string;
  address?: string;
  price?: number;
  status?: 'available' | 'booked' | 'maintenance';
  description?: string;
  wifi?: boolean;
  parking?: boolean;
  coffee?: boolean;
  reception?: boolean;
  secured?: boolean;
  accessible?: boolean;
  printers?: boolean;
  kitchen?: boolean;
  flexible_hours?: boolean;
  workstations?: number;
  meeting_rooms?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  country?: string;
  region?: string;
}

// Type for creating a new property
export type PropertyCreate = Omit<Property, 'id' | 'image_url'>;

export interface Review {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
}

// Additional user interfaces for our application
export interface UserData {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
}

export interface UserUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user' | 'owner';
}

export interface UserRegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'owner';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Helper function to map API property to our OfficePropertyData format
export const mapApiPropertyToOfficePropertyData = (property: Property) => {
  return {
    id: property.id,
    title: property.title,
    address: property.address,
    price: property.price,
    type: property.type,
    status: property.status,
    image_url: property.image_url || '',
    workstations: property.workstations || 0,
    meeting_rooms: property.meeting_rooms || 0,
    area: property.area || 0,
    rating: property.rating || 4,
    wifi: property.wifi || false,
    parking: property.parking || false,
    coffee: property.coffee || false,
    reception: property.reception || false,
    secured: property.secured || false,
    accessible: property.accessible || false,
    printers: property.printers || false,
    kitchen: property.kitchen || false,
    flexible_hours: property.flexible_hours || false,
    country: property.country || '',
    region: property.region || ''
  };
};

export const authApi = {
  async login(email: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, { email });
    return response.data;
  },
  async verify(token: string): Promise<User> {
    const response = await axios.post(`${API_URL}/auth/verify`, { token });
    return response.data;
  },
};

export const userApi = {
  async login(credentials: { email: string; password: string }): Promise<{ token?: string; user?: UserData }> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.data.message || 'Authentication failed', error.response.status);
      }
      throw new ApiError('Authentication failed');
    }
  },
  
  async register(userData: UserRegisterData): Promise<UserData> {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.data.message || 'Registration failed', error.response.status);
      }
      throw new ApiError('Registration failed');
    }
  },
  
  async getAllUsers(): Promise<UserData[]> {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.data.message || 'Failed to fetch users', error.response.status);
      }
      throw new ApiError('Failed to fetch users');
    }
  },
  
  async updateUser(id: number, userData: UserUpdateData): Promise<UserData> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.data.message || 'Failed to update user', error.response.status);
      }
      throw new ApiError('Failed to update user');
    }
  },
  
  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.data.message || 'Failed to delete user', error.response.status);
      }
      throw new ApiError('Failed to delete user');
    }
  },
  
  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      // Clear any client-side tokens or state
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear client-side tokens even if API call fails
    }
  }
};

export const propertyApi = {
  async getProperties(): Promise<Property[]> {
    const response = await axios.get(`${API_URL}/properties`);
    return response.data;
  },

  async getAllProperties(): Promise<Property[]> {
    return this.getProperties(); // Alias for getProperties to maintain compatibility
  },

  async getPropertyById(id: string): Promise<Property> {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
  },

  async createProperty(data: PropertyCreate, image?: File): Promise<Property> {
    try {
      const formData = new FormData();
      
      // Add all property data to formData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle boolean values explicitly
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(`${API_URL}/properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  async updateProperty(id: string, data: PropertyUpdate, image?: File): Promise<Property> {
    try {
      if (image) {
        const formData = new FormData();
        
        // Add all property data to formData
        Object.keys(data).forEach(key => {
          // Handle boolean values explicitly
          if (typeof data[key as keyof PropertyUpdate] === 'boolean') {
            formData.append(key, data[key as keyof PropertyUpdate] ? 'true' : 'false');
          } else if (data[key as keyof PropertyUpdate] !== undefined) {
            formData.append(key, String(data[key as keyof PropertyUpdate]));
          }
        });
        
        // Add image file
        formData.append('image', image);
        
        const response = await axios.put(`${API_URL}/properties/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const response = await axios.put(`${API_URL}/properties/${id}`, data);
        return response.data;
      }
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  async deleteProperty(id: string): Promise<void> {
    await axios.delete(`${API_URL}/properties/${id}`);
  },
  
  // Helper method to map API property to our application's format
  mapApiPropertyToOfficePropertyData
};

export const reviewApi = {
  async getReviewsByPropertyId(propertyId: string): Promise<Review[]> {
    const response = await axios.get(`${API_URL}/reviews?property_id=${propertyId}`);
    return response.data;
  },
};
