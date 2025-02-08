import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './Style';
import { useUser } from '@clerk/clerk-expo'; // Import useUser hook from Clerk
import SuccessModal from '../../common/SuccessModal';

const { width, height } = Dimensions.get('window');

export default function SignUpGmail({ navigation }) {
  const { user, isLoaded } = useUser(); // Fetch user data using useUser hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for password confirmation
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userData, setUserData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  // Ensure user data is loaded before displaying the page
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setUserData(user); // Set user data once it's loaded
      setEmail(user.emailAddresses[0]?.emailAddress); // Set email from Clerk user
      setName(`${user.firstName} ${user.lastName}`); 
    }
  }, [isLoaded, user]);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !phone || !name) {
      alert('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.81:5002/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_user: user.emailAddresses[0]?.emailAddress,
          firstname_user: user.firstName,
          lastname_user: user.lastName,
          name_user: user.firstName+" "+user.lastName,
          password_user: password,
          country_user: "Canada",
          image_user: user.imageUrl,
          auth_method_user: 'google',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalVisible(true); 
        navigation.navigate('HomeScreen');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
    <ImageBackground
      source={require('../../assets/bgcover.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={styles.container}>
            <TouchableOpacity
              style={styles.goBackIcon}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Card style={styles.card}>
              <Text style={styles.title}>Create Account 👋</Text>
              <Text style={styles.subtitle}>
                Hi {userData.firstName}, let’s get your account set up!
              </Text>

              <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={24} color="#888" />
                <TextInput
                  placeholder="Enter your name"
                  style={[styles.input, styles.disabledInput]}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={false} // Make it disabled
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="#888" />
                <TextInput
                  placeholder="Enter your email"
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={false} // Make it disabled
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="phone" size={24} color="#b8658f" />
                <TextInput
                  placeholder="Enter your phone number"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#b8658f" />
                <TextInput
                  placeholder="Create password"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <MaterialIcons
                    name={passwordVisible ? 'visibility' : 'visibility-off'}
                    size={24}
                    color="#888"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#b8658f" />
                <TextInput
                  placeholder="Confirm password"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity onPress={handleSignup}>
                <LinearGradient
                  colors={['#9d4d06', '#ee9424']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Card>

            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                Already have an account?{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  Login
                </Text>
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
    <SuccessModal
  isVisible={isModalVisible}
  onClose={() => {
    setIsModalVisible(false);
    navigation.navigate('Login');
  }}
  message="Thank you for joining our community!"
/>
    </>
  );
}
