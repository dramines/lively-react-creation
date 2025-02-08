import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import * as RootNavigation from '../RootNavigation';

export default function ScreenHome() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [dotCount, setDotCount] = useState(1);

  // Animate the "..." in "Authenticating..."
  useEffect(() => {
    const dotAnimation = setInterval(() => {
      setDotCount(prevCount => (prevCount % 3) + 1); // Cycle through 1 to 3 dots
    }, 500);

    return () => clearInterval(dotAnimation); // Clean up on unmount
  }, []);

  useEffect(() => {
    const checkEmailExists = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        const response = await fetch('http://192.168.1.81:5002/api/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email_user: user.primaryEmailAddress.emailAddress 
          }),
        });

        const result = await response.json();
        console.log(result);
        console.log(user.primaryEmailAddress.emailAddress);
        
        // Check if result.exists is true and then navigate
        setTimeout(() => {
          if (RootNavigation.navigationRef.isReady()) {
            if (result.exists) {
              RootNavigation.navigate('HomeScreen'); // Navigate to HomeScreen if email exists
            } else {
              RootNavigation.navigate('SignUpGmail'); // Navigate to SignUpGmail if email does not exist
            }
          }
          setIsLoading(false);
        }, 2000);

      } catch (error) {
        console.error('Error checking email:', error);
        setIsLoading(false);
      }
    };

    checkEmailExists();
  }, [user]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" animating={isLoading} />
          <Text style={styles.authText}>
            Authenticating{'.'.repeat(dotCount)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#893571', // Set background to orange
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  authText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
});
