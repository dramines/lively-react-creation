import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const NGODetail = ({ navigation }) => {
  const scrollX = new Animated.Value(0);
  const imageWidth = width;

  const ngoData = {
    images: [
      'https://www.jjei.com/wp-content/uploads/2020/03/food-bank-photo-basket.jpg',
      'https://www.jjei.com/wp-content/uploads/2020/03/food-bank-photo-basket.jpg', 
    ],
    name: 'Helping Hands NGO',
    description:
      'Helping Hands is dedicated to supporting the underprivileged through various community initiatives and social programs.',
    address: '123 Community Lane, Cityville, ST 12345',
    openHours: 'Mon - Fri: 9 AM - 5 PM',
    location: 'City Center, District B',
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageCarousel}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {ngoData.images.map((image, index) => (
            <ImageBackground
              key={index}
              source={{ uri: image }}
              style={styles.ngoImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
              />
            </ImageBackground>
          ))}
        </ScrollView>
        <View style={styles.indicatorContainer}>
          {ngoData.images.map((_, index) => {
            const widthStyle = scrollX.interpolate({
              inputRange: [
                (index - 1) * imageWidth,
                index * imageWidth,
                (index + 1) * imageWidth,
              ],
              outputRange: [8, 16, 8],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.indicator, { width: widthStyle }]}
              />
            );
          })}
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.name}>{ngoData.name}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{ngoData.description}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.infoContainer}>
            <Icon name="location-outline" size={20} color="#893571" />
            <Text style={styles.infoText}>{ngoData.address}</Text>
          </View>
        </View>

        {/* Open Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open Hours</Text>
          <View style={styles.infoContainer}>
            <Icon name="time-outline" size={20} color="#893571" />
            <Text style={styles.infoText}>{ngoData.openHours}</Text>
          </View>
        </View>
      </ScrollView>
      {/* Contact Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => alert('Contact the NGO!')}
        >
          <Icon name="call-outline" size={20} color="#fff" />
          <Text style={styles.contactText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageCarousel: {
    height: height * 0.4,
  },
  ngoImage: {
    width: width,
    height: height * 0.4,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
    elevation: 5,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#893571',
    textAlign: 'center',
  },
  section: {
    marginVertical: 15,
   
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  contactButton: {
    backgroundColor: '#893571',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    shadowColor: '#893571',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  contactText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});

export default NGODetail;
