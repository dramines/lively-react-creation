
import React from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { Divider } from 'react-native-paper';
import UserInfo from './UserInfo';
import LanguageSelector from './LanguageSelect';
import FAQSection from './Faq';
import Logout from './Logout';
import DeleteAccount from './DeleteAccount';

export default function SettingsScreen() {
  const { width } = useWindowDimensions();

  return (
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
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 150,
    paddingHorizontal: 16,
  },
  settingsSection: {
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});
