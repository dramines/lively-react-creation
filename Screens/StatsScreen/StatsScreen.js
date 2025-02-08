
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import DonationStats from './Components/DonationStats';
import ImpactMetrics from './Components/ImpactMetrics';
import TopDonors from './Components/TopDonors';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatsScreen() {
  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.contentContainer} 
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#ffffff', '#fef6fa']} style={styles.gradient}>
        <ImpactMetrics />
        <DonationStats />
        <TopDonors />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  gradient: {
    padding: 16,
    minHeight: '100%',
  },
});
