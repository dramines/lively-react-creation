import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import styles from './Style';
import {  FontAwesome } from '@expo/vector-icons';
import { useClerk } from '@clerk/clerk-react';

const { width } = Dimensions.get('window');

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
    <ImageBackground 
      source={require('../../assets/bgcover.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
        style={styles.gradientOverlay}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
              </View>

              <Card style={styles.card}>
                <Text style={styles.title}>{t('LoginScreen.welcome_back')}</Text>
                <Text style={styles.subtitle}>{t('LoginScreen.login_to_continue')}</Text>

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

                <TouchableOpacity 
                  onPress={() => navigation.navigate('ForgetScreen')}
                  style={styles.forgotPasswordContainer}
                >
                  <Text style={styles.forgotPassword}>
                    {t('LoginScreen.forgot_password')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleLogin} 
                  disabled={loading}
                  style={styles.loginButton}
                >
                  <LinearGradient
                    colors={['#b8658f', '#893571']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? t('LoginScreen.logging_in') : t('LoginScreen.login')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.orText}>{t('LoginScreen.or')}</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity 
                  style={styles.googleButton} 
                  onPress={onGooglePress}
                >
                <FontAwesome name="google" size={24} color="#893571" />
                  <Text style={styles.googleText}>
                     {t('LoginScreen.sign_in_google')}
                  </Text>
                </TouchableOpacity>
              </Card>

              <View style={styles.bottomContainer}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('SignupScreen')}
                  style={styles.signupContainer}
                >
                  <Text style={styles.bottomText}>
                    {t('LoginScreen.dont_have_account')}{' '}
                    <Text style={styles.signupLink}>
                      {t('LoginScreen.sign_up')}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default LoginScreen;