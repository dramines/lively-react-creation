import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Switch, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateTimeSlots } from './utils/timeUtils';
import styles from './styles/Step3Style';
import { useTranslation } from 'react-i18next';

const Step3 = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [volunteerPickup, setVolunteerPickup] = useState(true);
  const [location, setLocation] = useState('');
  const [differentAddress, setDifferentAddress] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [activeInput, setActiveInput] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation(); 
  const route = useRoute();
  const timeSlots = generateTimeSlots(7, 22, 120); 
  const { t } = useTranslation();

  useEffect(() => {
    const loadPickupAddress = async () => {
      try {
        const storedAddress = await AsyncStorage.getItem('AdressUserFood');
  
        if (storedAddress) {
          const parsedAddress = JSON.parse(storedAddress);
          const formattedAddress = `${parsedAddress.name}, ${parsedAddress.city}, ${parsedAddress.region}, ${parsedAddress.country}, ${parsedAddress.postalCode}`;
          setPickupAddress(formattedAddress);
        }
      } catch (error) {
        console.error('Error loading address:', error);
      }
    };
  
    loadPickupAddress();
  
    const intervalId = setInterval(loadPickupAddress, 4000);
    return () => clearInterval(intervalId);
  }, []); 
  
 
  useEffect(() => {
    const updateRealTimeData = async () => {
      const formData = {
        deliveryMethod,
        volunteerPickup,
        location,
        differentAddress,
        pickupAddress,
        selectedTimeSlots,
        selectedDate
      };
  
      try {
        await AsyncStorage.setItem('step3data', JSON.stringify(formData));
        console.log('Data updated:', formData);
      } catch (error) {
        console.error('Error updating data:', error);
      }
    };
  
    updateRealTimeData();
  }, [
    deliveryMethod,
    volunteerPickup,
    location,
    differentAddress,
    pickupAddress,
    selectedTimeSlots,
    selectedDate
  ]);
  

  const toggleTimeSlot = (slot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  return (
    <ScrollView >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('Step3.PickupDeliveryDetails')}</Text>
        <Text style={styles.sectionSubtitle}>{t('Step3.Pleaseprovideyourpreferred')}</Text>

        <View style={styles.methodContainer}>
          <Text style={styles.label}>{t('Step3.DeliveryMethod')}</Text>
          <View style={styles.methodOptions}>
            <TouchableOpacity
              style={[styles.methodButton, deliveryMethod === 'pickup' && styles.methodButtonActive]}
              onPress={() => setDeliveryMethod('pickup')}
            >
              <MaterialIcons name="directions-walk" size={24} color={deliveryMethod === 'pickup' ? '#FFFFFF' : '#666'} />
              <Text style={[styles.methodButtonText, deliveryMethod === 'pickup' && styles.methodButtonTextActive]}>
              {t('Step3.Pickup')} 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodButton, deliveryMethod === 'delivery' && styles.methodButtonActive]}
              onPress={() => setDeliveryMethod('delivery')}
            >
              <MaterialIcons name="local-shipping" size={24} color={deliveryMethod === 'delivery' ? '#FFFFFF' : '#666'} />
              <Text style={[styles.methodButtonText, deliveryMethod === 'delivery' && styles.methodButtonTextActive]}>
              {t('Step3.Delivery')}  
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      {deliveryMethod !== 'delivery' && (
  <View style={styles.addressSection}>
    <TouchableOpacity
      style={[styles.inputContainer, activeInput === 'address' && styles.inputContainerActive]}
      onPress={() => navigation.navigate('AdressPickerScreen')}
    >
      <MaterialIcons
        name="location-on"
        size={24}
        color={activeInput === 'address' ? '#893571' : '#666'}
      />
      <Text style={styles.input}>
        {pickupAddress || t('Step3.Enterpickupaddress')}
      </Text>
    </TouchableOpacity>
  </View>
)}


        <View style={styles.dateContainer}>
          <Text style={styles.label}>{t('Step3.PreferredDate')}</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="event" size={24} color="#666" />
            <Text style={styles.dateButtonText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.timeSlotsContainer}>
      <Text style={styles.label}>{t('Step3.AvailableTimeSlots')}  </Text>
      {timeSlots.map((slot, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.timeSlot, selectedTimeSlots.includes(slot) && styles.timeSlotSelected]}
          onPress={() => toggleTimeSlot(slot)}
        >
          <Text style={[styles.timeSlotText, selectedTimeSlots.includes(slot) && styles.timeSlotTextSelected]}>
            {slot}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
      </View>
    </ScrollView>
  );
};


export default Step3;
