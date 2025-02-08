import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated 
} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { fetchFoodItems } from '../services/foodService';
import { useSkeletonAnimation } from '../hooks/useSkeletonAnimation';
import { styles } from '../styles/latestArticlesStyles';
import { Colors } from '../../../common/design';
const SkeletonLoader = () => {
  const opacity = useSkeletonAnimation();

  return (
    <View style={styles.cardWrapper}>
      <Card style={styles.foodCard}>
        <Animated.View style={[styles.skeletonImage, { opacity }]} />
        <Card.Content>
          <Animated.View style={[styles.skeletonTitle, { opacity }]} />
          <Animated.View style={[styles.skeletonDetail, { opacity }]} />
          <Animated.View style={[styles.skeletonDetail, { opacity }]} />
        </Card.Content>
      </Card>
    </View>
  );
};

const LatestArticles = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        const data = await fetchFoodItems();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadFoodItems();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>{t('LatestArticles.NearbyFood')}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllButton}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          menuItems.map((item) => (
            <TouchableOpacity
              key={item.id_food}
              onPress={() => navigation.navigate('FoodDetail', { foodId: item.id_food })}
              style={styles.cardWrapper}
            >
              <Card style={styles.foodCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: `http://192.168.1.81:5002/api/${item.images[0]}` }}
                    style={styles.foodImage}
                  />
                  <View style={styles.timeContainer}>
                    <Icon name="clock-outline" size={14} color="#FFF" />
                    <Text style={styles.timeText}>{item.availability?.time_availability}</Text>
                  </View>
                </View>

                <Card.Content style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.foodName} numberOfLines={1}>
                      {item.name_food}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>4.8</Text>
                    </View>
                  </View>

                  <View style={styles.typeContainer}>
                    <Icon name="silverware-fork-knife" size={14} color={Colors.secondary} />
                    <Text style={styles.typeText}>{item.type_food}</Text>
                  </View>

                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={14} color={Colors.secondary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {item.availability?.adresse_availability}
                    </Text>
                  </View>

                  <View style={styles.quantityPriceRow}>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityText}>
                        {item.actualquantity_food} {item.quantitytype_food}
                      </Text>
                    </View>
                    <Text style={styles.freeText}>Free</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default LatestArticles;