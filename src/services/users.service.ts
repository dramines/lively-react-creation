
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { toast } from 'react-hot-toast';
import { User } from '../types';

const ENDPOINT = '/users';

export const UsersService = {
  getAllUsers: async () => {
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      return [];
    }
  },

  getUser: async (id: string) => {
    try {
      const response = await fetchData(`${ENDPOINT}/read_one.php`, { id });
      return response;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      toast.error('Failed to load user details');
      throw error;
    }
  },

  createUser: async (userData: Partial<User>) => {
    try {
      const response = await createData(`${ENDPOINT}/create.php`, userData);
      toast.success('User created successfully');
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      throw error;
    }
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      const response = await updateData(`${ENDPOINT}/update.php`, userData);
      toast.success('User updated successfully');
      
      // If this is the current logged in user, update local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser && currentUser.id === userData.id) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Dispatch storage event to notify components
        window.dispatchEvent(new Event('storage'));
      }
      
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await deleteData(`${ENDPOINT}/delete.php`, id);
      toast.success('User deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  }
};
