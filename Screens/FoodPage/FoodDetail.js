import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Text,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import ImageCarousel from './components/ImageCarousel';
import FoodContent from './components/FoodContent';
import { fetchFoodDetails } from './services/foodService';

const FoodDetail = ({ navigation, route }) => {
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { foodId } = route.params;

  const scrollX = useRef(new Animated.Value(0)).current; // ✅ Fixed: Initialize Animated.Value

  useEffect(() => {
    const abortController = new AbortController();

    const loadFoodDetails = async () => {
      try {
        const data = await fetchFoodDetails(foodId, abortController.signal);
        setFoodData(data);
        setLoading(false);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadFoodDetails();

    return () => {
      abortController.abort();
    };
  }, [foodId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#893571" />
        <Text style={styles.loadingText}>Loading food details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color="#ff4444" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!foodData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="information-circle-outline" size={48} color="#893571" />
        <Text style={styles.errorText}>No food information available</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRequestFood = () => {
    navigation.navigate('OrderFood', { foodData });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageCarousel images={foodData.images} scrollX={scrollX} /> {/* ✅ Fixed: Pass scrollX */}

      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <FoodContent foodData={foodData} onRequestFood={handleRequestFood} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#893571',
    borderRadius: 25,
    elevation: 3,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 25,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
});

export default FoodDetail;
