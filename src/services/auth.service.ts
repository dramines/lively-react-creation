
import { createData } from '../utils/api';

const ENDPOINT = '/auth';

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await createData(`${ENDPOINT}/login.php`, credentials);
      if (response && response.email) {
        // If the response contains an email, the login was successful
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response));
        return { success: true, user: response };
      } else {
        // API returned an error message
        return { success: false, message: response.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // Clear other related data
    localStorage.removeItem('files');
    localStorage.removeItem('invoices');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};
