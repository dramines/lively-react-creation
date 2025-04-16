
import { Tabs } from 'expo-router';
import { Home, User, Building, Bookmark, MessageCircle } from 'lucide-react-native';
import { useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

function TabsNavigator() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'owner') {
      console.log("Owner role detected in TabLayout");
    } else {
      console.log("Regular user role detected in TabLayout");
    }
  }, [user]);

  // Determine if user is owner
  const isOwner = user?.role === 'owner';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isOwner ? '#9b87f5' : '#0066FF',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isOwner ? 'Dashboard' : 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      {isOwner && (
        <Tabs.Screen
          name="properties"
          options={{
            title: 'Propriétés',
            tabBarIcon: ({ color, size }) => (
              <Building size={size} color={color} />
            ),
          }}
        />
      )}
      {!isOwner && (
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoris',
            tabBarIcon: ({ color, size }) => (
              <Bookmark size={size} color={color} />
            ),
          }}
        />
      )}
      {!isOwner && (
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Réservations',
            tabBarIcon: ({ color, size }) => (
              <Building size={size} color={color} />
            ),
          }}
        />
      )}
      {!isOwner && (
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return <TabsNavigator />;
}
