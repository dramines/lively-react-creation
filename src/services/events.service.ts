
import { fetchData, createData, updateData } from '../utils/api';
import { AuthService } from './auth.service';
import { toast } from 'react-hot-toast';

const ENDPOINT = '/events';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const EventsService = {
  getAllEvents: async () => {
    const currentUser = AuthService.getCurrentUser();
    const userIdToUse = currentUser?.id;
    const params = userIdToUse ? { user_id: userIdToUse } : {};
    
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response format from events API:', response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      return [];
    }
  },

  getEvent: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params = { id, ...(userId ? { user_id: userId } : {}) };
    
    try {
      return await fetchData(`${ENDPOINT}/read_one.php`, params);
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      toast.error('Failed to load event details');
      throw error;
    }
  },

  createEvent: async (eventData: Partial<Event>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to create events');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { ...eventData, user_id: userId };
      const response = await createData(`${ENDPOINT}/create.php`, data);
      toast.success('Event created successfully');
      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  },

  updateEvent: async (eventData: Partial<Event>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to update events');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { ...eventData, user_id: userId };
      const response = await updateData(`${ENDPOINT}/update.php`, data);
      toast.success('Event updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to delete events');
      throw new Error('Authentication required');
    }
    
    try {
      // Use the createData function instead of deleteData for compatibility with both POST and DELETE
      const data = { id, user_id: userId };
      const response = await createData(`${ENDPOINT}/delete.php`, data);
      toast.success('Event deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      throw error;
    }
  }
};
