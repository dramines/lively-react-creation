
/**
 * Tab principal - Écran d'accueil
 * Main tab - Home screen
 * 
 * Ce fichier gère la redirection selon le rôle de l'utilisateur:
 * - Propriétaire: OwnerDashboard
 * - Utilisateur standard: HomeScreen
 * 
 * This file manages redirection based on user role:
 * - Owner: OwnerDashboard
 * - Standard user: HomeScreen
 */

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import OwnerDashboard from '../../src/pages/owner/OwnerDashboard';
import HomeScreen from '../../src/pages/HomeScreen';

export default function HomeTab() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've completed the initial auth check and user is null
    if (!loading && !user) {
      console.log('Aucun utilisateur, redirection vers login');
      router.replace('/(auth)/login');
    } else if (user) {
      console.log(`Utilisateur connecté: ${user.prenom} ${user.nom} (${user.role})`);
    }
  }, [user, router, loading]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  // Don't render anything if user is null - we're redirecting
  if (!user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  // Show the owner dashboard for owner users
  if (user.role === 'owner') {
    console.log('Affichage du dashboard propriétaire');
    return <OwnerDashboard />;
  }

  // Show the new HomeScreen for standard users instead of the Dashboard
  console.log('Affichage de la page d\'accueil pour utilisateur standard');
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
