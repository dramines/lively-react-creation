import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../common/design';
import Header from '../Commons/Header';
import ImpaContainer from './Components/ImpaContainer';
import QuickActions from './Components/QuickActions';
import UrgentNeedsAndCampaigns from './Components/UrgentNeedsAndCampaigns';
import LatestArticles from './Components/LatestArticles';
import FooterNavigator from '../FooterNavigator/FooterNavigator';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAnim] = useState(new Animated.Value(0));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Start refresh animation
    Animated.sequence([
      Animated.timing(refreshAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(refreshAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate refresh delay and fetch new data
    try {
      await Promise.all([
        // Add your data fetching promises here
        new Promise(resolve => setTimeout(resolve, 1500)), // Minimum delay for smooth animation
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const animatedStyle = {
    transform: [{
      scale: refreshAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.97],
      }),
    }],
    opacity: refreshAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.secondary]} // Android
            tintColor={Colors.secondary} // iOS
            title="Pull to refresh..." // iOS
            titleColor={Colors.secondary} // iOS
            progressViewOffset={20} // Adjust this value to make refresh control more accessible
          />
        }
      >
        <Animated.View style={animatedStyle}>
          <ImpaContainer />
          <QuickActions />
          <LatestArticles />
          <UrgentNeedsAndCampaigns />
        </Animated.View>
      </ScrollView>
      <FooterNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
});