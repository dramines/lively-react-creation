import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

export default function DonationStats() {
  const { t } = useTranslation();

  const pieData = [
    {
      name: t('StatsScreen.FreshFood'),
      population: 45,
      color: '#8884d8',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: t('StatsScreen.PackagedFood'),
      population: 35,
      color: '#82ca9d',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: t('StatsScreen.CookedFood'),
      population: 20,
      color: '#ffc658',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('StatsScreen.FoodDonationImpact')}</Text>
      
      <View style={styles.statsGrid}>
        <LinearGradient
          colors={['#893571', '#b8658f']}
          style={styles.statCard}
        >
          <Icon name="food-apple" size={32} color="#fff" />
          <Text style={styles.statNumber}>328</Text>
          <Text style={styles.statLabel}>{t('StatsScreen.MealsDonated')}</Text>
          <Text style={styles.periodLabel}>{t('StatsScreen.ThisMonth')}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#b8658f', '#893571']}
          style={styles.statCard}
        >
          <Icon name="account-group" size={32} color="#fff" />
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>{t('StatsScreen.PeopleFed')}</Text>
          <Text style={styles.periodLabel}>{t('StatsScreen.ThisMonth')}</Text>
        </LinearGradient>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {t('StatsScreen.MonthlyDonationsDistribution')}
        </Text>
        <BarChart
          data={monthlyData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="kg "
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(137, 53, 113, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <View style={styles.pieContainer}>
        <Text style={styles.chartTitle}>{t('StatsScreen.FoodTypeDistribution')}</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#893571',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  periodLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  chartContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  pieContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
});