
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 10,
    },
    container: {
      flex: 1,
      paddingVertical: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 15,
      color: '#666666',
      marginBottom: 24,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    checkboxLabel: {
      fontSize: 16,
      color: '#333333',
      marginLeft: 8,
      flex: 1, // Ensures the text uses the remaining space
      flexWrap: 'wrap', // Allows the text to wrap to the next line
    },
    optionalQuestionsTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 24,
      marginBottom: 12,
    },
  });
  export default styles;
