
/**
 * HomeScreen.tsx
 * 
 * Cette page affiche la page d'accueil pour les utilisateurs standard après la connexion
 * This page displays the home screen for standard users after login
 * 
 * @author Lovable AI
 * @version 1.0
 */

import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star, Search, Filter, Wifi, Car, Building, Briefcase } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getAllProperties } from '../services/propertyService';
import { Property } from '../types';

// Villes populaires pour les bureaux professionnels
// Popular business cities
const FEATURED_LOCATIONS = [
  {
    id: '1',
    name: 'Paris',
    properties: 184,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  },
  {
    id: '2',
    name: 'Lyon',
    properties: 96,
    image: 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800&q=80',
  },
  {
    id: '3',
    name: 'Marseille',
    properties: 78,
    image: 'https://images.unsplash.com/photo-1589786742483-644a74b8b6de?w=800&q=80',
  },
];

const { width } = Dimensions.get('window');

/**
 * Fonction pour afficher les icônes d'équipement appropriées
 * Function to display appropriate amenity icons
 */
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case 'Wifi haut débit':
      return <Wifi size={16} color="#666" />;
    case 'Parking sécurisé':
      return <Car size={16} color="#666" />;
    case 'Salles de réunion':
      return <Building size={16} color="#666" />;
    case 'Cafétéria':
    case 'Cuisine équipée':
    case 'Café/Thé':
      return <Briefcase size={16} color="#666" />;
    default:
      return <Building size={16} color="#666" />;
  }
};

/**
 * Écran d'accueil pour les utilisateurs standard
 * Home screen for standard users
 */
export default function HomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  /**
   * Récupère les propriétés depuis l'API
   * Fetches properties from the API
   */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser notre service pour récupérer les propriétés
      // Use our service to fetch properties
      const propertiesData = await getAllProperties();
      setProperties(propertiesData);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des propriétés:', err);
      setError('Impossible de charger les propriétés. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère les équipements d'une propriété
   * Gets amenities from property data
   */
  const getPropertyAmenities = (property: Property): string[] => {
    const amenities: string[] = [];
    
    if (property.wifi) amenities.push('Wifi haut débit');
    if (property.parking) amenities.push('Parking sécurisé');
    if (property.meeting_rooms && property.meeting_rooms > 0) amenities.push('Salles de réunion');
    if (property.kitchen) amenities.push('Cuisine équipée');
    if (property.coffee) amenities.push('Café/Thé');
    if (property.reception) amenities.push('Réception');
    if (property.secured) amenities.push('Sécurisé');
    if (property.printers) amenities.push('Imprimantes');
    
    return amenities;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour 👋</Text>
        <Text style={styles.title}>Trouvez votre espace de travail idéal</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Où cherchez-vous un bureau ?"
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#0066FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Villes d'affaires populaires</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsContainer}
        >
          {FEATURED_LOCATIONS.map((location) => (
            <TouchableOpacity key={location.id} style={styles.locationCard}>
              <Image source={{ uri: location.image }} style={styles.locationImage} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.propertyCount}>{location.properties} bureaux</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recommendedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Espaces de bureaux recommandés</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingStateContainer}>
            <ActivityIndicator size="large" color="#0066FF" />
            <Text style={styles.loadingStateText}>Chargement des espaces...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorStateContainer}>
            <Text style={styles.errorStateText}>{error}</Text>
            <TouchableOpacity style={styles.retryStateButton} onPress={fetchProperties}>
              <Text style={styles.retryStateText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : properties.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Aucun espace disponible pour le moment.</Text>
          </View>
        ) : (
          properties.map((property) => {
            const amenities = getPropertyAmenities(property);
            const location = property.address || property.region || 'Emplacement non spécifié';
            
            return (
              <TouchableOpacity
                key={property.id}
                style={styles.propertyCard}
                onPress={() => router.push(`/property/${property.id}`)}
              >
                <Image source={{ uri: property.image_url }} style={styles.propertyImage} />
                <View style={styles.propertyInfo}>
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#0066FF" />
                    <Text style={styles.location}>{location}</Text>
                  </View>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text numberOfLines={2} style={styles.propertyDescription}>{property.description}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#0066FF" fill="#0066FF" />
                    <Text style={styles.rating}>{property.rating || "4.5"}</Text>
                    <Text style={styles.reviews}>({property.reviews || 0} avis)</Text>
                  </View>
                  <View style={styles.amenitiesContainer}>
                    {amenities.slice(0, 3).map((amenity, index) => (
                      <View key={index} style={styles.amenity}>
                        {getAmenityIcon(amenity)}
                        <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{property.price} €</Text>
                    <Text style={styles.perNight}>/ mois</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

/**
 * Styles pour l'écran d'accueil
 * Styles for the home screen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#0066FF',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    marginTop: -20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
  },
  seeAllButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0066FF',
  },
  featuredSection: {
    paddingTop: 32,
  },
  locationsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  locationCard: {
    width: 200,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  locationInfo: {
    padding: 12,
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  propertyCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  recommendedSection: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  propertyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  propertyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  propertyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  amenityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0066FF',
  },
  perNight: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  // Nouveaux styles pour les états de chargement, d'erreur et vide
  // New styles for loading, error, and empty states
  loadingStateContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorStateContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryStateButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
