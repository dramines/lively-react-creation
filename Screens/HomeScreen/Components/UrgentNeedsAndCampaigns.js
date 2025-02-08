import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const UrgentNeedsAndCampaigns = () => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('NeedsCompaigns.FoodDonationEvents')}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>{t('NeedsCompaigns.ViewAll')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((item) => (
          <Card key={item} style={[styles.donationCard, { width: width * 0.75 }]}>
            <Image
              source={{ uri: 'https://brownliving.in/cdn/shop/articles/food-donation-services-988981_600x.jpg?v=1703200384' }}
              style={styles.eventImage}
            />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Community Food Drive</Text>
              
              <View style={styles.eventInfo}>
                <Icon name="calendar" size={16} color="#666" />
                <Text style={styles.infoText}>Jan 15, 2025 • 9:00 AM</Text>
              </View>
              
              <View style={styles.eventInfo}>
                <Icon name="map-marker" size={16} color="#666" />
                <Text style={styles.infoText}>Community Center, Downtown</Text>
              </View>
              
              <View style={styles.eventInfo}>
                <Icon name="food" size={16} color="#666" />
                <Text style={styles.infoText}>Goal: 500 meals</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: '45%' }]} />
                </View>
                <Text style={styles.progressText}>225/500 meals collected</Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.donateButton}>
                  Donate Food
                </Button>
                <Button mode="text" style={styles.readMoreButton}>
                  Read More
                </Button>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#893571',
  },
  donationCard: {
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 12,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progress: {
    height: '100%',
    backgroundColor: '#893571',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  donateButton: {
    backgroundColor: '#893571',
    flex: 1,
    marginRight: 8,
  },
  readMoreButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default UrgentNeedsAndCampaigns;
