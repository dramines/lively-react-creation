import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Commons/Header';
import Cards4 from './Components/Cards4';
import { useTranslation } from 'react-i18next';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import { Colors } from '../../common/design';

export default function CommunityScreen() {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.communityHeader}>
            <LinearGradient 
              colors={['#893571', '#b8658f']} 
              style={styles.communityBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.bannerText}>{t('CommunityScreen.WelcomeToTheCommunity')}</Text>
              <Text style={styles.bannerSubText}>{t('CommunityScreen.SupportLocalShareAndConnect')}</Text>
            </LinearGradient>
          </View>
          
          <Cards4 />
        </ScrollView>
      </View>
      <FooterNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  communityHeader: {
    marginTop: 16,
    marginBottom: 24,
  },
  communityBanner: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  bannerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  bannerSubText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});