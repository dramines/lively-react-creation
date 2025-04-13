
/**
 * AuthContext.tsx
 * 
 * Description (FR):
 * Ce fichier définit le contexte d'authentification pour l'application.
 * Il gère:
 * - La connexion et déconnexion des utilisateurs
 * - Le stockage et la récupération des données utilisateur
 * - Les vérifications d'accès et de permissions basées sur les rôles
 * - La persistance de l'état d'authentification
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { userApi, User, ApiError } from '@/services/api';

interface AuthUser {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
  // Add a virtual property for convenience
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasAccess: (route: string) => boolean;
  canEdit: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canCreate: (resource: string) => boolean;
  canView: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Define route access by role
const roleAccess = {
  user: ['/properties', '/settings'],
  admin: ['/properties', '/users', '/messages', '/bookings', '/reviews', '/settings'],
  owner: ['/properties', '/bookings', '/reviews', '/settings']
};

// Define action permissions by role and resource
const rolePermissions = {
  user: {
    edit: ['settings'],
    delete: [],
    create: [],
    view: ['properties']
  },
  admin: {
    edit: ['settings', 'users'],
    delete: ['properties', 'users', 'messages', 'bookings'],
    create: ['users'],
    view: ['properties', 'users', 'messages', 'bookings']
  },
  owner: {
    edit: ['settings', 'properties', 'bookings'],
    delete: ['properties', 'bookings'],
    create: ['properties', 'bookings'],
    view: ['properties', 'bookings']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user data from localStorage on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Try to load user from localStorage first
        const savedUser = localStorage.getItem('userData');
        const savedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (savedUser && savedIsAuthenticated) {
          // Parse and set the user from localStorage
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Skip the API validation to avoid 404 errors
          // The API can be called again when needed for specific operations
        } else {
          // Clear any invalid auth state
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Function to check if user has access to a specific route
  const hasAccess = (route: string): boolean => {
    if (!user) return false;
    return roleAccess[user.role]?.includes(route) || false;
  };

  // Function to check if user can edit a specific resource
  const canEdit = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.edit.includes(resource) || false;
  };

  // Function to check if user can delete a specific resource
  const canDelete = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.delete.includes(resource) || false;
  };
  
  // Function to check if user can create a specific resource
  const canCreate = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.create.includes(resource) || false;
  };
  
  // Function to check if user can view a specific resource
  const canView = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.view.includes(resource) || false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await userApi.login({ email, password });
      
      if (response && response.user) {
        const loggedInUser = {
          ...response.user,
          name: `${response.user.prenom} ${response.user.nom}`.trim() 
        };
        
        // Store both the authentication flag and the user data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(loggedInUser));
        
        setUser(loggedInUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${loggedInUser.prenom} ${loggedInUser.nom}`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await userApi.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Clear all authentication data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasAccess,
      canEdit,
      canDelete,
      canCreate,
      canView
    }}>
      {children}
    </AuthContext.Provider>
  );
};
