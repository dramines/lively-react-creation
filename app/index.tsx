import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  // If user is logged in, redirect to the tabs
  // Otherwise redirect to login
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}
