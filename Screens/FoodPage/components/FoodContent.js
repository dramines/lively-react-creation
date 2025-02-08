import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FoodHeader from './FoodHeader';
import QuickInfo from './QuickInfo';
import LocationInfo from './LocationInfo';
import { Colors } from '../../../common/design';

const FoodContent = ({ foodData, onRequestFood }) => {
  return (
    <View style={styles.contentWrapper}>
      <FoodHeader 
        title={foodData.title}
        hallal={foodData.hallal}
        foodtype={foodData.foodtype}
        expiryDate={foodData.expiryDate}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="information-circle" size={24} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>About this food</Text>
        </View>
        <Text style={styles.description}>{foodData.description}</Text>
      </View>

      <QuickInfo 
        quantity={foodData.actualquantity_food}
        quantityType={foodData.quantitytype_food}
        allergens={foodData.allergens}
        isFrozen={foodData.isfrozen}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="document-text" size={24} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>Additional Notes</Text>
        </View>
        <Text style={styles.description}>{foodData.additionalnote}</Text>
      </View>

      <LocationInfo location={foodData.location} />

      <View style={styles.bottomContainer}>
      <TouchableOpacity 
  style={[
    styles.actionButton, 
    { opacity: foodData.status === 'Available' ? 1 : 0.6 }
  ]}
  disabled={foodData.status !== 'Available'}
  onPress={onRequestFood}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.actionButtonText}>
      {foodData.status === 'Available' ? 'Request Food' : 'Currently Reserved'}
    </Text>
    <Icon 
      name={foodData.status === 'Available' ? 'arrow-forward' : 'lock-closed'} 
      size={24} 
      color="#fff" 
      style={{ marginLeft: 8 }} 
    />
  </View>
</TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    fontFamily: 'System',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
    fontFamily: 'System',
  },
  bottomContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
    elevation: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'System',
  },
});

export default FoodContent;