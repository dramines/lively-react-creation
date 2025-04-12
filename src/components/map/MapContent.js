
import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import PlaceCallout from '../PlaceCallout';
import { COLORS } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../navigation/navigationConstants';

const MapContent = ({
  mapRef,
  initialRegion,
  userLocation,
  filteredPlaces = [],
  searchResults = [],
  onRegionChangeComplete,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [mapError, setMapError] = useState(false);
  const [markerKey, setMarkerKey] = useState(Date.now()); // Add key to force re-render markers

  // Debug logs
  console.log('MapContent render with:', { 
    hasMapRef: !!mapRef, 
    initialRegion, 
    userLocation,
    filteredPlacesCount: filteredPlaces?.length,
    searchResultsCount: searchResults?.length
  });

  // Safety check for inputs with detailed logging
  const safeInitialRegion = useMemo(() => {
    // Validate initialRegion
    if (!initialRegion || typeof initialRegion !== 'object') {
      console.warn('MapContent: Invalid initialRegion provided:', initialRegion);
      return {
        latitude: 36.7755,
        longitude: 8.7834,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    
    const { latitude, longitude, latitudeDelta, longitudeDelta } = initialRegion;
    
    // Check if all required properties are valid numbers
    if (isNaN(Number(latitude)) || isNaN(Number(longitude)) ||
        isNaN(Number(latitudeDelta)) || isNaN(Number(longitudeDelta))) {
      console.warn('MapContent: initialRegion contains invalid coordinates:', initialRegion);
      return {
        latitude: 36.7755,
        longitude: 8.7834,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    
    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
      latitudeDelta: Number(latitudeDelta),
      longitudeDelta: Number(longitudeDelta),
    };
  }, [initialRegion]);
  
  // Display either search results or filtered places with safety checks
  const displayPlaces = useMemo(() => {
    try {
      // Validate inputs are arrays
      const searchArray = Array.isArray(searchResults) ? searchResults : [];
      const filteredArray = Array.isArray(filteredPlaces) ? filteredPlaces : [];
      
      const result = (searchArray.length > 0) ? searchArray : filteredArray;
      
      if (!result || result.length === 0) {
        console.log('No places to display');
        return [];
      }

      // Validate that each place has the required properties
      return result
        .filter(place => {
          if (!place || typeof place !== 'object') {
            console.warn('Invalid place object filtered out');
            return false;
          }
          
          if (!place.location || typeof place.location !== 'object') {
            console.warn('Place missing location data filtered out:', place.id || 'unknown');
            return false;
          }

          const lat = parseFloat(place.location.latitude);
          const lng = parseFloat(place.location.longitude);
          
          if (isNaN(lat) || isNaN(lng)) {
            console.warn('Place has invalid coordinates filtered out:', place.id || 'unknown', {lat, lng});
            return false;
          }
          
          return true;
        })
        .map(place => {
          // Ensure each place has all required fields with safe defaults
          return {
            ...place,
            id: place.id || `place-${Math.random().toString(36).substring(2, 9)}`,
            name: place.name || 'Unnamed Place',
            description: place.description || '',
            type: place.type || 'location',
            location: {
              latitude: parseFloat(place.location.latitude),
              longitude: parseFloat(place.location.longitude),
              city: place.location.city || '',
              address: place.location.address || '',
            }
          };
        });
    } catch (error) {
      console.error('Error processing places:', error);
      return [];
    }
  }, [searchResults, filteredPlaces]);

  // Log processed places for debugging
  useEffect(() => {
    console.log(`Processed ${displayPlaces.length} valid places for display`);
    if (displayPlaces.length > 0) {
      console.log('Sample place:', displayPlaces[0]);
    }
  }, [displayPlaces]);

  // Fallback to initialRegion if userLocation is unavailable
  const safeUserLocation = useMemo(() => {
    try {
      // Check if userLocation is valid
      if (userLocation && 
          typeof userLocation === 'object' && 
          userLocation.latitude !== undefined && 
          userLocation.longitude !== undefined &&
          !isNaN(Number(userLocation.latitude)) && 
          !isNaN(Number(userLocation.longitude))) {
        return {
          latitude: Number(userLocation.latitude),
          longitude: Number(userLocation.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
      }
      
      // Log warning and fall back to safe initial region
      if (userLocation) {
        console.warn('Invalid userLocation provided:', userLocation);
      }
      
      return safeInitialRegion;
    } catch (error) {
      console.error('Error processing user location:', error);
      return safeInitialRegion;
    }
  }, [userLocation, safeInitialRegion]);

  // Animate map to user location
  useEffect(() => {
    if (mapRef?.current && safeUserLocation && !mapError) {
      try {
        mapRef.current.animateToRegion(safeUserLocation, 1000);
      } catch (error) {
        console.error('Error animating map to user location:', error);
        setMapError(true);
      }
    }
  }, [safeUserLocation, mapError]);

  // Focus map on search results
  useEffect(() => {
    if (!mapRef?.current || !Array.isArray(searchResults) || searchResults.length === 0 || mapError) {
      return;
    }
    
    try {
      if (searchResults.length === 1) {
        const place = searchResults[0] || {};
        const location = place.location || {};
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
        
        if (!isNaN(latitude) && !isNaN(longitude)) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      } else {
        const coordinates = searchResults
          .filter(place => place && place.location)
          .map(place => {
            const lat = parseFloat(place.location.latitude);
            const lng = parseFloat(place.location.longitude);
            return (!isNaN(lat) && !isNaN(lng)) ? { latitude: lat, longitude: lng } : null;
          })
          .filter(Boolean);
          
        if (coordinates.length > 0) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Error focusing map on search results:', error);
      setMapError(true);
    }
  }, [searchResults, mapError]);

  const handlePlacePress = (place) => {
    try {
      if (place && place.id) {
        navigation.navigate(ROUTES.PLACE_DETAILS, { placeId: place.id });
      } else {
        console.warn('Cannot navigate: invalid place or missing ID');
      }
    } catch (error) {
      console.error('Error navigating to place details:', error);
    }
  };

  // Force re-render markers when displayPlaces changes
  useEffect(() => {
    setMarkerKey(Date.now());
  }, [displayPlaces]);

  // Render markers with extensive null checking
  const placeMarkers = useMemo(() => {
    if (mapError || !Array.isArray(displayPlaces) || displayPlaces.length === 0) {
      console.log('No markers to render: mapError or empty displayPlaces');
      return [];
    }
    
    try {
      return displayPlaces.map((place) => {
        if (!place || !place.location) {
          console.warn('Invalid place skipped in marker rendering');
          return null;
        }
        
        const latitude = parseFloat(place.location.latitude);
        const longitude = parseFloat(place.location.longitude);
        
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn('Invalid coordinates skipped in marker:', place.id, {latitude, longitude});
          return null;
        }
        
        const placeId = place.id || `place-${Math.random().toString(36).substring(2, 9)}`;
        
        return (
          <Marker
            key={`place-${placeId}-${markerKey}`}
            identifier={`marker-${placeId}`}
            coordinate={{
              latitude: latitude,
              longitude: longitude
            }}
            pinColor={COLORS.primary}
            onPress={() => handlePlacePress(place)}
          >
            <Callout tooltip onPress={() => handlePlacePress(place)}>
              <PlaceCallout
                place={place}
                onDetailsPress={() => handlePlacePress(place)}
              />
            </Callout>
          </Marker>
        );
      }).filter(Boolean); // Filter out null markers
    } catch (error) {
      console.error('Error rendering markers:', error);
      return [];
    }
  }, [displayPlaces, mapError, navigation, markerKey]);

  if (mapError) {
    return (
      <View style={[styles.mapWrapper, styles.errorContainer]}>
        <Text style={styles.errorText}>{t('map.loadingError')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setMapError(false)}>
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={null}
        initialRegion={safeInitialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        onRegionChangeComplete={onRegionChangeComplete}
        toolbarEnabled={Platform.OS === 'android'}
        loadingEnabled
        loadingIndicatorColor={COLORS.primary}
        loadingBackgroundColor={COLORS.white}
        moveOnMarkerPress={false}
        pitchEnabled
        rotateEnabled
        zoomEnabled
        zoomControlEnabled={Platform.OS === 'android'}
        onError={(error) => {
          console.error('Map error:', error);
          setMapError(true);
        }}
        mapType="standard"
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        legalLabelInsets={{ bottom: -100, right: -100 }}
        attributionEnabled={false}
      >
        {placeMarkers}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
    color: COLORS.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapContent;
