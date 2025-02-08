
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClerk } from '@clerk/clerk-expo';
import LoginScreen from '../Screens/LoginScreen/LoginScreen';
import SignupScreen from '../Screens/SignupScreen/SignupScreen';
import ForgetScreen from '../Screens/ForgetScreen/ForgetScreen';
import StartScreen from '../Screens/StartScreen/StartScreen';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import SignUpGmail from '../Screens/ContinueSignupScreen/SignUpGmail';
import ScreenHome from '../Screens/ScreenHome';
import SettingsScreen from '../Screens/SettingsScreen/SettingsScreen';
import MapScreen from '../Screens/MapScreen/MapScreen';
import CommunityScreen from '../Screens/CommunityScreen/CommunityScreen';
import NotificationScreen from '../Screens/NotificationScreen/NotificationScreen';
import DonateScreen from '../Screens/DonateFood/DonateScreen';
import NgoFindScreen from '../Screens/FindNgoScreen/NgoFindScreen';
import FoodDetail from '../Screens/FoodPage/FoodDetail';
import NGODetail from '../Screens/NgoPage/NGODetail';
import StoreSceen from '../Screens/Store/StoreScreen';
import AdressPickerScreen from '../Screens/AdressPickerScreen/AdressPickerScreen';
import OrderFood from '../Screens/FoodPage/OrderFood';
import StatsScreen from '../Screens/StatsScreen/StatsScreen';
import HistoryScreen from '../Screens/HistoryScreen/HistoryScreen';
import RewardScreen from '../Screens/RewardScreen/RewardScreen';
import MainLayout from '../Screens/Layout/MainLayout';

const Stack = createStackNavigator();

const ScreenWithLayout = ({ children }) => (
  <MainLayout>{children}</MainLayout>
);

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
    >
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetScreen"
        component={ForgetScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithLayout>
            <HomeScreen />
          </ScreenWithLayout>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="MapScreen"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithLayout>
            <MapScreen />
          </ScreenWithLayout>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="SettingsScreen"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithLayout>
            <SettingsScreen />
          </ScreenWithLayout>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="CommunityScreen"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithLayout>
            <CommunityScreen />
          </ScreenWithLayout>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ScreenHome"
        component={ScreenHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpGmail"
        component={SignUpGmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DonateScreen"
        component={DonateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NgoFindScreen"
        component={NgoFindScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodDetail"
        component={FoodDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NGODetail"
        component={NGODetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreScreen"
        component={StoreSceen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdressPickerScreen"
        component={AdressPickerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderFood"
        component={OrderFood}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StatsScreen"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithLayout>
            <StatsScreen />
          </ScreenWithLayout>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RewardScreen"
        component={RewardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
