
import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Once loaded, redirect based on auth state
  console.log("Root index redirecting based on user:", user ? `${user.role} (${user.id})` : "not logged in");
  
  // Wait until loading is complete before redirecting
  if (user) {
    // User is authenticated, redirect to tabs
    return <Redirect href="/(tabs)" />;
  } else {
    // User is not authenticated, redirect to login
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  }
});
