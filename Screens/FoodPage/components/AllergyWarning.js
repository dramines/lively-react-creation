import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AllergyWarning = ({ allergens }) => {
  if (!allergens || allergens.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="warning-outline" size={24} color="#DC2626" />
        <Text style={styles.title}>Allergy Information</Text>
      </View>
      <Text style={styles.warningText}>
        This food may contain or have been in contact with:
      </Text>
      <View style={styles.allergensList}>
        {allergens.map((allergen, index) => (
          <Text key={index} style={styles.allergenItem}>
            • {allergen}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#7F1D1D',
    marginBottom: 8,
  },
  allergensList: {
    paddingLeft: 8,
  },
  allergenItem: {
    fontSize: 14,
    color: '#991B1B',
    marginVertical: 2,
  },
});

export default AllergyWarning;