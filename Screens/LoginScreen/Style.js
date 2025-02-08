import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
  card: {
    marginHorizontal: width * 0.05,
    padding: width * 0.05,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#221F26',
    marginBottom: height * 0.01,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.03,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    height: height * 0.065,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    color: '#374151',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: height * 0.02,
  },
  forgotPassword: {
    color: '#b8658f',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  loginButton: {
    marginVertical: height * 0.02,
  },
  gradientButton: {
    borderRadius: 12,
    padding: height * 0.018,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: width * 0.04,
    color: '#6B7280',
    fontSize: width * 0.035,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: height * 0.018,
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: width * 0.02,
  },
  googleText: {
    fontSize: width * 0.04,
    color: '#374151',
    fontWeight: '600',
  },
  bottomContainer: {
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  signupContainer: {
    alignItems: 'center',
  },
  bottomText: {
    fontSize: width * 0.035,
    color: '#6B7280',
  },
  signupLink: {
    color: '#b8658f',
    fontWeight: 'bold',
  },
});

export default styles;