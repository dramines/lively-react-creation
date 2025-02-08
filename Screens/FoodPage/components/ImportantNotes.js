import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const ImportantNotes = () => {
  return (
    <View style={styles.notesSection}>
      <Text style={styles.sectionTitle}>Important Notes</Text>
      <View style={styles.noteCard}>
        <Icon name="information-circle-outline" size={24} color={Colors.secondary} />
        <Text style={styles.noteText}>
          Please ensure you can collect the food at the specified location and time.
          The food quality is the responsibility of the donor.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  noteCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteText: {
    marginLeft: 12,
    color: Colors.textSecondary,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ImportantNotes;