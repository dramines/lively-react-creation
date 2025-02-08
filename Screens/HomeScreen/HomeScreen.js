
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
  RefreshControl,
  Animated,
} from 'react-native';
import { Colors } from '../../common/design';
import ImpaContainer from './Components/ImpaContainer';
import QuickActions from './Components/QuickActions';
import UrgentNeedsAndCampaigns from './Components/UrgentNeedsAndCampaigns';
import LatestArticles from './Components/LatestArticles';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAnim] = useState(new Animated.Value(0));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
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

    try {
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 1500)),
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
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.secondary]}
          tintColor={Colors.secondary}
          title="Pull to refresh..."
          titleColor={Colors.secondary}
          progressViewOffset={20}
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
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
});
