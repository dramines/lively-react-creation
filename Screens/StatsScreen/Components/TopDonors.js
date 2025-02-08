import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function TopDonors() {
  const donors = [
    { id: 1, name: 'Ashley J.', location: 'Miami, FL', donations: 28 },
    { id: 2, name: 'John W.', location: 'Los Angeles, CA', donations: 18 },
    { id: 3, name: 'Jack T.', location: 'San Francisco, CA', donations: 15 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Food Heroes</Text>
      <View style={styles.donorsContainer}>
        {donors.map((donor) => (
          <View key={donor.id} style={styles.donorCard}>
            <View style={styles.donorInfo}>
              <View style={styles.donorAvatar}>
                <Text style={styles.avatarText}>
                  {donor.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.donorDetails}>
                <Text style={styles.donorName}>{donor.name}</Text>
                <Text style={styles.donorLocation}>{donor.location}</Text>
              </View>
            </View>
            <View style={styles.donationCount}>
              <Text style={styles.donationNumber}>{donor.donations}</Text>
              <Text style={styles.donationLabel}>donations</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  donorsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  donorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#893571',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  donorDetails: {
    marginLeft: 12,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  donorLocation: {
    fontSize: 14,
    color: '#666',
  },
  donationCount: {
    alignItems: 'center',
  },
  donationNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#893571',
  },
  donationLabel: {
    fontSize: 12,
    color: '#666',
  },
});