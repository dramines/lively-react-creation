import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const LANGUAGE_KEY = '@app_language';

export const LanguageProvider = ({ children }) => {
  const [lng, setLng] = useState('en'); // Default to English

  // Load saved language preference on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
          console.log('Loaded saved language:', savedLanguage);
          i18n.changeLanguage(savedLanguage);
          setLng(savedLanguage);
        } else {
          console.log('No saved language found, using default: en');
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  const changeLanguage = async (newLng) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLng);
      console.log('Language saved:', newLng);
      i18n.changeLanguage(newLng);
      setLng(newLng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ lng, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};