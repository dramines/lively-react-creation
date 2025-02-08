import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const LocationContainer = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Store location in AsyncStorage
      await AsyncStorage.setItem(
        'userLocation',
        JSON.stringify({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          altitude: currentLocation.coords.altitude,
        })
      );

      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      if (address.length > 0) {
        const { city, country, name, region } = address[0];
        setAddress(`${name}, ${city}, ${region}, ${country}`);
      }
    })();
  }, []);

  useEffect(() => {
    // Retrieve location from AsyncStorage on component mount
    (async () => {
      const storedLocation = await AsyncStorage.getItem('userLocation');
      if (storedLocation) {
        console.log('Retrieved Location:', JSON.parse(storedLocation));
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Current Location:</Text>
      <View style={styles.content}>
        <MaterialIcons name="location-on" size={24} color="#893571" />
        <Text style={styles.text}>{address || errorMsg || 'Loading location...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
    flexWrap: 'wrap',
  },
});

export default LocationContainer;
