import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../translations/LanguageProvider';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const { changeLanguage, lng } = useLanguage();
  const { t } = useTranslation();

  const languages = [
    { label: 'English', code: 'en' },
    { label: 'French', code: 'fr' },
  ];

  return (
    <View style={styles.pageContainer}>
      <TouchableOpacity
        style={styles.settingsItem}
        onPress={() => setLanguageModalVisible(true)}
      >
        <View style={styles.itemIcon}>
          <MaterialCommunityIcons name="translate" size={24} color="#893571" />
        </View>
        <Text style={styles.itemText}>{t('SettingsScreen.language')}</Text>
        <Text style={styles.selectedLanguage}>
          {languages.find(lang => lang.code === lng)?.label}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('SettingsScreen.select_language')}</Text>
            {languages.map((language, index) => (
              <TouchableOpacity
                key={index}
                style={styles.languageOption}
                onPress={() => {
                  changeLanguage(language.code);
                  setLanguageModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.languageText,
                    lng === language.code && styles.languageTextSelected,
                  ]}
                >
                  {language.label}
                </Text>
              </TouchableOpacity>
            ))}
            <Button
              onPress={() => setLanguageModalVisible(false)}
              style={styles.closeModalButton}
            >
              {t('SettingsScreen.close')}
            </Button>
          </View>
        </View>
      </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  selectedLanguage: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  languageOption: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  languageTextSelected: {
    color: '#893571',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default LanguageSelector;
