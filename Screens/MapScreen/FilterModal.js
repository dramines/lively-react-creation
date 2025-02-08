// FilterModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FilterModal({ isVisible, showZones, showPins, setShowZones, setShowPins, onClose }) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterOptions}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filter Options</Text>

          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Show Zones</Text>
            <Switch value={showZones} onValueChange={setShowZones} color="#893571" />
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Show Pins</Text>
            <Switch value={showPins} onValueChange={setShowPins} color="#893571" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterOptions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#893571',
    padding: 8,
    borderRadius: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
});
