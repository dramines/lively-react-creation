import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Animated,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { mapCustomStyle } from '../MapScreen/mapStyle';
import CustomLocationModal from '../../common/CustomLocationModal';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const INITIAL_REGION = {
  latitude: 45.5017,
  longitude: -73.5673,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const AddressPickerScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const { t } = useTranslation();

  const [state, setState] = useState({
    location: null,
    address: '',
    modalVisible: true,
    pinLocation: null,
    showHint: true,
    isLoading: false,
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const saveAddressToStorage = async (addressData) => {
    try {
      await AsyncStorage.setItem('AdressUserFood', JSON.stringify(addressData));
      return true;
    } catch (error) {
      console.error('Storage Error:', error);
      return false;
    }
  };

  const foodAddressPickedUp = async (name, city, region, country, postalCode, locationCoords) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const addressData = {
        name,
        city,
        region,
        country,
        postalCode,
        location: locationCoords,
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
      };

      const saved = await saveAddressToStorage(addressData);
      
      if (saved) {
        Toast.show({
          type: 'success',
          text1: t('AddressPickerScreen.location_saved_successfully'),
          position: 'bottom',
        });
        navigation.goBack();
      } else {
        throw new Error('Failed to save address');
      }
    } catch (error) {
      Alert.alert(t('AddressPickerScreen.error'), t('AddressPickerScreen.failed_to_save_address'));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const moveToCurrentLocation = useCallback((currentLocation) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, []);

  const handleRequestPermission = async () => {
    setState(prev => ({ ...prev, modalVisible: false, isLoading: true }));

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('AddressPickerScreen.permission_denied'),
          t('AddressPickerScreen.enable_location_services')
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setState(prev => ({
        ...prev,
        location: currentLocation,
        pinLocation: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }
      }));

      moveToCurrentLocation(currentLocation);

      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address.length > 0) {
        const { name, city, region, country, postalCode } = address[0];
        setState(prev => ({
          ...prev,
          address: `${name}, ${city}, ${region}, ${country} ${postalCode || ''}`
        }));
      }
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert(
        t('AddressPickerScreen.error'),
        t('AddressPickerScreen.location_error')
      );
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleConfirmLocation = async () => {
    const { pinLocation } = state;
    
    if (!pinLocation) {
      Alert.alert(
        t('AddressPickerScreen.no_location_selected'),
        t('AddressPickerScreen.please_select_location')
      );
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const addressResult = await Location.reverseGeocodeAsync({
        latitude: pinLocation.latitude,
        longitude: pinLocation.longitude,
      });

      if (addressResult.length > 0) {
        const { name, city, region, country, postalCode } = addressResult[0];
        await foodAddressPickedUp(name, city, region, country, postalCode, pinLocation);
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error('Geocoding Error:', error);
      Alert.alert(
        t('AddressPickerScreen.error'),
        t('AddressPickerScreen.error_getting_address')
      );
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => handleConfirmLocation());
  };

  useEffect(() => {
    const hintTimeout = setTimeout(() => {
      setState(prev => ({ ...prev, showHint: false }));
    }, 5000);

    return () => clearTimeout(hintTimeout);
  }, []);

  const { modalVisible, pinLocation, showHint, address, isLoading } = state;

  return (
    <SafeAreaView style={styles.container}>
      <CustomLocationModal
        visible={modalVisible}
        onRequestPermission={handleRequestPermission}
        onClose={() => setState(prev => ({ ...prev, modalVisible: false }))}
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapCustomStyle}
        initialRegion={INITIAL_REGION}
        onPress={(e) => setState(prev => ({
          ...prev,
          pinLocation: e.nativeEvent.coordinate
        }))}
      >
        {pinLocation && (
          <Marker
            coordinate={pinLocation}
            title={address || t("AddressPickerScreen.selected_location")}
            pinColor="black"
          />
        )}
      </MapView>

      {showHint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            {t("AddressPickerScreen.tap_to_select_location")}
          </Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.confirmButtonContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <TouchableOpacity
          onPress={animateButton}
          style={styles.confirmButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {t("AddressPickerScreen.confirm_location")}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  hintContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: '10%',
    right: '10%',
  },
  confirmButton: {
    backgroundColor: '#893571',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddressPickerScreen;
