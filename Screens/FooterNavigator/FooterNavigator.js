import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FooterNavigator = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('HomeScreen');
  const { t } = useTranslation();

  useEffect(() => {
    setActiveTab(route.name);
  }, [route]);

  const TabButton = ({ label, icon, screen, isCenter = false }) => {
    const isActive = activeTab === screen;

    return (
      <TouchableOpacity
        style={[styles.tabButton, isCenter && styles.centerButton]}
        onPress={() => {
          setActiveTab(screen);
          navigation.navigate(screen);
        }}
      >
        <View style={[styles.iconContainer, isActive && !isCenter && styles.activeIconContainer]}>
          {isCenter ? (
            <LinearGradient
              colors={['#893571', '#b8658f']}
              style={styles.centerButtonInner}
            >
              <Icon name={icon} size={28} color="white" />
            </LinearGradient>
          ) : (
            <>
              <Icon
                name={icon}
                size={24}
                color={isActive ? '#893571' : '#8E8E93'}
                style={styles.icon}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {label}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
        style={styles.footerContainer}
      >
        <TabButton 
          label={t('Footer.Home')} 
          icon="home" 
          screen="HomeScreen" 
        />
        <TabButton 
          label={t('Footer.Community')} 
          icon="people" 
          screen="CommunityScreen" 
        />
        <TabButton 
          label="" 
          icon="map" 
          screen="MapScreen" 
          isCenter={true} 
        />
        <TabButton 
          label={t('Footer.Stats')} 
          icon="stats-chart-outline" 
          screen="StatsScreen" 
        />
        <TabButton 
          label={t('Footer.Profile')} 
          icon="person" 
          screen="SettingsScreen" 
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'ios' ? 10 : 2,
    paddingTop: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  centerButton: {
    justifyContent: 'flex-start',
    marginTop: -18,
  },
  centerButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#893571',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(137, 53, 113, 0.1)',
  },
  icon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#893571',
    fontWeight: '600',
  },
});

export default FooterNavigator;