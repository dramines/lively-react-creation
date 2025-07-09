import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement de l'application
    const checkAuthState = () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        const authTimestamp = localStorage.getItem('adminAuthTimestamp');
        
        if (adminAuth === 'true' && authTimestamp) {
          const now = new Date().getTime();
          const authTime = parseInt(authTimestamp, 10);
          const hoursSinceAuth = (now - authTime) / (1000 * 60 * 60);
          
          // Keep authentication for 24 hours
          if (hoursSinceAuth < 24) {
            setIsAuthenticated(true);
            console.log('Admin authentication restored from localStorage');
          } else {
            // Authentication expired, clear localStorage
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminAuthTimestamp');
            console.log('Admin authentication expired, cleared localStorage');
          }
        }
      } catch (error) {
        console.error('Error checking admin auth state:', error);
        // Clear potentially corrupted localStorage
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTimestamp');
      }
    };

    checkAuthState();
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'adminspada') {
      setIsAuthenticated(true);
      
      try {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminAuthTimestamp', new Date().getTime().toString());
        console.log('Admin authentication saved to localStorage');
      } catch (error) {
        console.error('Error saving admin auth to localStorage:', error);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    
    try {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminAuthTimestamp');
      console.log('Admin authentication cleared from localStorage');
    } catch (error) {
      console.error('Error clearing admin auth from localStorage:', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
