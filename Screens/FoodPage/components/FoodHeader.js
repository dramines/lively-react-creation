import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const FoodHeader = ({ title, hallal, foodtype, expiryDate }) => {
  return (
    <View style={styles.headerSection}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {hallal === 'Halal' && (
          <View style={styles.halalBadge}>
            <Text style={styles.halalText}>
              {hallal} ✅
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Category: {foodtype}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Expires: {expiryDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  halalBadge: {
    backgroundColor: '#43A047',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  halalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default FoodHeader;