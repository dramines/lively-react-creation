import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const FoodMarkerModal = ({ isVisible, onClose, foodData }) => {
  const navigation = useNavigation();

  if (!foodData) return null;

  const handleViewDetails = () => {
    navigation.navigate('FoodDetail', { foodId: foodData.id_food });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close-circle" size={32} color="#893571" />
          </TouchableOpacity>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {foodData.images?.length > 0 && (
              <Image
                source={{ uri: `http://192.168.1.81:5002/api/${foodData.images[0]}` }}
                style={styles.foodImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.infoContainer}>
              <Text style={styles.title}>{foodData.name_food}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {foodData.description_food}
              </Text>

              <View style={styles.detailsRow}>
                <Icon name="location-outline" size={20} color="#893571" />
                <Text style={styles.detailText}>
                  {foodData.availability?.adresse_availability || 'No address available'}
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <Icon name="time-outline" size={20} color="#893571" />
                <Text style={styles.detailText}>
                  {foodData.availability?.time_availability || 'No time available'}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: Dimensions.get('window').height * 0.8,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodMarkerModal;