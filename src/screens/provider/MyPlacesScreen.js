
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Edit, 
  Trash, 
  Plus,
  ArrowLeft
} from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { AuthContext } from '../../context/AuthContext';
import { usePlacesData } from '../../hooks/usePlacesData';
import * as Animatable from 'react-native-animatable';

const MyPlacesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { fetchPlacesByProvider, deletePlace } = usePlacesData();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPlaces = async () => {
    if (!user || !user.id) {
      setError("User information not available");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const providerPlaces = await fetchPlacesByProvider(user.id);
      setPlaces(providerPlaces);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlaces();
    setRefreshing(false);
  };

  const handleEdit = (place) => {
    navigation.navigate('EditPlace', { place });
  };

  const handleDelete = (place) => {
    Alert.alert(
      "Confirmation",
      `Êtes-vous sûr de vouloir supprimer "${place.name}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlace(place.id);
              // Update the local state after successful deletion
              setPlaces(places.filter(p => p.id !== place.id));
              Alert.alert("Succès", "Le lieu a été supprimé avec succès");
            } catch (err) {
              Alert.alert("Erreur", "Impossible de supprimer le lieu");
            }
          }
        }
      ]
    );
  };

  const handleAddPlace = () => {
    navigation.navigate('AddPlace');
  };

  const renderPlaceItem = ({ item, index }) => {
    // Default image if no images are available
    const defaultImage = require('../../../assets/bulla-regia.png');
    
    return (
      <Animatable.View 
        animation="fadeInUp" 
        delay={index * 100}
        style={styles.placeCard}
      >
        <Image 
          source={item.images && item.images.length > 0 ? 
            { uri: item.images[0] } : defaultImage}
          style={styles.placeImage}
          resizeMode="cover"
        />
        
        <View style={styles.placeContent}>
          <Text style={styles.placeName}>{item.name}</Text>
          
          <View style={styles.placeTypeContainer}>
            <Text style={styles.placeType}>
              {item.type === 'museum' ? 'Musée' :
               item.type === 'historical_site' ? 'Site Historique' :
               item.type === 'restaurant' ? 'Restaurant' :
               item.type || 'Type non spécifié'}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={COLORS.gray} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location?.city || ''}{item.location?.city && item.location?.region ? ', ' : ''}
              {item.location?.region || ''}
            </Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEdit(item)}
            >
              <Edit size={16} color={COLORS.primary} />
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item)}
            >
              <Trash size={16} color={COLORS.error} />
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Lieux</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPlace}
        >
          <Plus size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de vos lieux...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadPlaces}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlaceItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Vous n'avez aucun lieu enregistré</Text>
              <TouchableOpacity 
                style={styles.addFirstPlaceButton}
                onPress={handleAddPlace}
              >
                <Plus size={18} color={COLORS.white} />
                <Text style={styles.addFirstPlaceText}>Ajouter un lieu</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.md,
  },
  placeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  placeImage: {
    width: 100,
    height: '100%',
  },
  placeContent: {
    flex: 1,
    padding: SPACING.md,
  },
  placeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  placeTypeContainer: {
    backgroundColor: COLORS.primary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  placeType: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 4,
    flex: 1,
  },
  editButton: {
    backgroundColor: COLORS.primary + '10',
    marginRight: SPACING.xs,
  },
  deleteButton: {
    backgroundColor: COLORS.error + '10',
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  addFirstPlaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  addFirstPlaceText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default MyPlacesScreen;
