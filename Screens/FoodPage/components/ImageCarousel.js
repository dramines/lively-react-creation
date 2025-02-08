import React from 'react';
import { View, ImageBackground, ScrollView, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ImageCarousel = ({ images, scrollX }) => {
  const imageWidth = width;

  return (
    <View style={styles.imageCarousel}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <ImageBackground source={{ uri: image }} style={styles.foodImage}>
              <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
              />
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {images.map((_, index) => {
          const width = scrollX.interpolate({
            inputRange: [(index - 1) * imageWidth, index * imageWidth, (index + 1) * imageWidth],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange: [(index - 1) * imageWidth, index * imageWidth, (index + 1) * imageWidth],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View key={index} style={[styles.indicator, { width, opacity }]} />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageCarousel: {
    height: height * 0.45,
  },
  imageContainer: {
    width: width,
    height: height * 0.45,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});

export default ImageCarousel;