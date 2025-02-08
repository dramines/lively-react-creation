import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import styles from './styles/Step4Style';
import { useTranslation } from 'react-i18next';

const Step4 = ({ navigation }) => {
  const [hygieneDeclaration, setHygieneDeclaration] = useState(0); // 0 by default (not checked)
  const [dataConsent, setDataConsent] = useState(0); // 0 by default (not checked)
  const [updatesConsent, setUpdatesConsent] = useState(0); // 0 by default (not checked)
  const [futureContactConsent, setFutureContactConsent] = useState(0); // 0 by default (not checked)
  const { t } = useTranslation();

  useEffect(() => {
    loadSavedData();
  }, []);

  const saveData = async (newData) => {
    try {
      const dataToSave = {
        hygieneDeclaration: newData.hygieneDeclaration !== undefined ? newData.hygieneDeclaration : hygieneDeclaration,
        dataConsent: newData.dataConsent !== undefined ? newData.dataConsent : dataConsent,
        updatesConsent: newData.updatesConsent !== undefined ? newData.updatesConsent : updatesConsent,
        futureContactConsent: newData.futureContactConsent !== undefined ? newData.futureContactConsent : futureContactConsent,
      };
      await AsyncStorage.setItem('step4data', JSON.stringify(dataToSave));
      console.log(dataToSave);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Load saved data from AsyncStorage
  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('step4data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setHygieneDeclaration(parsedData.hygieneDeclaration || 0);
        setDataConsent(parsedData.dataConsent || 0);
        setUpdatesConsent(parsedData.updatesConsent || 0);
        setFutureContactConsent(parsedData.futureContactConsent || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = () => {
    if (hygieneDeclaration === 1 && dataConsent === 1) {
      const formData = {
        hygieneDeclaration,
        dataConsent,
        updatesConsent,
        futureContactConsent,
      };
      navigation.navigate('Summary', { formData });
    } else {
      alert('Please confirm the hygiene declaration and data consent.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('Step4.ConsentandAcknowledgements')}</Text>
        <Text style={styles.sectionSubtitle}>
          {t('Step4.Pleaseprovidethe')}
        </Text>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={hygieneDeclaration === 1 ? 'checked' : 'unchecked'}
            onPress={() => {
              const newValue = hygieneDeclaration === 1 ? 0 : 1; // Toggle between 0 and 1
              setHygieneDeclaration(newValue);
              saveData({ hygieneDeclaration: newValue });
            }}
            color="#893571"
          />
          <Text style={styles.checkboxLabel}>
            {t('Step4.Iconfirmprepared')}
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={dataConsent === 1 ? 'checked' : 'unchecked'}
            onPress={() => {
              const newValue = dataConsent === 1 ? 0 : 1; // Toggle between 0 and 1
              setDataConsent(newValue);
              saveData({ dataConsent: newValue });
            }}
            color="#893571"
          />
          <Text style={styles.checkboxLabel}>
            {t('Step4.informationsolelyfordonationpurposes')}
          </Text>
        </View>

        <Text style={styles.optionalQuestionsTitle}>{t('Step4.OptionalQuestions')}</Text>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={updatesConsent === 1 ? 'checked' : 'unchecked'}
            onPress={() => {
              const newValue = updatesConsent === 1 ? 0 : 1; // Toggle between 0 and 1
              setUpdatesConsent(newValue);
              saveData({ updatesConsent: newValue });
            }}
            color="#893571"
          />
          <Text style={styles.checkboxLabel}>
            {t('Step4.updatesimpact')}
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={futureContactConsent === 1 ? 'checked' : 'unchecked'}
            onPress={() => {
              const newValue = futureContactConsent === 1 ? 0 : 1; // Toggle between 0 and 1
              setFutureContactConsent(newValue);
              saveData({ futureContactConsent: newValue });
            }}
            color="#893571"
          />
          <Text style={styles.checkboxLabel}>
            {t('Step4.openbeingcontacted')}
          </Text>
        </View>

        <View style={styles.submitContainer}>
          <Text onPress={handleSubmit} style={styles.submitButton}>
            {t('Step4.Submit')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Step4;
