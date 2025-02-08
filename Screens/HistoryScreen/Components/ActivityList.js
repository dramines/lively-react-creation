import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
export default function ActivityList() {
  const { t } = useTranslation();
  
  const activities = [
    {
      id: '1',
      type: 'donation',
      title: 'Donated Fresh Vegetables',
      timestamp: '2 hours ago',
      icon: 'food-apple',
      description: 'You donated 2kg of fresh vegetables'
    },
    {
      id: '2',
      type: 'share',
      title: 'Shared Homemade Meal',
      timestamp: 'Yesterday',
      icon: 'share',
      description: 'You shared a homemade meal with the community'
    },
    {
      id: '3',
      type: 'impact',
      title: 'Made an Impact',
      timestamp: '3 days ago',
      icon: 'heart',
      description: 'Your donation helped 5 people'
    }
  ];

  const renderActivity = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={item.icon} size={24} color="#893571" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('HistoryScreen.RecentActivity')}</Text>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
});