
/**
 * PrivateRoute.tsx
 * 
 * Description (FR):
 * Ce composant protège les routes qui nécessitent une authentification.
 * Fonctionnalités:
 * - Vérifie si l'utilisateur est authentifié
 * - Redirige vers la page de connexion si non authentifié
 * - Vérifie les permissions d'accès basées sur le rôle
 * - Affiche un indicateur de chargement pendant la vérification
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type PrivateRouteProps = {
  element: React.ReactNode;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation();
  const { isAuthenticated, hasAccess } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  
  // Log authentication status (only once to avoid console spam)
  useEffect(() => {
    console.log("PrivateRoute - path:", location.pathname, "isAuthenticated:", isAuthenticated);
  }, [location.pathname, isAuthenticated]);
  
  // Set a timeout to prevent flashing loading state for fast auth checks
  useEffect(() => {
    // If auth is already determined, don't show loading state
    if (isAuthenticated === false) {
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  // Check permission separately in its own effect
  useEffect(() => {
    if (isAuthenticated) {
      // Check if user has access to this route
      const permission = hasAccess(location.pathname);
      
      // Always allow access to property detail pages regardless of regular permissions
      const isPropertyDetailPage = location.pathname.startsWith('/properties/');
      
      setHasPermission(permission || isPropertyDetailPage);
      
      // Only log once to avoid console spam
      console.log("User has access to", location.pathname, ":", permission);
    }
  }, [location.pathname, isAuthenticated, hasAccess]);
  
  // Show loading indicator while checking authentication status
  if (isLoading && localStorage.getItem('isAuthenticated') === 'true') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background transition-opacity">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2 text-lg mt-4 font-medium text-primary">Chargement...</span>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated but no permission, redirect to properties
  if (!hasPermission) {
    return <Navigate to="/properties" replace />;
  }
  
  // If authenticated and has access, render the protected component
  return <>{element}</>;
};