
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = {
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: height * 0.018,
  },
  googleText: {
    marginLeft: width * 0.03,
    fontSize: width * 0.04,
    color: '#333',
  },
  orContainer: {
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  orText: {
    fontSize: width * 0.04,
    color: '#888',
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
  },
  input: {
    flex: 1,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
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
    marginLeft: width * 0.01,
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.05,
  },
  bottomText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  signupLink: {
    color: '#b8658f',
    fontWeight: 'bold',
  },
};
