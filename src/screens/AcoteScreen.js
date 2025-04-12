
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Animated,
  RefreshControl,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Share,
  Alert
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { FooterNav } from '../components/FooterNav';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import PlaceItem from '../components/PlaceItem';
import { calculateDistance } from '../../common/calculateDistance';
import { getPlacesNearby, searchPlaces } from '../services/PlaceService';
import { useLocationPermission } from '../hooks/useLocationPermission';
import TextToSpeech from '../components/TextToSpeech';
import { acoteScreenStyles as styles } from './AcoteScreenStyles';

const AcoteScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { userLocation, locationError, permissionStatus } = useLocationPermission();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // State for places data
  const [allPlaces, setAllPlaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Modal states
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nouvel événement', message: 'Visite guidée nocturne à Bulla Regia', read: false },
    { id: 2, title: 'Nouvelle promotion', message: 'Réduction de 20% sur les visites guidées', read: true }
  ]);

  // Load places when location is available
  useEffect(() => {
    if (userLocation) {
      fetchPlaces();
    } else if (locationError) {
      setErrorMsg(locationError === 'permission_denied' 
        ? t('acote.locationPermissionDenied') 
        : t('acote.locationError'));
      setIsLoading(false);
    }
  }, [userLocation, locationError]);

  // Fade in animation when data is loaded
  useEffect(() => {
    if (!isLoading && allPlaces.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, allPlaces]);

  // Fetch places data from API
  const fetchPlaces = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      let places = [];
      
      if (userLocation) {
        // Get places from API with nearby filtering
        places = await getPlacesNearby(userLocation);
        
        console.log('Fetched places:', places.length);
        
        if (!places || places.length === 0) {
          console.log('No places found nearby, falling back to search');
          places = await searchPlaces('', userLocation);
        }
      } else {
        // Fallback to general search if location is unavailable
        places = await searchPlaces('');
      }
      
      // Ensure places have isFavorite property
      const processedPlaces = places.map(place => ({
        ...place,
        isFavorite: false,
      }));
      
      setAllPlaces(processedPlaces);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setErrorMsg(t('acote.dataError'));
      setIsLoading(false);
    }
  };

  // Refresh places data
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlaces().then(() => setRefreshing(false));
  }, [userLocation]);

  // Handle search
  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await searchPlaces(query, userLocation);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [userLocation]);

  // Handle search query change
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery, handleSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Filter places by category
  const filterPlaces = useCallback(() => {
    // Use search results if available, otherwise filter all places
    let filtered = searchResults.length > 0 ? searchResults : allPlaces;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(place => place.category === activeCategory);
    }
    
    return filtered;
  }, [allPlaces, searchResults, activeCategory]);

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const toggleFavorite = (placeId) => {
    const updatedPlaces = allPlaces.map(place => {
      if (place.id === placeId) {
        return { ...place, isFavorite: !place.isFavorite };
      }
      return place;
    });
    setAllPlaces(updatedPlaces);
    
    if (selectedPlace && selectedPlace.id === placeId) {
      setSelectedPlace({
        ...selectedPlace,
        isFavorite: !selectedPlace.isFavorite
      });
    }
  };

  const handlePlacePress = (place) => {
    setSelectedPlace(place);
    setDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedPlace(null);
  };

  const openReviewModal = () => {
    setReviewModalVisible(true);
    setDetailsModalVisible(false);
  };

  const submitReview = () => {
    console.log('Review submitted:', { placeId: selectedPlace.id, rating: reviewRating, text: reviewText });
    
    setReviewText('');
    setReviewRating(5);
    setReviewModalVisible(false);
    setDetailsModalVisible(true);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setEventModalVisible(true);
    setDetailsModalVisible(false);
  };

  const registerForEvent = () => {
    console.log('Registered for event:', selectedEvent);
    
    setEventModalVisible(false);
    setDetailsModalVisible(true);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const sharePlace = async () => {
    try {
      await Share.share({
        message: `Découvrez ${selectedPlace.name} - ${selectedPlace.description}`,
        title: `Partager ${selectedPlace.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const navigateToReservation = () => {
    closeDetailsModal();
    navigation.navigate('Reservation');
  };

  // Render functions
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icons.Star 
            key={i}
            size={16} 
            color={i <= rating ? COLORS.warning : COLORS.gray_light}
            fill={i <= rating ? COLORS.warning : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => openEventModal(item)}
    >
      <View style={styles.eventIcon}>
        <Icons.Calendar size={24} color={COLORS.primary} />
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date} • {item.time}</Text>
      </View>
      
    </TouchableOpacity>
  );

  const renderAmenities = (amenities) => (
    <View style={styles.amenitiesContainer}>
      {amenities?.map((amenity, index) => (
        <View key={index} style={styles.amenityBadge}>
          <Text style={styles.amenityText}>{amenity}</Text>
        </View>
      ))}
    </View>
  );

  const renderPlaceDetailHeader = () => (
    <View style={styles.detailsHeader}>
      <View style={styles.detailsHeaderContent}>
        <Text style={styles.detailsTitle}>{selectedPlace.name}</Text>
        <View style={styles.detailsSubHeader}>
          <View style={styles.categoryLabel}>
            <Text style={styles.categoryLabelText}>
              {selectedPlace.category?.charAt(0).toUpperCase() + selectedPlace.category?.slice(1) || 'Lieu'}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            {renderStars(selectedPlace.rating || 0)}
            <Text style={styles.ratingText}>
              {selectedPlace.rating || '0'} ({selectedPlace.reviews || '0'})
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.favoriteButton, selectedPlace.isFavorite && styles.favoriteButtonActive]}
        onPress={() => toggleFavorite(selectedPlace.id)}
      >
        <Icons.Heart 
          size={24} 
          color={selectedPlace.isFavorite ? COLORS.white : COLORS.primary} 
          fill={selectedPlace.isFavorite ? COLORS.warning : 'transparent'} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('acote.searchPlaceholder')}
          onClear={handleClearSearch}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => console.log('Open filters')}
        >
          <Icons.SlidersHorizontal size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.notificationButton, notifications.some(n => !n.read) && styles.hasNotifications]}
          onPress={() => setNotificationModalVisible(true)}
        >
          <Icons.Bell size={20} color={COLORS.primary} />
          {notifications.some(n => !n.read) && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notifications.filter(n => !n.read).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <CategoryTabs 
        activeCategory={activeCategory}
        onCategoryPress={handleCategoryPress}
      />
      {userLocation && (
        <View style={styles.currentLocationContainer}>
          <Icons.Compass size={18} color={COLORS.white} />
          <Text style={styles.currentLocationText}>
            {t('acote.yourlocation')}
          </Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <Animated.View style={{opacity: fadeAnim}}>
      <PlaceItem 
        place={item}
        distance={item.distance}
        onPress={() => handlePlacePress(item)}
      />
    </Animated.View>
  );

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
        <View style={styles.header}>
          <Text style={styles.title}>{t('acote.title')}</Text>
          <Text style={styles.subtitle}>{t('acote.subtitle')}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Icons.AlertCircle size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchPlaces}>
            <Icons.RefreshCw size={20} color={COLORS.white} style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>{t('acote.retry')}</Text>
          </TouchableOpacity>
        </View>
        <FooterNav navigation={navigation} activeScreen="Acote" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('acote.title')}</Text>
        <Text style={styles.subtitle}>{t('acote.subtitle')}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>{t('acote.gettingLocation')}</Text>
        </View>
      ) : (
        <FlatList
          data={filterPlaces()}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderListHeader}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[COLORS.secondary]}
              tintColor={COLORS.secondary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>{t('acote.noPlacesFound')}</Text>
              <Text style={styles.emptyText}>
                {t('acote.noResults')}
              </Text>
            </View>
          }
        />
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={closeDetailsModal}
      >
        {selectedPlace && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={closeDetailsModal}
              >
                <Icons.X size={24} color={COLORS.black} />
              </TouchableOpacity>
              
              <ScrollView>
                <View style={styles.imageContainer}>
                  <Image 
                    source={require('../../assets/icon.png')} 
                    style={styles.detailsImage}
                    resizeMode="cover"
                  />
                  
                  <TouchableOpacity 
                    style={styles.audioButton}
                    onPress={toggleAudio}
                  >
                    {audioEnabled ? (
                      <Icons.Square size={20} color={COLORS.white} />
                    ) : (
                      <Icons.Volume2 size={20} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                </View>
                
                {renderPlaceDetailHeader()}
                
                <View style={styles.detailsSection}>
                  <View style={styles.infoItem}>
                    <Icons.MapPin size={16} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                      À {selectedPlace.distance ? selectedPlace.distance : '?'} km de votre position
                    </Text>
                  </View>
                  
                  {selectedPlace.openingHours && (
                    <View style={styles.infoItem}>
                      <Icons.Clock size={16} color={COLORS.primary} />
                      <Text style={styles.infoText}>
                        {selectedPlace.openingHours}
                      </Text>
                    </View>
                  )}
                  
                  {selectedPlace.price !== undefined && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoText}>
                        Prix: {selectedPlace.price === 0 ? 'Gratuit' : `${selectedPlace.price} €`}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedPlace.description}
                  </Text>
                  
                  {/* Text to speech component for description */}
                  <TextToSpeech 
                    text={selectedPlace.description} 
                    autoPlay={false} 
                    showLabel={true}
                    buttonSize="medium"
                  />
                </View>
                
                {selectedPlace.amenities && selectedPlace.amenities.length > 0 && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Commodités</Text>
                    {renderAmenities(selectedPlace.amenities)}
                  </View>
                )}
                
                {selectedPlace.events && selectedPlace.events.length > 0 && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Événements à venir</Text>
                    <FlatList
                      data={selectedPlace.events}
                      renderItem={renderEventItem}
                      keyExtractor={item => item.id?.toString()}
                      horizontal={false}
                      scrollEnabled={false}
                    />
                  </View>
                )}
                
                <View style={styles.detailsActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={navigateToReservation}
                  >
                    <Icons.BookOpen size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Réserver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={openReviewModal}
                  >
                    <Icons.MessageCircle size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Avis</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={sharePlace}
                  >
                    <Icons.Share2 size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Partager</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donnez votre avis</Text>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => {
                  setReviewModalVisible(false);
                  setDetailsModalVisible(true);
                }}
              >
                <Icons.X size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star}
                  onPress={() => setReviewRating(star)}
                >
                  <Icons.Star 
                    size={32} 
                    color={star <= reviewRating ? COLORS.warning : COLORS.gray_light}
                    fill={star <= reviewRating ? COLORS.warning : 'transparent'}
                    style={styles.ratingStar}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.reviewInput}
              placeholder="Partagez votre expérience..."
              multiline={true}
              numberOfLines={5}
              value={reviewText}
              onChangeText={setReviewText}
            />
            
            <TouchableOpacity 
              style={[styles.submitButton, !reviewText.trim() && styles.submitButtonDisabled]}
              onPress={submitReview}
              disabled={!reviewText.trim()}
            >
              <Text style={styles.submitButtonText}>Soumettre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => {
          setEventModalVisible(false);
          setDetailsModalVisible(true);
        }}
      >
        {selectedEvent && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Détails de l'événement</Text>
                <TouchableOpacity 
                  style={styles.closeModalButton}
                  onPress={() => {
                    setEventModalVisible(false);
                    setDetailsModalVisible(true);
                  }}
                >
                  <Icons.X size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.eventDetail}>
                <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                <View style={styles.eventDetailInfo}>
                  <Icons.Calendar size={18} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>{selectedEvent.date}</Text>
                </View>
                <View style={styles.eventDetailInfo}>
                  <Icons.Clock size={18} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>{selectedEvent.time}</Text>
                </View>
                <View style={styles.eventDetailInfo}>
                  <Icons.MapPin size={18} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>{selectedPlace?.name}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={registerForEvent}
              >
                <Text style={styles.registerButtonText}>S'inscrire à l'événement</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.reminderButton}
                onPress={() => {
                  console.log('Reminder set for', selectedEvent);
                  setEventModalVisible(false);
                  setDetailsModalVisible(true);
                }}
              >
                <Icons.Bell size={18} color={COLORS.primary} />
                <Text style={styles.reminderButtonText}>Me le rappeler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareEventButton}
                onPress={async () => {
                  try {
                    await Share.share({
                      message: `Rejoins-moi à ${selectedEvent.title} le ${selectedEvent.date} à ${selectedEvent.time} à ${selectedPlace?.name}!`,
                    });
                  } catch (error) {
                    console.error('Error sharing event:', error);
                  }
                }}
              >
                <Icons.Share2 size={18} color={COLORS.primary} />
                <Text style={styles.shareEventButtonText}>Partager l'événement</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setNotificationModalVisible(false)}
              >
                <Icons.X size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            
            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.notificationItem, !item.read && styles.unreadNotification]}
                    onPress={() => {
                      setNotifications(notifications.map(n => 
                        n.id === item.id ? { ...n, read: true } : n
                      ));
                    }}
                  >
                    <View style={styles.notificationIcon}>
                      <Icons.Bell size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.emptyNotifications}>
                <Icons.Bell size={48} color={COLORS.gray_light} />
                <Text style={styles.emptyNotificationsText}>
                  Vous n'avez pas de notifications
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      <FooterNav navigation={navigation} activeScreen="Acote" />
    </SafeAreaView>
  );
};

export default AcoteScreen;
