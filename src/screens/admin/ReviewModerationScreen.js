
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { boxShadow } from '../../theme/mixins';

export default function ReviewModerationScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviews, setReviews] = useState([
    { 
      id: '1', 
      user: 'Marie Dupont', 
      location: 'Parc National de Carthage',
      locationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Carthage_-_Antonine_Baths.jpg/640px-Carthage_-_Antonine_Baths.jpg',
      rating: 5, 
      comment: 'Un lieu magnifique chargé d\'histoire ! La visite guidée était fascinante et très complète.', 
      date: '15/05/2023',
      status: 'approved',
      flagged: false
    },
    { 
      id: '2', 
      user: 'Thomas Martin', 
      location: 'Médina de Tunis',
      locationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tunismedina.JPG/640px-Tunismedina.JPG',
      rating: 4, 
      comment: 'Ambiance authentique et boutiques d\'artisanat intéressantes. Un peu bondé mais ça fait partie du charme !', 
      date: '22/05/2023',
      status: 'approved',
      flagged: false
    },
    { 
      id: '3', 
      user: 'Sophie Bernard', 
      location: 'Café Delices',
      locationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tunisia-4895_-_Great_Mosque_%287864641392%29.jpg/640px-Tunisia-4895_-_Great_Mosque_%287864641392%29.jpg',
      rating: 2, 
      comment: 'Service très lent et nourriture moyenne. ÉVITEZ CET ENDROIT !!! N\'y allez surtout pas, c\'est une arnaque totale.', 
      date: '01/06/2023',
      status: 'pending',
      flagged: true
    },
    { 
      id: '4', 
      user: 'Lucas Petit', 
      location: 'Musée du Bardo',
      locationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Le_Bardo_Museum.jpg/640px-Le_Bardo_Museum.jpg',
      rating: 5, 
      comment: 'Collection incroyable, surtout les mosaïques. Prévoir au moins 2h pour tout voir.', 
      date: '10/06/2023',
      status: 'approved',
      flagged: false
    },
    { 
      id: '5', 
      user: 'Antoine Durand', 
      location: 'Plage de La Marsa',
      locationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Amphitheatre_El_Jem_Tunisia.jpg/640px-Amphitheatre_El_Jem_Tunisia.jpg',
      rating: 1, 
      comment: 'Plage sale et surpeuplée. Je ne recommande pas du tout. Allez plutôt voir la concurrence qui est bien meilleure !', 
      date: '17/06/2023',
      status: 'rejected',
      flagged: true
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesQuery = review.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         review.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesQuery;
    if (filterStatus === 'flagged') return matchesQuery && review.flagged;
    return matchesQuery && review.status === filterStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setReviews(
      reviews.map(review => {
        if (review.id === id) {
          return { ...review, status: newStatus, flagged: newStatus === 'rejected' ? true : review.flagged };
        }
        return review;
      })
    );
  };

  const toggleFlagged = (id) => {
    setReviews(
      reviews.map(review => {
        if (review.id === id) {
          return { ...review, flagged: !review.flagged };
        }
        return review;
      })
    );
  };

  const handleDeleteReview = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cet avis ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => {
            setReviews(reviews.filter(review => review.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ 
          fontSize: FONT_SIZE.sm, 
          color: i <= rating ? '#FFC107' : COLORS.gray_light
        }}>
          ★
        </Text>
      );
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars}
      </View>
    );
  };

  const getReviewStyle = (status, flagged) => {
    if (status === 'rejected') return styles.reviewCardRejected;
    if (flagged) return styles.reviewCardFlagged;
    return styles.reviewCard;
  };

  const renderReviewItem = ({ item }) => (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      style={[styles.reviewCard, getReviewStyle(item.status, item.flagged)]}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>{item.user.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.flagContainer}>
          {item.flagged && (
            <View style={styles.flagBadge}>
              <Text style={styles.flagText}>Signalé</Text>
            </View>
          )}
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: item.status === 'approved' ? '#E8F5E9' : 
                               item.status === 'pending' ? '#FFF9C4' : '#FFEBEE'
            }
          ]}>
            <Text style={[
              styles.statusText, 
              { 
                color: item.status === 'approved' ? '#2E7D32' : 
                       item.status === 'pending' ? '#F57F17' : '#C62828'
              }
            ]}>
              {item.status === 'approved' ? 'Approuvé' : 
               item.status === 'pending' ? 'En attente' : 'Rejeté'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.locationInfo}>
        <Image source={{ uri: item.locationImage }} style={styles.locationImage} />
        <Text style={styles.locationName}>{item.location}</Text>
      </View>
      
      <View style={styles.ratingContainer}>
        {renderStars(item.rating)}
        <Text style={styles.ratingText}>{item.rating}/5</Text>
      </View>
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
      
      <View style={styles.reviewActions}>
        {item.status !== 'approved' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E8F5E9' }]}
            onPress={() => handleStatusChange(item.id, 'approved')}
          >
            <Text style={[styles.actionButtonText, { color: '#2E7D32' }]}>Approuver</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'rejected' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
            onPress={() => handleStatusChange(item.id, 'rejected')}
          >
            <Text style={[styles.actionButtonText, { color: '#C62828' }]}>Rejeter</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: item.flagged ? '#E3F2FD' : '#FFF9C4' }]}
          onPress={() => toggleFlagged(item.id)}
        >
          <Text style={[
            styles.actionButtonText, 
            { color: item.flagged ? '#1976D2' : '#F57F17' }
          ]}>
            {item.flagged ? 'Retirer flag' : 'Signaler'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
          onPress={() => handleDeleteReview(item.id)}
        >
          <Text style={[styles.actionButtonText, { color: '#C62828' }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary_dark} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modération des Avis</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans les avis..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, filterStatus === 'all' && styles.filterTabActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterTabText, filterStatus === 'all' && styles.filterTabTextActive]}>
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filterStatus === 'flagged' && styles.filterTabActive]}
          onPress={() => setFilterStatus('flagged')}
        >
          <Text style={[styles.filterTabText, filterStatus === 'flagged' && styles.filterTabTextActive]}>
            Signalés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filterStatus === 'pending' && styles.filterTabActive]}
          onPress={() => setFilterStatus('pending')}
        >
          <Text style={[styles.filterTabText, filterStatus === 'pending' && styles.filterTabTextActive]}>
            En attente
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reviews.filter(r => r.status === 'approved').length}</Text>
          <Text style={styles.statLabel}>Approuvés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reviews.filter(r => r.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reviews.filter(r => r.flagged).length}</Text>
          <Text style={styles.statLabel}>Signalés</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredReviews}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg + (StatusBar.currentHeight || 0),
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light_gray,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  filterTabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light_gray,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  listContainer: {
    padding: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...boxShadow,
  },
  reviewCardFlagged: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  reviewCardRejected: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary_light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
  },
  reviewDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  flagContainer: {
    flexDirection: 'row',
  },
  flagBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
    marginRight: SPACING.sm,
  },
  flagText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: '#C62828',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
  },
  locationImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  locationName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary_dark,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ratingText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  reviewComment: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  reviewActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.xs,
    marginRight: SPACING.xs,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
});
