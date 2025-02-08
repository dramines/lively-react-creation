import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTranslation } from 'react-i18next';
import styles from './styles/ThankYouStyle';
const { width } = Dimensions.get('window');

const ThankYouPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const fadeAnim = new Animated.Value(1); // Start visible
  const { t } = useTranslation();

  const steps = [
    t('thankyou.Submittingyourfood'),
    t('thankyou.Analyzingpictures'),
    t('thankyou.Sharingournetwork')
  ];


  useEffect(() => {
    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 500);

    // Steps progression
    const stepsInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev === steps.length - 1) {
          setShowConfetti(true);
          setShowSteps(false);
          clearInterval(stepsInterval);
          clearInterval(dotsInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepsInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/thankyou.png')}
          style={styles.image}
        />

        {showSteps && (
          <View style={styles.loadingContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.loadingText}>
                {steps[currentStep]}
                <Text style={styles.dots}>
                  {''.padEnd(dots, '.')}
                </Text>
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${((currentStep + 1) / steps.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}

        {showConfetti && (
          <>
            <ConfettiCannon
              count={250}
              origin={{ x: width / 2, y: -10 }}
              fadeOut
              explosionSpeed={350}
              fallSpeed={2500}
              colors={['#893571', '#000000', '#FFD700', '#FFFFFF']}
            />
            <View style={styles.thankYouContainer}>
              <Text style={styles.thankYouText}>
              {t('thankyou.Thankgenerous')}
              </Text>
              <Text style={styles.subText}>
              {t('thankyou.Someoneinneed')} 
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};


export default ThankYouPage;
