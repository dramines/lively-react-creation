import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const PromoContainer = () => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const promos = [
    {
      title: t('PromoContainer.FreshDeals'),
      description: t('PromoContainer.GetFreshDealsDesc'),
      image: require('../../../assets/ads/image1.png') 
    },
    {
      title: t('PromoContainer.SpecialOffer'),
      description: t('PromoContainer.SpecialOfferDesc'),
      image: require('../../../assets/ads/image2.png') 
    },
    {
      title: t('PromoContainer.DailySpecials'),
      description: t('PromoContainer.DailySpecialsDesc'),
      image: require('../../../assets/ads/image3.png') 
    },
    {
      title: t('PromoContainer.WeekendSale'),
      description: t('PromoContainer.WeekendSaleDesc'),
      image: require('../../../assets/ads/image4.png') 
    }
  ];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveSlide(currentIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {promos.map((promo, index) => (
          <View key={index} style={styles.slide}>
            <ImageBackground
              source={promo.image}
              style={styles.promoCard}
              imageStyle={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={styles.overlay} />
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{promo.title}</Text>
                <Text style={styles.description}>{promo.description}</Text>
                <TouchableOpacity style={styles.orderButton}>
                  <Text style={styles.orderButtonText}>{t('PromoContainer.OrderNow')}</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {promos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    marginVertical: 16,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width - 32,
    marginHorizontal: 16,
  },
  promoCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    height: 200,
  },
  backgroundImage: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  orderButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  orderButtonText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#893571',
    width: 24,
  },
});

export default PromoContainer;
