import React from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { Divider } from 'react-native-paper';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import Header from '../Commons/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserInfo from './UserInfo';
import LanguageSelector from './LanguageSelect';
import FAQSection from './Faq';
import Logout from './Logout';
import DeleteAccount from './DeleteAccount';

export default function SettingsScreen() {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingsSection}>
          <UserInfo />
          <Divider style={styles.divider} />
          <LanguageSelector />
          <FAQSection />
          <Divider style={styles.divider} />
          <Logout />
          <DeleteAccount />
        </View>
      </ScrollView>
      <FooterNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  scrollContainer: {
    paddingBottom: 150, // Add extra padding at bottom for better scrolling experience
    paddingHorizontal: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingsSection: {
    marginTop: 20,
  },
 
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
 
});

