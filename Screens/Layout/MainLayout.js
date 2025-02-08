
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Commons/Header';
import FooterNavigator from '../FooterNavigator/FooterNavigator';

const MainLayout = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        {children}
      </View>
      <FooterNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
});

export default MainLayout;
