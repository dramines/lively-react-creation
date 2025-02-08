import React, { useState , useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import ThankYou from './ThankYou';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const DonateScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation();

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
    if (currentStep !== 5) return;

      try {
        const step1 = JSON.parse(await AsyncStorage.getItem('step1data')) || {};
        const step2 = JSON.parse(await AsyncStorage.getItem('step2data')) || {};
        const step3 = JSON.parse(await AsyncStorage.getItem('step3data')) || {};
        const step4 = JSON.parse(await AsyncStorage.getItem('step4data')) || {};
        const AdressUserFood = JSON.parse(await AsyncStorage.getItem('AdressUserFood')) || {};
        const id_user = 11; 
        
        const formData = new FormData();
        formData.append('name_food', step1.title || ''); 
        formData.append('description_food', step1.description || ''); 
        formData.append('quantity_food', step1.quantity || ''); 
        formData.append('actualquantity_food', step1.quantity || ''); 
        formData.append('quantitytype_food', step1.containerType || ''); 
        formData.append('type_food', step2.foodType || ''); 
        formData.append('allergens_food', step2.allergensContamination || ''); 
        formData.append('cookedtime_food', step2.preparationDate || ''); 
        formData.append('istaken_food', 'false'); 
        formData.append('additionalnote_food', step2.additionalNote || ''); 
        formData.append('hallal_food', step2.hallalFood ? 'true' : 'false'); 
        formData.append('isfrozen_food', step2.isFrozen ? 'true' : 'false'); 
        formData.append('hygienne_declaration', step4.hygieneDeclaration || ''); 
        formData.append('data_consent', step4.dataConsent ? 'true' : 'false'); 
        formData.append('id_user', id_user.toString()); 
        formData.append('type_availability', step3.deliveryMethod || ''); 
        formData.append('country_availability', AdressUserFood.country  || '' ); 
        formData.append('postalcode_availability', AdressUserFood.postalCode || '') ; 
        formData.append('adresse_availability', step3.location || ''); 
        formData.append('date_availability', step3.selectedDate || ''); 
        formData.append('time_availability', step3.selectedTimeSlots || ''); 
        formData.append('longitude_availability', AdressUserFood.longitude || ''); 
        formData.append('altitude_availability', AdressUserFood.latitude || ''); 
        if (step1.images && Array.isArray(step1.images)) {
          step1.images.forEach((image, index) => {
            formData.append(`image${index === 0 ? '' : index + 1}_food`, {
              uri: image,
              type: 'image/jpeg', 
              name: `image${index + 1}.jpg`,
            });
          });
        }
        const response = await fetch('http://192.168.1.81:5002/api/foods', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Food added successfully:', responseData);

        await AsyncStorage.removeItem('step1data');
        await AsyncStorage.removeItem('step2data');
        await AsyncStorage.removeItem('step3data');
        await AsyncStorage.removeItem('step4data');
        await AsyncStorage.removeItem('AdressUserFood');

        } else {
          console.error('Failed to add food:', response.statusText);
        }

      } catch (error) {
        console.error('Error sending food data:', error);
      }
    };

    fetchAllData();
  }, [currentStep]); 


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={['#893571', '#9d4580']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('DonateScreen.shareYourFood')}</Text>
<Text style={styles.headerSubtitle}>
  {currentStep === 5 ? t('DonateScreen.donationComplete') : t('DonateScreen.step', { currentStep })}
</Text>

          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}
            {currentStep === 4 && <Step4 />}
            {currentStep === 5 && <ThankYou />}
          </View>

          <View style={styles.footerButton}>
            <TouchableOpacity
              onPress={handleContinue}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={['#893571', '#b8658f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {currentStep === 5 ? 'Close' : 'Continue'}
                </Text>
                <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDE7F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: height * 0.6,
  },
  footerButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default DonateScreen;