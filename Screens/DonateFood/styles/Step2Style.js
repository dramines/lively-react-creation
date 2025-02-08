
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: '#666666',
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333333',
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#DDDDDD',
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFFFFF',
      minHeight: 56,  // Adjusted to minHeight
      marginBottom: 12,
    },
    
    input: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: '#333333',
      paddingVertical: 8,
      height: '100%',
      textAlignVertical: 'center',  // Center text vertically
    },
    
    picker: {
      flex: 1,
      marginLeft: 12,
      height: 56,
    },
    
    toggleContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    toggleOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#F0F0F0',
      height: 56,
    },
    toggleOptionActive: {
      backgroundColor: '#893571',
    },
    toggleText: {
      fontSize: 16,
      color: '#666',
      marginLeft: 8,
    },
    toggleTextActive: {
      color: '#FFFFFF',
    },
    safetyToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    toggleButton: {
      backgroundColor: '#F0F0F0',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      minWidth: 80,
      alignItems: 'center',
    },
    toggleButtonText: {
      fontSize: 16,
      color: '#666',
    },
    textAreaContainer: {
      minHeight: 120,
      alignItems: 'flex-start',
    },
    textArea: {
      flex: 1,
      width: '100%',
      fontSize: 16,
      color: '#333333',
      textAlignVertical: 'top',
      paddingTop: 8,  // Added padding in the text area
    },
    dateText: {
      fontSize: 16,
      color: '#333333',
      marginLeft: 12,
    },
  });

  export default styles;
