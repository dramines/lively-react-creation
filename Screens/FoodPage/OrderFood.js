import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import OrderConfirmationAnimation from './components/OrderConfirmationAnimation';

const OrderFood = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { foodData } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const maxQuantity = parseInt(foodData.actualquantity_food) || 1;

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleConfirmRequest = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {showAnimation && (
        <OrderConfirmationAnimation onComplete={handleAnimationComplete} />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#893571" />
      </TouchableOpacity>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('OrderDetails.title')}</Text>
        
        <View style={styles.foodInfoCard}>
          <Text style={styles.foodName}>{foodData.title}</Text>
          <Text style={styles.description}>{foodData.description}</Text>
          
          <View style={styles.detailRow}>
            <Icon name="time-outline" size={20} color="#893571" />
            <Text style={styles.detailText}>{t('OrderDetails.available_until')}: {foodData.expiryDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="location-outline" size={20} color="#893571" />
            <Text style={styles.detailText}>
              {foodData.location?.address}, {foodData.location?.postalCode}
            </Text>
          </View>
        </View>

        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>{t('OrderDetails.select_quantity')}</Text>
          <Text style={styles.availableText}>
            {t('OrderDetails.available')}: {foodData.actualquantity_food} {foodData.quantitytype_food}
          </Text>
          
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
              onPress={handleDecrement}
              disabled={quantity <= 1}
            >
              <Icon name="remove" size={24} color={quantity <= 1 ? "#ccc" : "#893571"} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
              style={[styles.quantityButton, quantity >= maxQuantity && styles.disabledButton]}
              onPress={handleIncrement}
              disabled={quantity >= maxQuantity}
            >
              <Icon name="add" size={24} color={quantity >= maxQuantity ? "#ccc" : "#893571"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>{t('OrderDetails.important_notes')}</Text>
          <View style={styles.noteCard}>
            <Icon name="information-circle-outline" size={24} color="#893571" />
            <Text style={styles.noteText}>
              {t('OrderDetails.pickup_note')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmRequest}
        >
          <Text style={styles.confirmButtonText}>{t('OrderDetails.confirm_request')}</Text>
          <Icon name="arrow-forward-outline" size={24} color="#fff" />
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
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop: StatusBar.currentHeight + 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  foodInfoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  quantitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  availableText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 16,
  },
  quantityButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    elevation: 0,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  notesSection: {
    marginBottom: 20,
  },
  noteCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteText: {
    marginLeft: 12,
    color: '#666',
    flex: 1,
    fontSize: 14,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#893571',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OrderFood;
