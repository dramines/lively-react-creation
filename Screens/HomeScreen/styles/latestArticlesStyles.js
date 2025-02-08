import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../common/design';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.70; // Reduced to 85% of original width

export const styles = StyleSheet.create({
        container: {
          marginVertical: 16,
        },
        headerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginBottom: 16,
        },
        sectionTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
        },
        seeAllButton: {
          color: Colors.secondary,
          fontSize: 14,
          fontWeight: '600',
        },
        scrollViewContent: {
          paddingHorizontal: 16,
          paddingBottom: 8,
        },
        cardWrapper: {
          marginRight: 16,
          width: CARD_WIDTH,
        },
        foodCard: {
          borderRadius: 16,
          elevation: 4,
          backgroundColor: '#fff',
          overflow: 'hidden',
        },
        imageContainer: {
          position: 'relative',
          height: 180,
        },
        foodImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        timeContainer: {
          position: 'absolute',
          top: 12,
          left: 12,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 6,
          borderRadius: 20,
          gap: 4,
        },
        timeText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: '500',
        },
        contentContainer: {
          padding: 12,
        },
        titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        },
        foodName: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          flex: 1,
          marginRight: 8,
        },
        ratingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        ratingText: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
        },
        typeContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 6,
        },
        typeText: {
          fontSize: 14,
          color: '#666',
        },
        locationContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12,
        },
        locationText: {
          fontSize: 14,
          color: '#666',
          flex: 1,
        },
        quantityPriceRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        quantityContainer: {
          backgroundColor: '#F5F5F5',
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        },
        quantityText: {
          fontSize: 14,
          color: '#666',
          fontWeight: '500',
        },
        freeText: {
          fontSize: 16,
          fontWeight: 'bold',
          color: Colors.secondary,
        },
        // Skeleton styles
        skeletonImage: {
          height: 180,
          backgroundColor: '#E1E9EE',
        },
        skeletonTitle: {
          height: 24,
          backgroundColor: '#E1E9EE',
          borderRadius: 4,
          marginBottom: 8,
        },
        skeletonDetail: {
          height: 16,
          backgroundColor: '#E1E9EE',
          borderRadius: 4,
          marginBottom: 8,
          width: '60%',
        },
        errorContainer: {
          padding: 20,
          alignItems: 'center',
        },
        errorText: {
          color: 'red',
          fontSize: 14,
        },
      });