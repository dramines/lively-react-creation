
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { Artiste } from '../types';

const ENDPOINT = '/artists';

export const ArtistsService = {
  getAllArtists: async (userId?: string) => {
    try {
      const params = userId ? { user_id: userId } : {};
      return await fetchData(`${ENDPOINT}/read.php`, params);
    } catch (error) {
      console.error('Error fetching artists:', error);
      return [];
    }
  },

  getArtist: async (id: string) => {
    try {
      return await fetchData(`${ENDPOINT}/read_one.php`, { id });
    } catch (error) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      // Return fallback data for easier development and testing
      return {
        id: id,
        nom: 'Artist data unavailable',
        genre: 'Unknown genre',
        photo: 'https://via.placeholder.com/150',
        bio: 'Data could not be loaded. Please try again later.',
        email: '',
        telephone: '',
        adresse: '',
        social: {
          instagram: '',
          facebook: '',
          youtube: ''
        },
        evenementsPassés: 0,
        user_id: ''
      };
    }
  },

  createArtist: async (artistData: any) => {
    // Format the data to match what the API expects
    const formattedData = {
      name: artistData.nom,
      genre: artistData.genre || '',
      email: artistData.email || '',
      phone: artistData.telephone || '',
      user_id: artistData.user_id
    };
    
    return createData(`${ENDPOINT}/create.php`, formattedData);
  },

  updateArtist: async (artistData: any) => {
    return updateData(`${ENDPOINT}/update.php`, artistData);
  },

  deleteArtist: async (id: string) => {
    return deleteData(`${ENDPOINT}/delete.php?id=${id}`);
  }
};
