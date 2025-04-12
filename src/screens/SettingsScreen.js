
import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Platform,
  Animated,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { FooterNav } from '../components/FooterNav';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  Globe, 
  HelpCircle, 
  LogOut, 
  User,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Shield,
  Key,
  FileText
} from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import { useClerkIntegration } from '../utils/clerkAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES, STACKS } from '../navigation/navigationConstants';
import { CommonActions } from '@react-navigation/native';

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user, logout, loading, error, updateUserProfile, updatePassword } = useContext(AuthContext);
  const { logoutFromClerk } = useClerkIntegration();
  
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!firstName && !lastName && !email && !phone) {
      Alert.alert('Erreur', 'Veuillez remplir au moins un champ à mettre à jour.');
      return;
    }
    
    setUpdateLoading(true);
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    try {
      const success = await updateUserProfile(updateData);
      
      if (success) {
        Alert.alert('Succès', 'Profil mis à jour avec succès !');
        setProfileModalVisible(false);
      } else {
        Alert.alert('Erreur', 'Échec de la mise à jour du profil. Veuillez réessayer.');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setPasswordError(t('settings.enterCurrentPassword') || 'Veuillez saisir votre mot de passe actuel');
      return;
    }
    
    if (!newPassword) {
      setPasswordError(t('settings.enterNewPassword') || 'Veuillez saisir un nouveau mot de passe');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordMismatch') || 'Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError(t('settings.passwordTooShort') || 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setUpdateLoading(true);
    setPasswordError('');
    
    try {
      const success = await updatePassword(currentPassword, newPassword);
      
      if (success) {
        Alert.alert('Succès', 'Mot de passe mis à jour avec succès !');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordModalVisible(false);
      } else {
        setPasswordError('Échec de la mise à jour du mot de passe. Veuillez vérifier votre mot de passe actuel et réessayer.');
      }
    } catch (error) {
      setPasswordError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Perform the logout action
      await logoutFromClerk();
      
      // Navigate to the auth stack after logout
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: STACKS.AUTH }],
        })
      );
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(
        'Logout Error',
        'Une erreur est survenue pendant le déconnexion. Veuillez réessayer.'
      );
    }
  };

  const userAccountSection = {
    title: t('settings.account'),
    items: [
      {
        icon: <User size={24} color={COLORS.primary} />,
        title: t('settings.profile'),
        onPress: () => {
          if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
          }
          setProfileModalVisible(true);
        },
      },
    ],
  };

  const settingsSections = [
    userAccountSection,
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: <Globe size={24} color={COLORS.primary} />,
          title: t('settings.language'),
          value: 'Français',
        },
        {
          icon: <FileText size={24} color={COLORS.primary} />,
          title: 'Confidentialité',
          onPress: () => navigation.navigate(ROUTES.CONFIDENTIALITE),
        },
      ],
    },
    {
      title: t('settings.security'),
      items: [
        {
          icon: <Shield size={24} color={COLORS.primary} />,
          title: t('settings.privacy'),
        },
        {
          icon: <Key size={24} color={COLORS.primary} />,
          title: t('settings.changePassword'),
          onPress: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            setPasswordModalVisible(true);
          },
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: <HelpCircle size={24} color={COLORS.primary} />,
          title: t('settings.help'),
        },
      ],
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.header}
      >
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.subtitle}>
          {user ? `${user.firstName} ${user.lastName}` : t('settings.subtitle')}
        </Text>
      </Animatable.View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {settingsSections.map((section, sectionIndex) => (
          <Animatable.View
            key={section.title}
            animation="fadeInUp"
            delay={sectionIndex * 100}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items?.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  {item.icon}
                  <Text style={styles.settingText}>{item.title}</Text>
                </View>
                {item.value ? (
                  <Text style={styles.settingValue}>{item.value}</Text>
                ) : (
                  <ChevronRight size={20} color={COLORS.gray} />
                )}
              </TouchableOpacity>
            ))}
          </Animatable.View>
        ))}

        <Animatable.View
          animation="fadeInUp"
          delay={400}
          style={styles.logoutContainer}
        >
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutButton]}
            onPress={handleLogout}
          >
            <LogOut size={24} color={COLORS.error} />
            <Text style={[styles.settingText, styles.logoutText]}>
              {t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.editProfile')}</Text>
              <Text style={styles.modalSubtitle}>{t('settings.updateInfo')}</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('signup.firstName')}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('signup.lastName')}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.phone')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setProfileModalVisible(false)}
                disabled={updateLoading}
              >
                <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.changePassword')}</Text>
              <Text style={styles.modalSubtitle}>{t('settings.updatePassword')}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.currentPassword')}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Key size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.newPassword')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Shield size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={updateLoading}
              >
                <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleChangePassword}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      <FooterNav navigation={navigation} activeScreen="Settings" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.md,
    color: COLORS.black,
  },
  settingValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  logoutContainer: {
    marginTop: SPACING.md,
    marginBottom: 80,
  },
  logoutButton: {
    backgroundColor: COLORS.light_error,
  },
  logoutText: {
    color: COLORS.error,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    minHeight: '50%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    marginBottom: SPACING.md,
    padding: SPACING.sm,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    padding: SPACING.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: COLORS.light_gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});

export default SettingsScreen;
