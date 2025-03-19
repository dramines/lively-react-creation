
import { fetchData, createData, updateData, deleteData } from '../utils/api';

const ENDPOINT = '/users';

export const UsersService = {
  getAllUsers: async () => {
    return fetchData(`${ENDPOINT}/read.php`);
  },

  getUser: async (id: string) => {
    return fetchData(`${ENDPOINT}/read_one.php`, { id });
  },

  createUser: async (userData: any) => {
    return createData(`${ENDPOINT}/create.php`, userData);
  },

  updateUser: async (userData: any) => {
    return updateData(`${ENDPOINT}/update.php`, userData);
  },

  deleteUser: async (id: string) => {
    return deleteData(`${ENDPOINT}/delete.php`, id);
  }
};
