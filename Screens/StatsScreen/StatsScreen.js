import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Header from '../Commons/Header';
import DonationStats from './Components/DonationStats';
import ImpactMetrics from './Components/ImpactMetrics';
import TopDonors from './Components/TopDonors';
import { LinearGradient } from 'expo-linear-gradient';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
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
      <FooterNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Ensures enough space for the last item
  },
  gradient: {
    padding: 16,
    minHeight: '100%',
  },
});
