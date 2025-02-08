import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 

const HeaderMap = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const navigateToNotifications = () => {
    navigation.navigate('NotificationScreen'); 
  };

  return (
    <SafeAreaView style={[styles.header, { width, top: height * 0.02 }]}>
      <View>
        <View style={styles.headerContent}>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMBoNHTdNFu-NloeUZS5-L9aWbPTmqkCy-Tg&s' }}
              style={styles.profilePic}
            />
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.iconContainer}>
              <IconButton 
                icon="bell-outline" 
                size={24} 
                onPress={navigateToNotifications} 
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  profileContainer: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HeaderMap;
