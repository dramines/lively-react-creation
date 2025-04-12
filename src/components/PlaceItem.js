import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Star } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../navigation/navigationConstants';
import TextToSpeech from './TextToSpeech';

const PlaceItem = ({ place, distance, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate(ROUTES.PLACE_DETAILS, { placeId: place.id });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.image}
          resizeMode="cover"
        />
        {place.type && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {place.name}
          </Text>
          <TextToSpeech text={place.name} autoPlay={false} />
        </View>
        
        {place.description && (
          <View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description} numberOfLines={2}>
                {place.description}
              </Text>
              <TextToSpeech text={place.description} autoPlay={false} />
            </View>
          </View>
        )}
        
        <View style={styles.footer}>
          {place.location && place.location.city && (
            <View style={styles.infoItem}>
              <MapPin size={14} color={COLORS.primary} />
              <Text style={styles.infoText}>{place.location.city}</Text>
            </View>
          )}
          
          {distance !== undefined && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{distance} km</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light_gray,
  },
  categoryBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.primary_light,
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: 4,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.medium,
  },
  contentContainer: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.xxs,
    flex: 1,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginLeft: 4,
  },
  distanceBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: 4,
  },
  distanceText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxs,
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hiddenTTS: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
    right: 0,
  },
});

export default PlaceItem;