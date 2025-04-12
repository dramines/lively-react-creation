import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';
import { MapPin, ArrowRight } from 'lucide-react-native';
import TextToSpeech from './TextToSpeech';

const PlaceCallout = ({ place = {}, onDetailsPress }) => {
  // Debug log to track data
  console.log('PlaceCallout received place:', JSON.stringify(place));
  
  // Comprehensive safety checks to prevent undefined errors
  if (!place || typeof place !== 'object') {
    console.warn('PlaceCallout received invalid place data:', place);
    return null;
  }
  
  // Ensure place has required properties with defaults
  const name = place.name || 'Unknown Place';
  const type = (place.type && typeof place.type === 'string') ? place.type : 'location';
  const description = (place.description && typeof place.description === 'string') ? place.description : '';
  
  // Handle potentially missing location data
  const location = (place.location && typeof place.location === 'object') ? place.location : {};
  const city = (location.city && typeof location.city === 'string') ? location.city : '';
  
  // Safe handler for onDetailsPress
  const handleDetailsPress = () => {
    try {
      if (onDetailsPress && typeof onDetailsPress === 'function') {
        onDetailsPress();
      } else {
        console.warn('Missing onDetailsPress handler');
      }
    } catch (error) {
      console.error('Error in handleDetailsPress:', error);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.calloutContainer} 
      onPress={handleDetailsPress}
      activeOpacity={0.9}
    >
      <View style={styles.calloutContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{name}</Text>
          <TextToSpeech text={name} autoPlay={false} />
        </View>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
        
        {description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
            <TextToSpeech text={description} autoPlay={false} />
          </View>
        ) : null}
        
        {city ? (
          <View style={styles.locationContainer}>
            <MapPin size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>{city}</Text>
          </View>
        ) : null}
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={handleDetailsPress}
        >
          <Text style={styles.detailsButtonText}>Voir détails</Text>
          <ArrowRight size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.calloutArrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 220,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  calloutContent: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  calloutArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.white,
    alignSelf: 'center',
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.xs,
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: COLORS.primary_light,
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    marginRight: SPACING.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  hiddenTTS: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
    right: 0,
  },
});

export default PlaceCallout;
