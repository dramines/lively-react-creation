import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const FoodInfoCard = ({ foodData }) => {
  return (
    <View style={styles.foodInfoCard}>
      <View style={styles.trustBadge}>
        <Icon name="shield-checkmark" size={16} color={Colors.secondary} />
        <Text style={styles.trustBadgeText}>Verified Listing</Text>
      </View>

      <Text style={styles.foodName}>{foodData.title}</Text>
      <Text style={styles.description}>{foodData.description}</Text>
      
      <View style={styles.detailRow}>
        <Icon name="time-outline" size={20} color={Colors.secondary} />
        <Text style={styles.detailText}>
          Available until: {foodData.expiryDate}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <Icon name="location-outline" size={20} color={Colors.secondary} />
        <Text style={styles.detailText}>
          {foodData.location?.address}, {foodData.location?.postalCode}
        </Text>
      </View>

      {foodData.hygienneDeclaration === 1 && (
        <View style={styles.hygieneSection}>
          <Icon name="checkmark-circle" size={20} color="#059669" />
          <Text style={styles.hygieneText}>
            Prepared under hygienic conditions
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  foodInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  trustBadgeText: {
    marginLeft: 4,
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  foodName: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  hygieneSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  hygieneText: {
    marginLeft: 8,
    color: '#065F46',
    fontSize: 14,
    flex: 1,
  },
});

export default FoodInfoCard;