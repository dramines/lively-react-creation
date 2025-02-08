import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTranslation } from 'react-i18next';

const OrderConfirmationAnimation = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const { t } = useTranslation();

  const steps = [
    "Checking your information...",
    "Validating order...",
    "Sending notification...",
    "Order completed!"
  ];

  useEffect(() => {
    const animateStep = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setShowConfetti(true);
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      });
    };

    animateStep();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        {steps[currentStep]}
      </Animated.Text>
      
      {showConfetti && (
        <>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            fadeOut={true}
            autoStart={true}
          />
          <Text style={styles.congratsText}>
            Congratulations! Your food order has been placed.
          </Text>
          <Text style={styles.waitText}>
            Please wait for the donor's confirmation.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  congratsText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  waitText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  }
});

export default OrderConfirmationAnimation;