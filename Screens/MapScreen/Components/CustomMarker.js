import React, { useState } from 'react';
import { Marker } from 'react-native-maps';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CustomMarker = ({ food }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleMarkerPress = () => {
    console.log('Marker pressed for food:', food.name_food);
    setModalVisible(true);
  };

  const handleViewDetails = () => {
    navigation.navigate('FoodDetail', { foodId: food.id_food });
    setModalVisible(false);
  };

  return (
    <>
      <Marker
        coordinate={{
          latitude: parseFloat(food.availability?.altitude_availability?.replace(/\"/g, '')) || 0,
          longitude: parseFloat(food.availability?.longitude_availability?.replace(/\"/g, '')) || 0,
        }}
        onPress={handleMarkerPress}
      >
        <View style={styles.markerContainer}>
          <View style={styles.markerOuter}>
            <Icon name="fast-food" size={20} color="#893571" />
          </View>
          <View style={styles.markerTriangle} />
        </View>
      </Marker>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close-circle" size={32} color="#893571" />
            </TouchableOpacity>

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {food.images?.length > 0 && (
                <Image
                  source={{ uri: `http://192.168.1.81:5002/api/${food.images[0]}` }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.infoContainer}>
                <Text style={styles.title}>{food.name_food}</Text>
                <Text style={styles.description} numberOfLines={3}>
                  {food.description_food}
                </Text>

                <View style={styles.detailsRow}>
                  <Icon name="location-outline" size={20} color="#893571" />
                  <Text style={styles.detailText}>
                    {food.availability?.adresse_availability || 'No address available'}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Icon name="time-outline" size={20} color="#893571" />
                  <Text style={styles.detailText}>
                    {food.availability?.time_availability || 'No time available'}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={handleViewDetails}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerOuter: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    transform: [{ translateY: -5 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    minHeight: '50%',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#893571',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  detailsButton: {
    backgroundColor: '#893571',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomMarker;