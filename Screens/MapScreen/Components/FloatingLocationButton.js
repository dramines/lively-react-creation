import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useWindowDimensions } from 'react-native';

const FloatingLocationButton = () => {
  const { width, height } = useWindowDimensions();

  // Variable to control whether to show the icon or not
  const showIcon = 0; // Change this value to 0 to hide the icon

  const handlePress = () => {
    console.log('Location button pressed');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { bottom: height * 0.26, right: width * 0.03 }]} 
      onPress={handlePress}
    >
      {showIcon === 1 && <MaterialIcons name="my-location" size={24} color="#fff" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#893571', 
    width: 50,
    height: 50,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, 
  },
});

export default FloatingLocationButton;
