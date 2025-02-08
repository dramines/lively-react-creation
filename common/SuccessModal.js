import React from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this installed
import ConfettiCannon from 'react-native-confetti-cannon'; // Install this for confetti effect

const SuccessModal = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
    >
      <View style={styles.overlay}>
        <ConfettiCannon count={50} origin={{ x: 150, y: 0 }} fadeOut={true} />
        <View style={styles.modalContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#FF6F00" />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  message: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessModal;
