import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressCircle } from 'react-native-svg-charts';

export default function ImpactMetrics() {
  const animationDuration = 2000; // 2 seconds duration
  const [progress, setProgress] = useState({
    communities: 0,
    people: 0,
    hours: 0
  });

  const [displayNumbers, setDisplayNumbers] = useState({
    communities: 0,
    people: 0,
    hours: "00:00"
  });

  const animationRef = useRef(null);

  const metrics = [
    {
      icon: 'earth',
      value: 218,
      label: 'Communities Reached',
      progress: 0.72,
      color: '#893571',
      key: 'communities'
    },
    {
      icon: 'account-group',
      value: 1240,
      label: 'People Helped',
      progress: 0.85,
      color: '#b8658f',
      key: 'people'
    },
    {
      icon: 'clock-outline',
      value: "82:48",
      label: 'Block Hours',
      progress: 0.65,
      color: '#d4a6c7',
      key: 'hours'
    },
  ];

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const animate = (timestamp) => {
    if (!animationRef.current) {
      animationRef.current = {
        startTime: timestamp,
        completed: false
      };
    }

    const progressValue = Math.min(
      (timestamp - animationRef.current.startTime) / animationDuration,
      1
    );

    // Update progress circles
    setProgress({
      communities: metrics[0].progress * progressValue,
      people: metrics[1].progress * progressValue,
      hours: metrics[2].progress * progressValue
    });

    // Update numbers
    setDisplayNumbers({
      communities: Math.floor(metrics[0].value * progressValue),
      people: Math.floor(metrics[1].value * progressValue),
      hours: formatTime(Math.floor(82 * progressValue * 60 + 48 * progressValue)) // Convert 82:48 to minutes and animate
    });

    if (progressValue < 1) {
      requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    requestAnimationFrame(animate);
    return () => {
      animationRef.current = null;
    };
  }, []);

  const formatDisplayValue = (metric, value) => {
    if (metric.key === 'hours') {
      return value;
    }
    return value.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Impact</Text>
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <View style={styles.progressContainer}>
              <ProgressCircle
                style={styles.progressCircle}
                progress={progress[metric.key]}
                progressColor={metric.color}
                backgroundColor="#f0f0f0"
                strokeWidth={8}
              />
              <Icon
                name={metric.icon}
                size={20}
                color={metric.color}
                style={styles.iconOverlay}
              />
            </View>
            <Text style={styles.metricValue}>
              {formatDisplayValue(metric, displayNumbers[metric.key])}
            </Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  metricsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  progressContainer: {
    width: 70,
    height: 70,
    position: 'relative',
    marginBottom: 8,
  },
  progressCircle: {
    height: 70,
  },
  iconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -10 },
      { translateY: -10 }
    ],
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});
