import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import FooterNavigator from '../FooterNavigator/FooterNavigator';

export default function HomeScreen({ navigation }) {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.locationText}>A-50 St Royal</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://placeholder.com/banner-image' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>BRIDGING THE</Text>
            <Text style={styles.bannerTitle}>GAP BETWEEN</Text>
            <Text style={styles.bannerTitle}>FOOD WASTE &</Text>
            <Text style={styles.bannerTitle}>HUNGER</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>NGOs Request</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.ngoCards}>
          <View style={styles.ngoCard}>
            <Image
              source={{ uri: 'https://placeholder.com/ngo1' }}
              style={styles.ngoImage}
            />
            <Text style={styles.ngoName}>FoodCare Foundation</Text>
            <Text style={styles.ngoDescription}>Need food donations all the time!</Text>
            <Text style={styles.volunteers}>25,000 VT</Text>
          </View>
          <View style={styles.ngoCard}>
            <Image
              source={{ uri: 'https://placeholder.com/ngo2' }}
              style={styles.ngoImage}
            />
            <Text style={styles.ngoName}>NutriServe Society</Text>
            <Text style={styles.ngoDescription}>Help us help you</Text>
            <Text style={styles.volunteers}>5,000 VT</Text>
          </View>
        </ScrollView>

        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.actionCard}>
            <Image
              source={{ uri: 'https://placeholder.com/food-donation' }}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Food Donation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Image
              source={{ uri: 'https://placeholder.com/ngo-connection' }}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>NGO Connection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Image
              source={{ uri: 'https://placeholder.com/track-delivery' }}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Track Delivery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FooterNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20, // Add some padding at the bottom if needed
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#4CAF50',
  },
  ngoCards: {
    paddingHorizontal: 15,
  },
  ngoCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  ngoImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: '600',
  },
  ngoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  volunteers: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  actionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 20,
  },
  actionCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFE5E5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
