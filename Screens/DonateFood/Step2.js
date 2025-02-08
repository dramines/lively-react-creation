import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/Step2Style';
import { useTranslation } from 'react-i18next';

const Step2 = () => {
  const [foodType, setFoodType] = useState('');
  const [isFrozen, setIsFrozen] =  useState(1); 
  const [preparationDate, setpreparationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [additionalNote, setadditionalNote] = useState('');
  const [allergensContamination, setallergensContamination] = useState(false);
  const [hallalFood, sethallalFood] = useState(0); 
  const { t } = useTranslation();

  const saveData = async () => { // Marking this function as async
    const data = {
      foodType,
      isFrozen,
      preparationDate,
      additionalNote,
      allergensContamination,
      hallalFood,
    };
    
    try {
      await AsyncStorage.setItem('step2data', JSON.stringify(data));
      console.log('Data saved:', data); // You can replace this with your actual saving logic
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveData(); // Calling the async function here
  }, [foodType, isFrozen, preparationDate, additionalNote, allergensContamination, hallalFood]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setpreparationDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>{t('Step2.FoodDetails')}</Text>
      <Text style={styles.sectionSubtitle}>{t('Step2.Pleaseprovidedetails')}</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('Step2.FoodType')}</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="fastfood" size={24} color="#666" />
          <Picker
            selectedValue={foodType}
            style={styles.picker}
            onValueChange={(itemValue) => setFoodType(itemValue)}
          >
            <Picker.Item label={t('Step2.SelectFoodType')}  value="" />
            <Picker.Item label={t('Step2.HomeCookedMeal')} value="homeCooked" />
            <Picker.Item label={t('Step2.PackagedFood')} value="packaged" />
            <Picker.Item label={t('Step2.FreshProduce')}  value="produce" />
            <Picker.Item label={t('Step2.CannedGoods')}  value="canned" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
  <Text style={styles.label}>{t('Step2.StorageState')}</Text>
  <View style={styles.toggleContainer}>
    <TouchableOpacity 
      style={[styles.toggleOption, isFrozen === 1 && styles.toggleOptionActive]} // Checking for 1 (frozen)
      onPress={() => setIsFrozen(1)} // Set to 1 when frozen
    >
      <MaterialIcons name="ac-unit" size={24} color={isFrozen === 1 ? '#fff' : '#666'} />
      <Text style={[styles.toggleText, isFrozen === 1 && styles.toggleTextActive]}>{t('Step2.Frozen')}</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.toggleOption, isFrozen === 0 && styles.toggleOptionActive]} // Checking for 0 (room temp)
      onPress={() => setIsFrozen(0)} // Set to 0 when room temperature
    >
      <MaterialIcons name="whatshot" size={24} color={isFrozen === 0 ? '#fff' : '#666'} />
      <Text style={[styles.toggleText, isFrozen === 0 && styles.toggleTextActive]}>{t('Step2.RoomTemp')}</Text>
    </TouchableOpacity>
  </View>
</View>


  <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('Step2.PreparationDate')}</Text>
        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="event" size={24} color="#666" />
          <Text style={styles.dateText}>
            {preparationDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={preparationDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('Step2.FoodSafetyChecks')}</Text>
        <View style={styles.safetyToggleContainer}>
          <Text style={styles.label}>{t('Step2.Anypossibleallergens')}</Text>
          <TouchableOpacity
            style={[styles.toggleButton, allergensContamination && styles.toggleOptionActive]}
            onPress={() => setallergensContamination(!allergensContamination)}
          >
            <Text style={[styles.toggleButtonText, allergensContamination && styles.toggleTextActive]}>
              {allergensContamination ?  t('yes') : t('no')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.safetyToggleContainer}>
  <Text style={styles.label}>{t('Step2.IsitconsideredHalal')}</Text>
  <TouchableOpacity
    style={[styles.toggleButton, hallalFood && styles.toggleOptionActive]}
    onPress={() => sethallalFood(hallalFood === 0 ? 1 : 0)} // Toggle between 0 and 1
  >
    <Text style={[styles.toggleButtonText, hallalFood === 1 && styles.toggleTextActive]}>
      {hallalFood === 1 ? t('yes') : t('no')}
    </Text>
  </TouchableOpacity>
</View>
</View>

      {/* Additional Notes */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('Step2.AdditionalNotes')}</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={styles.textArea}
            placeholder={t('Step2.Addanyadditionaldetails')} 
            multiline
            numberOfLines={4}
            value={additionalNote}
            onChangeText={setadditionalNote}
            placeholderTextColor="#999999"
          />
        </View>
      </View>
    </ScrollView>
  );
};



export default Step2;
