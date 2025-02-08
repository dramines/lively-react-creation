import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const notifications = [
  {
    id: '1',
    message: 'Meal ordered successfully.',
    description: 'Your order #12345 has been confirmed',
    icon: 'fastfood',
    color: '#2ECC71',
    time: '10 mins ago',
  },
  {
    id: '2',
    message: 'Meal canceled.',
    description: 'Order #12344 has been canceled',
    icon: 'cancel',
    color: '#FF5733',
    time: '20 mins ago',
  },
  {
    id: '3',
    message: 'Product approved!',
    description: 'Your listing has been verified and published',
    icon: 'check-circle',
    color: '#2ECC71',
    time: '1 hour ago',
  },
  {
    id: '4',
    message: 'Order is out for delivery.',
    description: 'Your order #12343 is on the way',
    icon: 'local-shipping',
    color: '#FF8C00',
    time: '2 hours ago',
  },
];

const DonateScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDE7F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#893571',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
});

export default DonateScreen;
