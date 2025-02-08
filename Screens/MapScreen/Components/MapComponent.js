import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  Platform,
  Animated 
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { mapCustomStyle } from '../mapStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../common/design';

const MapComponent = ({ onRegionChange }) => {
  const [location, setLocation] = useState(null);
  const [foodLocations, setFoodLocations] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const mapRef = useRef(null);

  useEffect(() => {
    fetchFoodLocations();
  }, []);

  const fetchFoodLocations = async () => {
    try {
      const response = await fetch('http://192.168.1.81:5002/api/foods/foodlocations');
      const data = await response.json();
      console.log('Fetched food locations:', data);
      setFoodLocations(data);
    } catch (error) {
      console.error('Error fetching food locations:', error);
    }
  };

  const handleMarkerPress = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const handleViewDetails = () => {
    if (selectedFood) {
      navigation.navigate('FoodDetail', { foodId: selectedFood.id_food });
      setModalVisible(false);
    }
  };

  const animateToRegion = (region) => {
    mapRef.current?.animateToRegion(region, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapCustomStyle}
        initialRegion={{
          latitude: 45.5017,
          longitude: -73.5673,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        onRegionChange={onRegionChange}
      >
        {foodLocations.map((food) => (
          <Marker
            key={food.id_food}
            coordinate={{
              latitude: parseFloat(food.availability?.altitude_availability) || 0,
              longitude: parseFloat(food.availability?.longitude_availability) || 0,
            }}
            onPress={() => handleMarkerPress(food)}
          >
            <Icon name="fast-food" size={24} color={Colors.secondary} />
          </Marker>
        ))}
      </MapView>

      <Modal
        animationType="slide"
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
            >
              <Icon name="close-circle" size={28} color={Colors.secondary} />
            </TouchableOpacity>

            {selectedFood && (
              <View style={styles.foodContent}>
                <Image
                  source={{ uri: `http://192.168.1.81:5002/api/${selectedFood.first_image}` }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
                
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>{selectedFood.name_food}</Text>
                  <Text style={styles.description}>
                    {selectedFood.description_food}
                  </Text>

                  <TouchableOpacity 
                    style={styles.detailsButton} 
                    onPress={handleViewDetails}
                  >
                    <Text style={styles.buttonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
    maxHeight: '60%',
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
  foodContent: {
    width: '100%',
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  detailsButton: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapComponent;