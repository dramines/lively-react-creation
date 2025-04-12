
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Text, Platform, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import { ROUTES } from '../navigation/navigationConstants';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Custom hooks
import { useLocationPermission } from '../hooks/useLocationPermission';
import { usePlacesData } from '../hooks/usePlacesData';
import { searchPlaces } from '../services/PlaceService';

// Components
import MapHeader from '../components/map/MapHeader';
import CategoryFilters from '../components/map/CategoryFilters';
import MapContent from '../components/map/MapContent';
import SearchInput from '../components/map/SearchInput';
import { LoadingState, ErrorState } from '../components/map/LoadingErrorStates';
import { FooterNav } from '../components/FooterNav';

const initialRegion = {
  latitude: 36.7755,
  longitude: 8.7834,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [filterType, setFilterType] = useState(null);
  const [mapRegion, setMapRegion] = useState(initialRegion);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Custom hooks with error handling
  const { userLocation, locationError } = useLocationPermission();
  const { places, isLoading, error, fetchPlaces } = usePlacesData();
  
  // Make sure we have a valid region, falling back to initialRegion if userLocation is null
  const currentRegion = userLocation || mapRegion || initialRegion;
  
  // Update map region when user location changes
  useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      console.log('Setting map region from user location:', userLocation);
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [userLocation]);
  
  // Handle region change
  const handleRegionChangeComplete = (region) => {
    setMapRegion(region);
  };

  // Search places when searchQuery changes
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchPlaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching places:', error);
      Alert.alert('Erreur', 'Impossible de rechercher les lieux.');
    } finally {
      setIsSearching(false);
    }
  };

  // Navigate to place details
  const handlePlaceDetails = (placeId) => {
    navigation.navigate(ROUTES.PLACE_DETAILS, { placeId });
  };

  // Filter places by type
  const toggleFilter = useCallback((type) => {
    setFilterType(filterType === type ? null : type);
    // Clear search when changing filters
    setSearchQuery('');
    setSearchResults([]);
  }, [filterType]);

  // Safely extract and validate place data before passing to map
  const filteredPlaces = useMemo(() => {
    if (!places || !Array.isArray(places)) {
      return [];
    }

    // Filter by type if a filter is active
    const filtered = filterType 
      ? places.filter(place => place.type === filterType) 
      : places;

    // Ensure all places have valid coordinates
    return filtered.map(place => ({
      ...place,
      latitude: parseFloat(place.location?.latitude) || mapRegion.latitude,
      longitude: parseFloat(place.location?.longitude) || mapRegion.longitude,
      id: place.id || Math.random().toString() // Ensure each place has a unique ID
    }));
  }, [places, filterType, mapRegion]);

  // Effect to handle errors in coordinate data
  useEffect(() => {
    if (places && Array.isArray(places)) {
      const invalidPlaces = places.filter(
        place => isNaN(parseFloat(place.location?.latitude)) || isNaN(parseFloat(place.location?.longitude))
      );
      
      if (invalidPlaces.length > 0) {
        console.warn('Warning: Some places have invalid coordinates', invalidPlaces);
      }
    }
  }, [places]);

  // Handle location errors
  useEffect(() => {
    if (locationError) {
      console.warn('Location error:', locationError);
    }
  }, [locationError]);

  const retryFetchPlaces = useCallback(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retryFetchPlaces} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
      
      {/* Header */}
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.header}
      >
        <Text style={styles.title}>{t('map.home')}</Text>
        <Text style={styles.subtitle}>{t('map.discover')}</Text>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeInUp"
        duration={800}
        style={styles.mainContent}
      >
        {/* Category Filters */}
        <CategoryFilters 
          filterType={filterType}
          toggleFilter={toggleFilter}
        />
        
        {/* Map Container with Search Input */}
        <View style={styles.mapContainer}>
          <SearchInput 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
          <MapContent 
            mapRef={mapRef}
            initialRegion={currentRegion}
            userLocation={userLocation}
            filteredPlaces={filteredPlaces}
            searchResults={searchResults}
            onRegionChangeComplete={handleRegionChangeComplete}
          />
        </View>
      </Animatable.View>
      
      {/* Footer */}
      <FooterNav navigation={navigation} activeScreen={ROUTES.HOME} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  mainContent: {
    flex: 1,
    padding: SPACING.sm,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default MapScreen;