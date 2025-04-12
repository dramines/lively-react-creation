
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

  // Safety check for inputs
  const safeInitialRegion = useMemo(() => {
    return initialRegion && typeof initialRegion === 'object' && 
           !isNaN(initialRegion.latitude) && !isNaN(initialRegion.longitude) ? 
           initialRegion : {
             latitude: 36.7755,
             longitude: 8.7834,
             latitudeDelta: 0.0922,
             longitudeDelta: 0.0421,
           };
  }, [initialRegion]);
  
  // Display either search results or filtered places
  const displayPlaces = useMemo(() => {
    const searchArray = Array.isArray(searchResults) ? searchResults : [];
    const filteredArray = Array.isArray(filteredPlaces) ? filteredPlaces : [];
    return (searchArray.length > 0) ? searchArray : filteredArray;
  }, [searchResults, filteredPlaces]);

  // Fallback to initialRegion if userLocation is unavailable
  const safeUserLocation = useMemo(() => {
    if (userLocation && 
        typeof userLocation === 'object' && 
        !isNaN(parseFloat(userLocation.latitude)) && 
        !isNaN(parseFloat(userLocation.longitude))) {
      return userLocation;
    }
    return safeInitialRegion;
  }, [userLocation, safeInitialRegion]);

  // Animate map to user location
  useEffect(() => {
    if (mapRef?.current && safeUserLocation && !mapError) {
      try {
        mapRef.current.animateToRegion({
          latitude: safeUserLocation.latitude,
          longitude: safeUserLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      } catch (error) {
        console.error('Error animating map:', error);
      }
    }
  }, [safeUserLocation, mapError]);

  // Focus map on search results
  useEffect(() => {
    if (mapRef?.current && Array.isArray(searchResults) && searchResults.length > 0 && !mapError) {
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
        console.error('Error focusing on search results:', error);
      }
    }
  }, [searchResults, mapError]);

  const handlePlacePress = (place) => {
    if (place && place.id) {
      navigation.navigate(ROUTES.PLACE_DETAILS, { placeId: place.id });
    } else {
      console.warn('Cannot navigate: invalid place or missing ID');
    }
  };

  // Render markers with extensive null checking
  const placeMarkers = useMemo(() => {
    if (mapError || !Array.isArray(displayPlaces)) return [];
    
    return displayPlaces
      .filter(place => {
        if (!place || typeof place !== 'object') {
          console.warn('Invalid place object found');
          return false;
        }
        
        if (!place.location || typeof place.location !== 'object') {
          console.warn('Place missing location data:', place.id || 'unknown');
          return false;
        }
        
        const lat = parseFloat(place.location.latitude);
        const lng = parseFloat(place.location.longitude);
        
        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid coordinates for place:', place.id || 'unknown');
          return false;
        }
        
        return true;
      })
      .map((place) => {
        const latitude = parseFloat(place.location.latitude);
        const longitude = parseFloat(place.location.longitude);
        const placeId = place.id || `place-${Math.random().toString(36).substr(2, 9)}`;
        
        return (
          <Marker
            key={`place-${placeId}`}
            identifier={`marker-${placeId}`}
            coordinate={{ latitude, longitude }}
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
      });
  }, [displayPlaces, mapError]);

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
