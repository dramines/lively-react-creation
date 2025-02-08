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
    color: '#4A7B60',
    time: '10 mins ago',
  },
  {
    id: '2',
    message: 'Meal canceled.',
    description: 'Order #12344 has been canceled',
    icon: 'cancel',
    color: '#C15C5C',
    time: '20 mins ago',
  },
  {
    id: '3',
    message: 'Product approved!',
    description: 'Your listing has been verified',
    icon: 'check-circle',
    color: '#4A7B60',
    time: '1 hour ago',
  },
  {
    id: '4',
    message: 'Order is out for delivery.',
    description: 'Your order #12343 is on the way',
    icon: 'local-shipping',
    color: '#B87D3B',
    time: '2 hours ago',
  },
];

const NotificationScreen = ({ navigation }) => {
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

      <View style={styles.notificationSummary}>
        <Text style={styles.summaryText}>
          You have {notifications.length} notifications
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={styles.notificationCard}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${notification.color}15` }]}>
              <MaterialIcons
                name={notification.icon}
                size={24}
                color={notification.color}
                style={styles.notificationIcon}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.messageText}>{notification.message}</Text>
              <Text style={styles.descriptionText}>{notification.description}</Text>
              <Text style={styles.timeText}>{notification.time}</Text>
            </View>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color="#8E9196"
              style={styles.chevronIcon} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#893571',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationSummary: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  summaryText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1F2C',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#8E9196',
    fontWeight: '500',
  },
  chevronIcon: {
    marginLeft: 8,
  },
});

export default NotificationScreen;