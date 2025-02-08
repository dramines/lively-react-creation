import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../common/design';

const { width } = Dimensions.get('window');

const ConfirmButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.confirmButton} onPress={onPress}>
      <Text style={styles.confirmButtonText}>{text}</Text>
      <Icon name="arrow-forward-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: width > 375 ? 18 : 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default ConfirmButton;