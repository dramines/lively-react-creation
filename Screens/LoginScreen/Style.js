
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
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
    marginBottom: height * 0.04,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#221F26',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  loginTabs: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingBottom: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#b8658f',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#b8658f',
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: height * 0.018,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: width * 0.02,
  },
  socialText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
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
    fontSize: 14,
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
    fontSize: 16,
    color: '#374151',
  },
  forgotPassword: {
    color: '#b8658f',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: height * 0.02,
  },
  loginButton: {
    backgroundColor: '#b8658f',
    borderRadius: 12,
    padding: height * 0.018,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  termsLink: {
    color: '#b8658f',
    textDecorationLine: 'underline',
  },
});

export default styles;
