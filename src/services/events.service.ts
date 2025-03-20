
import { fetchData, createData, updateData, deleteData } from '../utils/api';

const ENDPOINT = '/events';

export const EventsService = {
  getAllEvents: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    return fetchData(`${ENDPOINT}/read.php`, params);
  },

  getEvent: async (id: string) => {
    return fetchData(`${ENDPOINT}/read_one.php`, { id });
  },

  createEvent: async (eventData: any) => {
    return createData(`${ENDPOINT}/create.php`, eventData);
  },

  updateEvent: async (eventData: any) => {
    return updateData(`${ENDPOINT}/update.php`, eventData);
  },

  deleteEvent: async (id: string) => {
    return deleteData(`${ENDPOINT}/delete.php`, id);
  }
};
