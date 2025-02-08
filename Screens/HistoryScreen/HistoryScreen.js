import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Header from '../Commons/Header';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import ActivityList from './Components/ActivityList';
import UserStats from './Components/UserStats';

export default function HistoryScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <LinearGradient colors={['#893571', '#b8658f']} style={styles.headerBanner}>
          <MaterialCommunityIcons name="history" size={32} color="#fff" />
          <Text style={styles.headerTitle}>{t('HistoryScreen.YourHistory')}</Text>
          <Text style={styles.headerSubtitle}>{t('HistoryScreen.TrackYourImpact')}</Text>
        </LinearGradient>
        <UserStats />
        <ActivityList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6',
  },
  scrollView: {
    flex: 1,
  },
  headerBanner: {
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
});