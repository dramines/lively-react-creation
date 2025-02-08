import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const QuickInfo = ({ quantity, quantityType, allergens, isFrozen }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Icon name="restaurant" size={24} color={Colors.secondary} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.value}>{quantity} {quantityType}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon name="warning" size={24} color={Colors.secondary} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Allergens</Text>
          <Text style={styles.value}>{allergens.length > 0 ? allergens.join(', ') : 'None'}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon 
          name={isFrozen ? "snow" : "thermometer"} 
          size={24} 
          color={Colors.secondary} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Storage</Text>
          <Text style={styles.value}>{isFrozen}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'System',
  }
});

export default QuickInfo;