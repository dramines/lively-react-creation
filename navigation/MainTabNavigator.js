// MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import MapScreen from '../Screens/MapScreen/MapScreen';
import SettingsScreen from '../Screens/SettingsScreen/SettingsScreen';
import CommunityScreen from '../Screens/CommunityScreen/CommunityScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }} // Hide header for the tab screens
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="MapScreen" component={MapScreen} />
      <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
      <Tab.Screen name="CommunityScreen" component={CommunityScreen} />
    </Tab.Navigator>
  );
}
