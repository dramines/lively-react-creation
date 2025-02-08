import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Button, Alert, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableSearch from './Components/DraggableSearch';
import HeaderMap from '../Commons/HeaderMap';
import { useFocusEffect } from '@react-navigation/native';
import MapComponent from './Components/MapComponent';

const MainScreen = () => {

  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderMap />
        <MapComponent />
     
      </SafeAreaView>

      <DraggableSearch
        onSearch={(query) => console.log('Search query:', query)}
        customStyles={{
          position: 'absolute',
          bottom: '10%',
          backgroundColor: 'white',
        }}
      />

      <View style={styles.footerContainer}>
        <FooterNavigator />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutText: {
    marginBottom: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default MainScreen;