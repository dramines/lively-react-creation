
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, TrendingUp, AlertTriangle, Check, Plus } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getPropertiesByOwner } from '../../services/propertyService';
import { PropertyData } from '../../services/propertyService';

/**
 * Type de statistique pour les propriétés
 */
interface PropertyStat {
  total: number;
  available: number;
  maintenance: number;
  booked: number;
}

/**
 * Écran tableau de bord du propriétaire
 * Affiche les statistiques et un aperçu des propriétés
 */
const OwnerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PropertyStat>({
    total: 0,
    available: 0,
    maintenance: 0,
    booked: 0
  });
  const [recentProperties, setRecentProperties] = useState<PropertyData[]>([]);
  const [error, setError] = useState('');

  // Récupération des données au chargement
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setError('Utilisateur non authentifié ou ID manquant');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const properties = await getPropertiesByOwner(user.id);
        
        // Calculer les statistiques
        const newStats = properties.reduce((acc: PropertyStat, property: PropertyData) => {
          acc.total += 1;
          if (property.status === 'available') acc.available += 1;
          if (property.status === 'maintenance') acc.maintenance += 1;
          if (property.status === 'booked') acc.booked += 1;
          return acc;
        }, {
          total: 0,
          available: 0,
          maintenance: 0,
          booked: 0
        });
        
        setStats(newStats);
        
        // Récupérer les 5 propriétés les plus récentes
        const sorted = [...properties].sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ).slice(0, 5);
        
        setRecentProperties(sorted);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b87f5" />
        <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.prenom} {user?.nom}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/properties/create')}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Tableau de bord</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, styles.primaryCard]}>
                <View style={styles.statIconContainer}>
                  <Home size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total propriétés</Text>
              </View>
              
              <View style={[styles.statCard, styles.successCard]}>
                <View style={styles.statIconContainer}>
                  <Check size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stats.available}</Text>
                <Text style={styles.statLabel}>Disponibles</Text>
              </View>
              
              <View style={[styles.statCard, styles.warningCard]}>
                <View style={styles.statIconContainer}>
                  <AlertTriangle size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stats.maintenance}</Text>
                <Text style={styles.statLabel}>En maintenance</Text>
              </View>
              
              <View style={[styles.statCard, styles.infoCard]}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stats.booked}</Text>
                <Text style={styles.statLabel}>Réservées</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Propriétés récentes</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/(tabs)/properties')}
                >
                  <Text style={styles.viewAllText}>Voir tout</Text>
                </TouchableOpacity>
              </View>

              {recentProperties.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Aucune propriété disponible. Commencez par en ajouter une nouvelle.
                  </Text>
                  <TouchableOpacity 
                    style={styles.addNewButton}
                    onPress={() => router.push('/(tabs)/properties/create')}
                  >
                    <Text style={styles.addButtonText}>Ajouter une propriété</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {recentProperties.map((property, index) => (
                    <TouchableOpacity 
                      key={property.id || index}
                      style={styles.propertyCard}
                      onPress={() => router.push({
                        pathname: '/(tabs)/properties/details',
                        params: { propertyId: property.id }
                      })}
                    >
                      <Image 
                        source={{ uri: property.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }} 
                        style={styles.propertyImage} 
                      />
                      <View style={styles.propertyInfo}>
                        <Text style={styles.propertyTitle}>{property.title}</Text>
                        <Text style={styles.propertyAddress}>{property.address}</Text>
                        <View style={styles.propertyDetails}>
                          <Text style={styles.propertyPrice}>{property.price}€ /mois</Text>
                          <View style={[
                            styles.statusBadge,
                            property.status === 'available' ? styles.availableStatus : 
                            property.status === 'maintenance' ? styles.maintenanceStatus :
                            styles.bookedStatus
                          ]}>
                            <Text style={styles.statusText}>
                              {property.status === 'available' ? 'Disponible' : 
                               property.status === 'maintenance' ? 'Maintenance' :
                               'Réservé'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  header: {
    backgroundColor: '#9b87f5',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: -20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryCard: {
    backgroundColor: '#9b87f5',
  },
  successCard: {
    backgroundColor: '#4CAF50',
  },
  warningCard: {
    backgroundColor: '#FF9800',
  },
  infoCard: {
    backgroundColor: '#2196F3',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    color: '#9b87f5',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#9b87f5',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  availableStatus: {
    backgroundColor: '#E8F5E9',
  },
  maintenanceStatus: {
    backgroundColor: '#FFF3E0',
  },
  bookedStatus: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  addNewButton: {
    backgroundColor: '#9b87f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default OwnerDashboard;
