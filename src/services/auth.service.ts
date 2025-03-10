
import { createData } from '../utils/api';
import { User } from '../types';
import { toast } from 'react-hot-toast';

const ENDPOINT = '/auth';

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await createData(`${ENDPOINT}/login.php`, credentials);
      if (response && response.email) {
        // If the response contains an email, the login was successful
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response));
        toast.success(`Bienvenue, ${response.full_name || response.email}`);
        return { success: true, user: response };
      } else {
        // API returned an error message
        toast.error(response.message || 'Identifiants invalides');
        return { success: false, message: response.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Une erreur est survenue pendant la connexion');
      return { success: false, message: 'An error occurred during login' };
    }
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // Clear other related data
    localStorage.removeItem('files');
    localStorage.removeItem('invoices');
    toast.success('Vous avez été déconnecté');
    
    // Trigger a storage event so other components can react
    window.dispatchEvent(new Event('storage'));
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Update the current user's information
  updateCurrentUser: (userData: Partial<User>) => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Trigger a storage event so other components can react
    window.dispatchEvent(new Event('storage'));
    
    return updatedUser;
  }
};
