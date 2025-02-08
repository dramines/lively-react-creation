import React, { useCallback } from 'react';
import { TouchableOpacity, Text, Alert, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoogleLoginButton = ({ navigation, user }) => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // Function to check if email exists in the database
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch('http://192.168.1.81:5002/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_user: email }),
      });

      const result = await response.json();
      console.log('Response:', result);  // Log the entire response for debugging

      if (result.exists) {
        console.log('User found in database');
      } else {
        console.log('User does not exist');
      }
    } catch (err) {
      console.error('Error checking email:', err);
      Alert.alert('Error', 'Failed to check email existence');
    }
  };

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
        scopes: ['profile', 'email', 'openid'],
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });

        // Extract user data from Google response
        if (user) {
          const userData = {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.imageUrl,
            externalAccounts: user.externalAccounts,
            emailAddresses: user.emailAddresses,
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt
          };

          // Check if the email exists in the database
          await checkEmailExists(user.primaryEmailAddress?.emailAddress);

          // Store user data in AsyncStorage
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          navigation.replace('ScreenHome');
        } else {
          setTimeout(async () => {
            if (user) {
              const userData = {
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.imageUrl,
                externalAccounts: user.externalAccounts,
                emailAddresses: user.emailAddresses,
                createdAt: user.createdAt,
                lastSignInAt: user.lastSignInAt
              };

              // Check if the email exists in the database
              await checkEmailExists(user.primaryEmailAddress?.emailAddress);

              // Store user data in AsyncStorage
              await AsyncStorage.setItem('userData', JSON.stringify(userData));
              navigation.replace('ScreenHome');
            }
          }, 1000);
        }
      }
    } catch (err) {
      console.error('OAuth Error:', err);
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
    }
  }, [startOAuthFlow, navigation, user]);

  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onGooglePress}>
      <FontAwesome name="google" size={24} color="#DB4437" />
      <Text style={{ marginLeft: 8, color: '#DB4437', fontSize: 16 }}>Sign up with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleLoginButton;
