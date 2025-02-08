import React, { useState, useRef } from 'react';
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
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './Styles';
const { width, height } = Dimensions.get('window');

export default function ForgetScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!email) {
        Alert.alert('Error', 'Please enter your email');
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (otp.some(digit => digit === '')) {
        Alert.alert('Error', 'Please enter the complete OTP');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all password fields');
        return;
      }
      if (newPassword.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      Alert.alert(
        'Success',
        'Password reset successful',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginScreen')
          }
        ]
      );
    }
  };

  const handleResendOTP = () => {
    Alert.alert('Success', 'New OTP has been sent to your email');
  };

  return (
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
              onPress={() => navigation.navigate('Login')}
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
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Step {step} of 3</Text>

              {step === 1 && (
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={24} color="#b8658f" />
                  <TextInput
                    placeholder="Enter your email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}

              {step === 2 && (
                <>
                  <Text style={styles.otpMessage}>
                    Enter the 4-digit code sent to your email
                  </Text>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <View key={index} style={styles.otpInputContainer}>
                        <TextInput
                          ref={otpRefs[index]}
                          style={styles.otpInput}
                          maxLength={1}
                          value={digit}
                          onChangeText={(value) => handleOtpChange(value, index)}
                          onKeyPress={(e) => handleOtpKeyPress(e, index)}
                          keyboardType="number-pad"
                          autoFocus={index === 0}
                        />
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity 
                    style={styles.resendContainer}
                    onPress={handleResendOTP}
                  >
                    <Text style={styles.resendText}>
                      Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={24} color="#b8658f" />
                    <TextInput
                      placeholder="New Password"
                      style={styles.input}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                      <MaterialIcons 
                        name={passwordVisible ? "visibility-off" : "visibility"} 
                        size={24} 
                        color="#b8658f" 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={24} color="#b8658f" />
                    <TextInput
                      placeholder="Confirm New Password"
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!confirmPasswordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                      <MaterialIcons 
                        name={confirmPasswordVisible ? "visibility-off" : "visibility"} 
                        size={24} 
                        color="#b8658f" 
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <TouchableOpacity onPress={handleNextStep}>
                <LinearGradient
                  colors={['#b8658f', '#893571']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>
                    {step === 3 ? 'Reset Password' : 'Continue'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>
                  Remember your password?{' '}
                  <Text 
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                  >
                    Login
                  </Text>
                </Text>
              </View>
            </Card>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

