
import { fetchData, createData, updateData, deleteData } from '../utils/api';

const ENDPOINT = '/passwords';

export const PasswordsService = {
  getAllPasswords: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    return fetchData(`${ENDPOINT}/read.php`, params);
  },

  getPassword: async (id: string) => {
    return fetchData(`${ENDPOINT}/read_one.php`, { id });
  },

  createPassword: async (passwordData: any) => {
    return createData(`${ENDPOINT}/create.php`, passwordData);
  },

  updatePassword: async (passwordData: any) => {
    return updateData(`${ENDPOINT}/update.php`, passwordData);
  },

  deletePassword: async (id: string) => {
    return deleteData(`${ENDPOINT}/delete.php`, id);
  }
};
