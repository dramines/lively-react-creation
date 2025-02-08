
import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useClerk } from '@clerk/clerk-react';
import styles from './Style';

const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  useWarmUpBrowser();
  const { signOut } = useClerk();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const signOutUser = async () => {
      await signOut();
    };
    signOutUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.81:5002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_user: email, password_user: password }),
      });

      const result = await response.json();

      if (response.ok) {
        const userData = {
          id_user: result.user.id_user,
          email_user: result.user.email_user,
          firstname_user: result.user.firstname_user,
          lastname_user: result.user.lastname_user,
          name_user: result.user.name_user,
          image_user: result.user.image_user,
          auth_method_user: result.user.auth_method_user,
          country_user: result.user.country_user,
          created_at_user: result.user.created_at_user,
        };

        await AsyncStorage.setItem('userDataNorma', JSON.stringify(userData));
        setMethod('normal');
        navigation.replace('ScreenHome');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Failed to login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        setMethod('gmail');
        navigation.replace('ScreenHome');
      }
    } catch (err) {
      console.error('OAuth Error:', err);
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
    }
  }, [startOAuthFlow, navigation]);

  return (
    <SafeAreaView style={styles.background}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>

          <Text style={styles.title}>{t('LoginScreen.welcome_back')}</Text>
          <Text style={styles.subtitle}>{t('LoginScreen.login_to_continue')}</Text>

          <View style={styles.loginTabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
              onPress={() => navigation.navigate('SignupScreen')}
            >
              <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={24} color="#000000" />
            <Text style={styles.socialText}> Login with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
            <FontAwesome name="google" size={24} color="#893571" />
            <Text style={styles.socialText}> Login with Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or continue with email</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#b8658f" />
            <TextInput
              placeholder={t('LoginScreen.enter_email')}
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#b8658f" />
            <TextInput
              placeholder={t('LoginScreen.enter_password')}
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#b8658f" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgetScreen')}>
            <Text style={styles.forgotPassword}>
              {t('LoginScreen.forgot_password')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? t('LoginScreen.logging_in') : t('LoginScreen.login')}
            </Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
