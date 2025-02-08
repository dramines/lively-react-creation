
import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../../common/design';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const steps = [
  {
    title: "Share With Love",
    description: "Join a community that believes in sharing meals and spreading joy",
    bubblePositions: [
      { top: -20, left: -20 },           // Cut off at top-left
      { top: '40%', right: -30 },        // Cut off at right
      { top: '15%', left: '25%' },       // Centered upper
      { bottom: -20, left: '60%' },      // Cut off at bottom
      { top: '60%', left: -15 },         // Cut off at left
      { top: '25%', right: '20%' },      // Upper right
      { bottom: -25, right: -20 }        // Cut off at bottom-right
    ]
  },
  {
    title: "Make an Impact",
    description: "Every meal shared is a step towards reducing food waste",
    bubblePositions: [
      { top: '15%', right: -20 },        // Cut off at right
      { top: '45%', left: -30 },         // Cut off at left
      { top: '30%', left: '45%' },       // Center middle
      { bottom: -15, right: '35%' },     // Cut off at bottom
      { top: '10%', right: '25%' },      // Upper right
      { top: '65%', left: '15%' },       // Lower left
      { bottom: -20, left: -20 }         // Cut off at bottom-left
    ]
  },
  {
    title: "Connect & Care",
    description: "Build meaningful connections through the power of food sharing",
    bubblePositions: [
      { top: '25%', left: -20 },         // Cut off at left
      { top: '55%', right: -20 },        // Cut off at right
      { top: '20%', left: '40%' },       // Upper center
      { bottom: -25, left: '25%' },      // Cut off at bottom
      { top: '45%', left: -25 },         // Cut off at left middle
      { top: '10%', right: '30%' },      // Upper right
      { bottom: -15, right: -15 }        // Cut off at bottom-right
    ]
  }
];

const foodItems = [
  {
    id: 1,
    image: 'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
    backgroundColor: '#E5DEFF',
    size: SCREEN_WIDTH * 0.28,
  },
  {
    id: 2,
    image: 'https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg',
    backgroundColor: '#FFDEE2',
    size: SCREEN_WIDTH * 0.32,
  },
  {
    id: 3,
    image: 'https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg',
    backgroundColor: '#FDE1D3',
    size: SCREEN_WIDTH * 0.25,
  },
  {
    id: 4,
    image: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
    backgroundColor: '#D3E4FD',
    size: SCREEN_WIDTH * 0.24,
  },
  {
    id: 5,
    image: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg',
    backgroundColor: '#FEC6A1',
    size: SCREEN_WIDTH * 0.28,
  },
  {
    id: 6,
    image: 'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg',
    backgroundColor: '#F2FCE2',
    size: SCREEN_WIDTH * 0.26,
  },
  {
    id: 7,
    image: 'https://www.themealdb.com/images/media/meals/ypxvwv1505333929.jpg',
    backgroundColor: '#FEF7CD',
    size: SCREEN_WIDTH * 0.30,
  }
];

export default function StartScreen({ navigation }) {
  const [activeStep, setActiveStep] = useState(0);
  const animatedValues = useRef(foodItems.map(() => ({
    scale: new Animated.Value(0),
    rotate: new Animated.Value(0),
    position: new Animated.ValueXY()
  }))).current;

  useEffect(() => {
    animateBubbles();
  }, [activeStep]);

  const animateBubbles = () => {
    animatedValues.forEach((anim, index) => {
      const newPosition = steps[activeStep].bubblePositions[index];
      
      // Reset animations
      anim.scale.setValue(0);
      anim.rotate.setValue(0);
      
      // Animate to new positions with stagger
      Animated.parallel([
        Animated.spring(anim.scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
          delay: index * 100
        }),
        Animated.spring(anim.rotate, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
          delay: index * 100
        })
      ]).start();
    });
  };

  const renderFoodBubbles = () => {
    return foodItems.map((item, index) => {
      const scale = animatedValues[index].scale.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 1.1, 1]
      });

      const rotate = animatedValues[index].rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${Math.random() * 30 - 15}deg`]
      });

      return (
        <Animated.View
          key={item.id}
          style={[
            styles.foodBubble,
            {
              width: item.size,
              height: item.size,
              backgroundColor: item.backgroundColor,
              ...steps[activeStep].bubblePositions[index],
              transform: [
                { scale },
                { rotate }
              ]
            }
          ]}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.foodImage}
            resizeMode="cover"
          />
        </Animated.View>
      );
    });
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              {
                backgroundColor: index === activeStep ? '#893571' : Colors.border,
                width: index === activeStep ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#F8F9FF']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>FOODECA</Text>
        </View>

        <View style={styles.bubblesContainer}>
          {renderFoodBubbles()}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{steps[activeStep].title}</Text>
            <Text style={styles.description}>{steps[activeStep].description}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {renderStepIndicator()}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (activeStep < steps.length - 1) {
                setActiveStep(activeStep + 1);
              } else {
                navigation.navigate('Login');
              }
            }}
          >
            <Text style={styles.buttonText}>
              {activeStep < steps.length - 1 ? 'Next' : 'Get started'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  bubblesContainer: {
    height: SCREEN_HEIGHT * 0.5,
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  foodBubble: {
    position: 'absolute',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    opacity: 0.9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xl * 0.5,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonContainer: {
    paddingBottom: Spacing.xl * 2,
    zIndex: 2,
  },
  button: {
    backgroundColor: '#893571',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepDot: {
    height: 8,
    borderRadius: BorderRadius.round,
    marginHorizontal: 4,
    transition: '0.3s',
  },
});