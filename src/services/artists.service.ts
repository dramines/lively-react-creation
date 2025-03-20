
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { Artiste } from '../types';

const ENDPOINT = '/artists';

export const ArtistsService = {
  getAllArtists: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    return fetchData(`${ENDPOINT}/read.php`, params);
  },

  getArtist: async (id: string) => {
    return fetchData(`${ENDPOINT}/read_one.php`, { id });
  },

  createArtist: async (artistData: any) => {
    // Format the data to match what the API expects
    return createData(`${ENDPOINT}/create.php`, artistData);
  },

  updateArtist: async (artistData: any) => {
    return updateData(`${ENDPOINT}/update.php`, artistData);
  },

  deleteArtist: async (id: string, userId: string) => {
    return deleteData(`${ENDPOINT}/delete.php?id=${id}&user_id=${userId}`);
  }
};
