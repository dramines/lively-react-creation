
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

// Default location for Tunisia
const DEFAULT_LOCATION = {
  latitude: 36.7755,
  longitude: 8.7834,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const useLocationPermission = () => {
  // Always initialize with default values
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    
    const requestAndGetLocation = async () => {
      try {
        console.log('Requesting location permission...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Permission status:', status);
        
        if (isMounted) {
          setPermissionStatus(status);
        }
        
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setLocationError('permission_denied');
          
          // On iOS, show a more user-friendly message
          if (Platform.OS === 'ios') {
            Alert.alert(
              t('map.permissions'),
              t('map.permissionsMessage'),
              [
                { text: t('map.settings'), onPress: () => Location.openSettings() },
                { text: t('map.cancel'), style: 'cancel' }
              ]
            );
          }
          return;
        }

        // Get location with high accuracy on Android, but lower on iOS for better battery performance
        const options = Platform.OS === 'ios' 
          ? { accuracy: Location.Accuracy.Balanced } 
          : { accuracy: Location.Accuracy.High };
        
        console.log('Getting current position with options:', options);
        const location = await Location.getCurrentPositionAsync(options);
        console.log('Got location:', location);
        
        if (isMounted && location?.coords) {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setUserLocation(newLocation);
          setLocationError(null);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        if (isMounted) {
          setLocationError('location_error');
        }
        
        if (Platform.OS === 'ios' && error.message?.includes('denied')) {
          Alert.alert(
            t('map.locationError'),
            t('map.enableLocation'),
            [
              { text: t('map.settings'), onPress: () => Location.openSettings() },
              { text: t('map.cancel'), style: 'cancel' }
            ]
          );
        }
      }
    };
    
    requestAndGetLocation();
    
    // Clean up function
    return () => {
      isMounted = false;
    };
  }, [t]);

  return { 
    userLocation, 
    locationError, 
    permissionStatus 
  };
};
