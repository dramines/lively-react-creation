
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 16,
      color: '#666666',
      marginBottom: 24,
    },
    methodContainer: {
      marginBottom: 24,
    },
    methodOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    methodButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      gap: 8,
    },
    methodButtonActive: {
      backgroundColor: '#893571',
    },
    methodButtonText: {
      fontSize: 16,
      color: '#666',
      fontWeight: '600',
    },
    methodButtonTextActive: {
      color: '#FFFFFF',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333333',
      marginBottom: 12,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    switchLabel: {
      fontSize: 16,
      color: '#333333',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: '#333333',
    },
    dateContainer: {
      marginBottom: 24,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dateButtonText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#333333',
    },
    timeSlotsContainer: {
      marginTop: 16,
    },
    timeSlot: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    timeSlotSelected: {
      backgroundColor: '#893571',
    },
    timeSlotText: {
      fontSize: 16,
      color: '#333333',
      textAlign: 'center',
    },
    timeSlotTextSelected: {
      color: '#FFFFFF',
    },
    submitButton: {
      backgroundColor: '#893571',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 32,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    }
  });

  export default styles;
