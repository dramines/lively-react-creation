import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const QuantitySelector = ({ quantity, maxQuantity, onIncrement, onDecrement }) => {
  return (
    <View style={styles.quantitySection}>
      <Text style={styles.sectionTitle}>Select Quantity</Text>
      <Text style={styles.availableText}>
        Available: {maxQuantity}
      </Text>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
          onPress={onDecrement}
          disabled={quantity <= 1}
        >
          <Icon 
            name="remove" 
            size={24} 
            color={quantity <= 1 ? "#ccc" : Colors.secondary} 
          />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{quantity}</Text>
        
        <TouchableOpacity 
          style={[styles.quantityButton, quantity >= maxQuantity && styles.disabledButton]}
          onPress={onIncrement}
          disabled={quantity >= maxQuantity}
        >
          <Icon 
            name="add" 
            size={24} 
            color={quantity >= maxQuantity ? "#ccc" : Colors.secondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quantitySection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  availableText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 16,
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
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    elevation: 0,
    shadowOpacity: 0,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 24,
    color: Colors.textPrimary,
  },
});

export default QuantitySelector;