import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  image: {
    width: width - 96,
    height: width - 96,
    borderRadius: 20,
    marginBottom: 36,
  },
  loadingContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 18,
  },
  textContainer: {
    minHeight: 27,
    justifyContent: 'center',
    marginBottom: 13.5,
  },
  loadingText: {
    fontSize: 19,
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
  },
  dots: {
    color: '#893571',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: '90%',
    height: 5.4,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#893571',
    borderRadius: 3,
  },
  thankYouContainer: {
    marginTop: 27,
    padding: 18,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 22.8,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 9,
  },
  subText: {
    fontSize: 15.2,
    color: '#893571',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default styles;
