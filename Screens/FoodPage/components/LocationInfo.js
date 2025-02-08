import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const LocationInfo = ({ location }) => {
  console.log('Rendering LocationInfo with location:', location);
  
  return (
    <View style={styles.container}>
      <View style={styles.locationSection}>
        <View style={styles.headerRow}>
          <Icon name="location-outline" size={24} color={Colors.secondary} />
          <Text style={styles.locationTitle}>Pickup Location</Text>
        </View>
        
        <View style={styles.locationInfo}>
          <Text style={styles.locationAddress}>{location.address}</Text>
          <Text style={styles.locationDetails}>
            {location.postalCode}, {location.country}
          </Text>
          
          <View style={styles.timeContainer}>
            <Icon name="time-outline" size={16} color={Colors.secondary} />
            <Text style={styles.locationTime}>
              Available: {location.time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    marginLeft: 32,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  locationAddress: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  locationDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationTime: {
    fontSize: 14,
    color: Colors.secondary,
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default LocationInfo;