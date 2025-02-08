import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const QuickActions = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const actions = [
    {
      icon: "food-apple",
      text: t('QuickActions.Donate'),
      route: 'DonateScreen',
    },
    {
      icon: "map-marker",
      text: t('QuickActions.FindNGOs'),
      route: 'NgoFindScreen',
    },
    {
      icon: "history",
      text: t('QuickActions.History'),
      route: 'HistoryScreen',
    },
  ];

  return (
    <View style={styles.quickActions}>
      {actions.map((action, index) => (
        <View key={index} style={styles.actionWrapper}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate(action.route)}
          >
            <MaterialCommunityIcons 
              name={action.icon} 
              size={28} 
              color="#893571" 
            />
            <Text style={styles.actionText}>{action.text}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
  actionButton: {
    height: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 15,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickActions;
