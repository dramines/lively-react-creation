
import React, { useState, useCallback } from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOAuth, useUser } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessModal from '../../common/SuccessModal';
import { useTranslation } from 'react-i18next';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import { styles } from './styles/SignupStyles';
import { signupUser } from './services/signupService';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { user } = useUser();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [country, setCountry] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!firstname || !lastname || !email) {
        alert('Please fill in all fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!country) {
        alert('Please select a country');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !firstname || !lastname || !country) {
      alert('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await signupUser({
        email,
        firstname,
        lastname,
        password,
        country,
      });
      setIsModalVisible(true);
    } catch (error) {
      alert(error.message || 'An error occurred. Please try again later.');
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
            lastSignInAt: user.lastSignInAt,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          navigation.replace('ScreenHome');
        }
      }
    } catch (err) {
      console.error('OAuth Error:', err);
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
    }
  }, [startOAuthFlow, navigation, user]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            firstname={firstname}
            setFirstname={setFirstname}
            lastname={lastname}
            setLastname={setLastname}
            email={email}
            setEmail={setEmail}
          />
        );
      case 2:
        return (
          <Step2
            country={country}
            setCountry={setCountry}
          />
        );
      case 3:
        return (
          <Step3
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
            isConfirmPasswordVisible={isConfirmPasswordVisible}
            setIsConfirmPasswordVisible={setIsConfirmPasswordVisible}
          />
        );
      default:
        return null;
    }
  };

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
                onPress={handleBack}
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
                <Text style={styles.title}>{t('SignupScreen.create_account')}</Text>
                <Text style={styles.subtitle}>
                  {t('SignupScreen.sign_up_start')} (Step {currentStep} of 3)
                </Text>

                {renderStep()}

                {currentStep < 3 ? (
                  <TouchableOpacity onPress={handleNext}>
                    <LinearGradient
                      colors={['#b8658f', '#893571']}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>Next</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleSignup}>
                    <LinearGradient
                      colors={['#b8658f', '#893571']}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>{t('SignupScreen.sign_up_button')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {currentStep === 1 && (
                  <>
                    <View style={styles.orContainer}>
                      <Text style={styles.orText}>{t('SignupScreen.or')}</Text>
                    </View>

                    <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
                      <FontAwesome name="google" size={24} color="#893571" />
                      <Text style={styles.googleText}>{t('SignupScreen.sign_in_google')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Card>

              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>
                  {t('SignupScreen.already_account')}{' '}
                  <Text
                    style={styles.signupLink}
                    onPress={() => navigation.goBack()}
                  >
                    {t('SignupScreen.login')}
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
