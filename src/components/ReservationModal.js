
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { Calendar, Clock, Users, X, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';

const ReservationModal = ({ visible, onClose, place, onConfirm }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [personCount, setPersonCount] = useState(2);
  const [step, setStep] = useState(1); // 1: form, 2: confirmation, 3: success
  
  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleConfirm = () => {
    if (step === 1) {
      setStep(2); // Move to confirmation step
    } else if (step === 2) {
      // Here you would typically send the reservation to your backend
      setStep(3); // Move to success step
      // After some time, you might want to close and reset
      setTimeout(() => {
        if (onConfirm) {
          onConfirm({
            date: selectedDate,
            time: selectedTime,
            persons: personCount,
            place: place
          });
        }
        resetAndClose();
      }, 2000);
    }
  };
  
  const resetAndClose = () => {
    setStep(1);
    onClose();
  };
  
  const incrementPersonCount = () => {
    if (personCount < 10) {
      setPersonCount(personCount + 1);
    }
  };
  
  const decrementPersonCount = () => {
    if (personCount > 1) {
      setPersonCount(personCount - 1);
    }
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(new Date(date));
  };
  
  const renderCalendar = () => {
    const today = new Date();
    const days = [];
    
    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.calendarContainer}
      >
        {days.map((date, index) => (
          <TouchableOpacity
            key={`day-${index}`}
            style={[
              styles.dateItem,
              isDateSelected(date) && styles.dateItemSelected
            ]}
            onPress={() => handleDateChange(date)}
          >
            <Text style={[
              styles.dayName,
              isDateSelected(date) && styles.dateTextSelected
            ]}>
              {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
            </Text>
            <Text style={[
              styles.dayNumber,
              isDateSelected(date) && styles.dateTextSelected
            ]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  const isDateSelected = (date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const renderTimeSelection = () => {
    return (
      <View style={styles.timeSelectionContainer}>
        <Text style={styles.sectionTitle}>
          {t('reservation.selectTime', 'Choisir une heure')}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeContainer}
        >
          {timeSlots.map((time, index) => (
            <TouchableOpacity
              key={`time-${index}`}
              style={[
                styles.timeItem,
                selectedTime === time && styles.timeItemSelected
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeText,
                selectedTime === time && styles.timeTextSelected
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const renderPersonSelection = () => {
    return (
      <View style={styles.personSelectionContainer}>
        <Text style={styles.sectionTitle}>
          {t('reservation.selectPersons', 'Nombre de personnes')}
        </Text>
        <View style={styles.personCountContainer}>
          <TouchableOpacity 
            style={styles.personCountButton}
            onPress={decrementPersonCount}
          >
            <Text style={styles.personCountButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.personCountValue}>
            <Text style={styles.personCountText}>{personCount}</Text>
          </View>
          <TouchableOpacity 
            style={styles.personCountButton}
            onPress={incrementPersonCount}
          >
            <Text style={styles.personCountButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderPlaceSummary = () => {
    if (!place) return null;
    
    return (
      <View style={styles.placeSummaryContainer}>
        <Text style={styles.placeName}>{place.name}</Text>
        {place.location && (
          <View style={styles.placeDetailRow}>
            <View style={styles.placeDetailIcon}>
              <Clock size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.placeDetailText}>
              {selectedTime}
            </Text>
          </View>
        )}
        <View style={styles.placeDetailRow}>
          <View style={styles.placeDetailIcon}>
            <Calendar size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.placeDetailText}>
            {formatDate(selectedDate)}
          </Text>
        </View>
        <View style={styles.placeDetailRow}>
          <View style={styles.placeDetailIcon}>
            <Users size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.placeDetailText}>
            {personCount} {personCount > 1 ? t('reservation.persons', 'personnes') : t('reservation.person', 'personne')}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderFormStep = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.modalTitle}>
        {t('reservation.title', 'Faire une réservation')}
      </Text>
      
      {place && (
        <View style={styles.placeSummary}>
          <Text style={styles.placeName}>{place.name}</Text>
          {place.location && (
            <Text style={styles.placeLocation}>
              {place.location.address}, {place.location.city}
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>
            {t('reservation.selectDate', 'Choisir une date')}
          </Text>
        </View>
        {renderCalendar()}
      </View>
      
      {renderTimeSelection()}
      {renderPersonSelection()}
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title={t('reservation.continue', 'Continuer')}
          onPress={handleConfirm}
          style={styles.confirmButton}
        />
      </View>
    </ScrollView>
  );
  
  const renderConfirmationStep = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.modalTitle}>
        {t('reservation.confirmTitle', 'Confirmer votre réservation')}
      </Text>
      
      {renderPlaceSummary()}
      
      <View style={styles.confirmationInfo}>
        <Text style={styles.confirmationText}>
          {t('reservation.confirmText', 'Veuillez confirmer les détails de votre réservation.')}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep(1)}
        >
          <Text style={styles.backButtonText}>
            {t('common.back', 'Retour')}
          </Text>
        </TouchableOpacity>
        <CustomButton
          title={t('reservation.confirm', 'Confirmer')}
          onPress={handleConfirm}
          style={styles.confirmButton}
        />
      </View>
    </ScrollView>
  );
  
  const renderSuccessStep = () => (
    <View style={styles.successContainer}>
      <CheckCircle size={70} color={COLORS.success} />
      <Text style={styles.successTitle}>
        {t('reservation.successTitle', 'Réservation Confirmée!')}
      </Text>
      <Text style={styles.successText}>
        {t('reservation.successText', 'Votre réservation a été enregistrée avec succès. Vous recevrez une confirmation par email.')}
      </Text>
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <TouchableWithoutFeedback onPress={resetAndClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={resetAndClose}
              >
                <X size={24} color={COLORS.gray} />
              </TouchableOpacity>
              
              {step === 1 && renderFormStep()}
              {step === 2 && renderConfirmationStep()}
              {step === 3 && renderSuccessStep()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  placeSummary: {
    backgroundColor: COLORS.light_gray,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.lg,
  },
  placeName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  placeLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginLeft: SPACING.xs,
  },
  calendarContainer: {
    paddingVertical: SPACING.sm,
  },
  dateItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.light_gray,
    alignItems: 'center',
    minWidth: 65,
  },
  dateItemSelected: {
    backgroundColor: COLORS.primary,
  },
  dayName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  dayNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginTop: 2,
  },
  dateTextSelected: {
    color: COLORS.white,
  },
  timeSelectionContainer: {
    marginBottom: SPACING.lg,
  },
  timeContainer: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  timeItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.light_gray,
    minWidth: 65,
    alignItems: 'center',
  },
  timeItemSelected: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    color: COLORS.black,
    fontSize: FONT_SIZE.md,
  },
  timeTextSelected: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  personSelectionContainer: {
    marginBottom: SPACING.xl,
  },
  personCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  personCountButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personCountButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  personCountValue: {
    paddingHorizontal: SPACING.lg,
  },
  personCountText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  confirmButton: {
    flex: 1,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  placeSummaryContainer: {
    backgroundColor: COLORS.light_gray,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.lg,
  },
  placeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  placeDetailIcon: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeDetailText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
  confirmationInfo: {
    marginBottom: SPACING.lg,
  },
  confirmationText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  successTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.success,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  successText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default ReservationModal;
