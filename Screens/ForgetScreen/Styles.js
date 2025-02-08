import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts } from '../../common/design';

// Get screen dimensions
const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
      },
      container: {
        flex: 1,
      },
      scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      goBackIcon: {
        position: 'absolute',
        top: height * 0.05,
        left: width * 0.05,
        zIndex: 1,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
      },
      logoContainer: {
        alignItems: 'center',
        marginTop: height * 0.08,
        marginBottom: height * 0.03,
      },
      logo: {
        width: width * 0.4,
        height: width * 0.4,
      },
      card: {
        marginHorizontal: width * 0.05,
        padding: width * 0.05,
        borderRadius: 15,
        elevation: 4,
        backgroundColor: 'white',
      },
      title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.01,
      },
      subtitle: {
        fontSize: width * 0.04,
        color: '#666',
        marginBottom: height * 0.02,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: width * 0.03,
        marginBottom: height * 0.02,
        height: height * 0.06,
        backgroundColor: 'white',
      },
      input: {
        flex: 1,
        marginLeft: width * 0.02,
        fontSize: width * 0.04,
      },
      otpMessage: {
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
        marginBottom: height * 0.02,
      },
      otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: width * 0.05,
        marginBottom: height * 0.03,
      },
      otpInputContainer: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      },
      otpInput: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        color: '#333',
      },
      resendContainer: {
        alignItems: 'center',
        marginBottom: height * 0.02,
      },
      resendText: {
        fontSize: width * 0.035,
        color: '#666',
      },
      resendLink: {
        color: '#b8658f',
        fontWeight: 'bold',
      },
      gradientButton: {
        borderRadius: 8,
        padding: height * 0.018,
        marginVertical: height * 0.01,
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: width * 0.04,
        fontWeight: 'bold',
      },
      bottomTextContainer: {
        alignItems: 'center',
        marginTop: height * 0.03,
      },
      bottomText: {
        fontSize: width * 0.035,
        color: '#666',
      },
      loginLink: {
        color: '#b8658f',
        fontWeight: 'bold',
      },
});

export default styles;
