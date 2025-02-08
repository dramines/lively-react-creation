import React, { useState } from 'react';
import { Text, StyleSheet, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useClerk } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, BorderRadius, Shadows } from '../../common/design';

const Logout = () => {
  const { signOut } = useClerk();
  const navigation = useNavigation();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <View style={styles.footer}>
        <Button
          mode="outlined"
          icon="logout"
          style={styles.logoutButton}
          labelStyle={styles.logoutText}
          onPress={() => setLogoutModalVisible(true)}
        >
          {t('Logout.logout')}
        </Button>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLogoutModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{t('Logout.confirmation')}</Text>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalActions}>
                  <Button
                    onPress={handleLogout}
                    style={styles.confirmButton}
                    labelStyle={styles.confirmButtonText}
                    mode="contained"
                  >
                    {t('Logout.yes')}
                  </Button>
                  <Button
                    onPress={() => setLogoutModalVisible(false)}
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonText}
                    mode="outlined"
                  >
                    {t('Logout.cancel')}
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  logoutText: {
    ...Typography.button,
    color: Colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  confirmButtonText: {
    ...Typography.button,
    color: Colors.background,
  },
  cancelButton: {
    flex: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },
});

export default Logout;