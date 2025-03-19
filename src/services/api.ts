
import axios from 'axios';

const API_BASE_URL = 'https://respizenmedical.com/vilartprod/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body as string) : undefined,
      headers: options.headers,
    });
    
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: {} as T,
        error: error.response?.data?.message || error.message
      };
    }
    return {
      data: {} as T,
      error: 'An unexpected error occurred'
    };
  }
}

export default api;
