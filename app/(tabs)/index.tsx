
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import OwnerDashboard from '../../src/pages/owner/OwnerDashboard';
import Dashboard from '../../src/pages/Dashboard';

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

  // Show the regular dashboard for other users
  console.log('Affichage du dashboard utilisateur');
  return <Dashboard />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
