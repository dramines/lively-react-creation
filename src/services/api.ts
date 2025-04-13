import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

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

export const propertyApi = {
  async getProperties(): Promise<Property[]> {
    const response = await axios.get(`${API_URL}/properties`);
    return response.data;
  },

  async getPropertyById(id: string): Promise<Property> {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
  },

  async createProperty(data: Omit<Property, 'id'>, image?: File): Promise<Property> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('address', data.address);
      formData.append('price', String(data.price));
      formData.append('type', data.type);
      formData.append('status', data.status);
      formData.append('property_type', data.property_type);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.workstations) {
        formData.append('workstations', String(data.workstations));
      }
      if (data.meeting_rooms) {
        formData.append('meeting_rooms', String(data.meeting_rooms));
      }
      if (data.area) {
        formData.append('area', String(data.area));
      }
      if (data.bedrooms) {
        formData.append('bedrooms', String(data.bedrooms));
      }
      if (data.bathrooms) {
        formData.append('bathrooms', String(data.bathrooms));
      }
      if (data.wifi) {
        formData.append('wifi', String(data.wifi));
      }
      if (data.parking) {
        formData.append('parking', String(data.parking));
      }
      if (data.coffee) {
        formData.append('coffee', String(data.coffee));
      }
      if (data.reception) {
        formData.append('reception', String(data.reception));
      }
      if (data.kitchen) {
        formData.append('kitchen', String(data.kitchen));
      }
      if (data.secured) {
        formData.append('secured', String(data.secured));
      }
      if (data.accessible) {
        formData.append('accessible', String(data.accessible));
      }
      if (data.printers) {
        formData.append('printers', String(data.printers));
      }
      if (data.flexible_hours) {
        formData.append('flexible_hours', String(data.flexible_hours));
      }
      if (data.country) {
        formData.append('country', data.country);
      }
      if (data.region) {
        formData.append('region', data.region);
      }
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
};

export const reviewApi = {
  async getReviewsByPropertyId(propertyId: string): Promise<Review[]> {
    const response = await axios.get(`${API_URL}/reviews?property_id=${propertyId}`);
    return response.data;
  },
};
