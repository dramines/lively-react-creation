
import { fetchData, createData, updateData } from '../utils/api';
import { AuthService } from './auth.service';
import { toast } from 'react-hot-toast';

const ENDPOINT = '/artists';

export interface Artist {
  id: string;
  name: string;
  genre?: string;
  email?: string;
  phone?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  photo?: string;
  bio?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
}

export const ArtistsService = {
  getAllArtists: async () => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params = userId ? { user_id: userId } : {};
    
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      console.log('API response for artists:', response);
      
      if (!response) {
        console.error('Empty response from artists API');
        return [];
      }
      
      if (!Array.isArray(response)) {
        console.error('Invalid response format from artists API:', response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to load artists');
      return [];
    }
  },

  getArtist: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params = { id, ...(userId ? { user_id: userId } : {}) };
    
    try {
      const response = await fetchData(`${ENDPOINT}/read_one.php`, params);
      console.log('Artist details response:', response);
      
      if (!response || response.message === "Artist not found.") {
        console.error(`Artist with ID ${id} not found`);
        toast.error('Artist not found');
        return null;
      }
      
      // Transform API response to match the Artiste type
      const formattedArtist = {
        id: response.id,
        nom: response.name || '',
        genre: response.genre || '',
        email: response.email || '',
        telephone: response.phone || '',
        photo: response.photo || 'https://via.placeholder.com/150',
        bio: response.bio || '',
        social: response.social || { instagram: '', facebook: '', twitter: '', youtube: '' },
        evenementsPassés: 0,
        adresse: '',
        user_id: response.user_id
      };
      
      return formattedArtist;
    } catch (error) {
      console.error(`Error fetching artist ${id}:`, error);
      toast.error('Failed to load artist details');
      return null;
    }
  },

  createArtist: async (artistData: Partial<Artist>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to create artists');
      throw new Error('Authentication required');
    }
    
    try {
      console.log('Creating artist with data:', { ...artistData, user_id: userId });
      const data = { ...artistData, user_id: userId };
      const response = await createData(`${ENDPOINT}/create.php`, data);
      console.log('Artist creation response:', response);
      
      if (!response || !response.id) {
        console.error('Invalid response from artist creation:', response);
        toast.error('Failed to create artist. Server returned invalid response.');
        throw new Error('Invalid server response');
      }
      
      toast.success('Artist created successfully');
      return response;
    } catch (error) {
      console.error('Error creating artist:', error);
      toast.error('Failed to create artist');
      throw error;
    }
  },

  updateArtist: async (artistData: Partial<Artist>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to update artists');
      throw new Error('Authentication required');
    }
    
    try {
      console.log('Updating artist with data:', { ...artistData, user_id: userId });
      const data = { ...artistData, user_id: userId };
      const response = await updateData(`${ENDPOINT}/update.php`, data);
      console.log('Artist update response:', response);
      
      if (!response) {
        console.error('Invalid response from artist update:', response);
        toast.error('Failed to update artist. Server returned invalid response.');
        throw new Error('Invalid server response');
      }
      
      toast.success('Artist updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating artist:', error);
      toast.error('Failed to update artist');
      throw error;
    }
  },

  deleteArtist: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to delete artists');
      throw new Error('Authentication required');
    }
    
    try {
      console.log('Deleting artist:', { id, user_id: userId });
      const data = { id, user_id: userId };
      const response = await createData(`${ENDPOINT}/delete.php`, data);
      console.log('Artist deletion response:', response);
      
      if (!response) {
        console.error('Invalid response from artist deletion:', response);
        toast.error('Failed to delete artist. Server returned invalid response.');
        throw new Error('Invalid server response');
      }
      
      toast.success('Artist deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Failed to delete artist');
      throw error;
    }
  }
};
