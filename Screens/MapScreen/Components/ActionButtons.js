import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ActionButtons({ onPlusPress, onFilterPress }) {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.fab} onPress={onPlusPress}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterFab} onPress={onFilterPress}>
        <MaterialCommunityIcons name="filter" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    position: 'absolute',
    bottom: '10%',
    right: '5%',
    zIndex: 1,
  },
  fab: {
    backgroundColor: '#893571',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  filterFab: {
    backgroundColor: '#893571',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
