
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
  Alert,
  Modal
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { boxShadow } from '../../theme/mixins';

export default function EventManagementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [events, setEvents] = useState([
    { 
      id: '1', 
      title: 'Festival de Carthage', 
      date: '15/07/2023',
      time: '20:00',
      location: 'Théâtre antique de Carthage',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Carthage_-_Antonine_Baths.jpg/640px-Carthage_-_Antonine_Baths.jpg',
      description: 'Concert de musique traditionnelle tunisienne avec les artistes locaux les plus renommés.',
      status: 'approved',
      organizer: 'Ministère de la Culture'
    },
    { 
      id: '2', 
      title: 'Visite guidée de la Médina', 
      date: '22/07/2023',
      time: '10:00',
      location: 'Médina de Tunis',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tunismedina.JPG/640px-Tunismedina.JPG',
      description: 'Découverte des trésors cachés de la Médina avec un guide professionnel.',
      status: 'pending',
      organizer: 'Office du Tourisme de Tunis'
    },
    { 
      id: '3', 
      title: 'Exposition d\'art contemporain', 
      date: '01/08/2023',
      time: '14:00',
      location: 'Musée du Bardo',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Le_Bardo_Museum.jpg/640px-Le_Bardo_Museum.jpg',
      description: 'Exposition des œuvres d\'artistes tunisiens contemporains explorant l\'identité culturelle.',
      status: 'approved',
      organizer: 'Association des Artistes Tunisiens'
    },
    { 
      id: '4', 
      title: 'Journée plage & bien-être', 
      date: '10/08/2023',
      time: '09:00',
      location: 'Plage de La Marsa',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Amphitheatre_El_Jem_Tunisia.jpg/640px-Amphitheatre_El_Jem_Tunisia.jpg',
      description: 'Yoga en plein air, massages et activités aquatiques pour une journée de détente.',
      status: 'rejected',
      organizer: 'Wellness Tunisia'
    },
    { 
      id: '5', 
      title: 'Atelier de cuisine tunisienne', 
      date: '17/08/2023',
      time: '16:00',
      location: 'Centre culturel de Sidi Bou Said',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tunisia-4895_-_Great_Mosque_%287864641392%29.jpg/640px-Tunisia-4895_-_Great_Mosque_%287864641392%29.jpg',
      description: 'Apprenez à préparer des plats traditionnels tunisiens avec un chef local.',
      status: 'pending',
      organizer: 'École de Gastronomie Méditerranéenne'
    }
  ]);

  const filteredEvents = events.filter(event => {
    const matchesQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesQuery;
    return matchesQuery && event.status === filterStatus;
  });

  const handleApproveEvent = (id) => {
    setEvents(
      events.map(event => {
        if (event.id === id) {
          return { ...event, status: 'approved' };
        }
        return event;
      })
    );
  };

  const handleRejectEvent = (id) => {
    setEvents(
      events.map(event => {
        if (event.id === id) {
          return { ...event, status: 'rejected' };
        }
        return event;
      })
    );
  };

  const handleDeleteEvent = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => {
            setEvents(events.filter(event => event.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderEventItem = ({ item }) => (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      style={[
        styles.eventCard, 
        item.status === 'rejected' ? styles.eventCardRejected : 
        item.status === 'pending' ? styles.eventCardPending : styles.eventCard
      ]}
    >
      <TouchableOpacity onPress={() => openEventDetails(item)}>
        <View style={styles.eventImageContainer}>
          <Image source={{ uri: item.image }} style={styles.eventImage} />
          <View style={styles.eventDateOverlay}>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        </View>
        
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{item.title}</Text>
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
          
          <Text style={styles.eventLocation}>{item.location}</Text>
          <Text style={styles.eventOrganizer}>Organisé par: {item.organizer}</Text>
          
          <Text numberOfLines={2} style={styles.eventDescription}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.eventActions}>
        {item.status !== 'approved' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E8F5E9' }]}
            onPress={() => handleApproveEvent(item.id)}
          >
            <Text style={[styles.actionButtonText, { color: '#2E7D32' }]}>Approuver</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'rejected' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
            onPress={() => handleRejectEvent(item.id)}
          >
            <Text style={[styles.actionButtonText, { color: '#C62828' }]}>Rejeter</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
          onPress={() => handleDeleteEvent(item.id)}
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
        <Text style={styles.headerTitle}>Gestion des Événements</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un événement..."
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
          style={[styles.filterTab, filterStatus === 'pending' && styles.filterTabActive]}
          onPress={() => setFilterStatus('pending')}
        >
          <Text style={[styles.filterTabText, filterStatus === 'pending' && styles.filterTabTextActive]}>
            En attente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filterStatus === 'approved' && styles.filterTabActive]}
          onPress={() => setFilterStatus('approved')}
        >
          <Text style={[styles.filterTabText, filterStatus === 'approved' && styles.filterTabTextActive]}>
            Approuvés
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.filter(e => e.status === 'approved').length}</Text>
          <Text style={styles.statLabel}>Approuvés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.filter(e => e.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.filter(e => e.status === 'rejected').length}</Text>
          <Text style={styles.statLabel}>Rejetés</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Event Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <>
                <Image source={{ uri: selectedEvent.image }} style={styles.modalImage} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date & Heure:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.date} à {selectedEvent.time}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Lieu:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.location}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Organisateur:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.organizer}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Statut:</Text>
                    <View style={[
                      styles.statusBadge, 
                      { 
                        backgroundColor: selectedEvent.status === 'approved' ? '#E8F5E9' : 
                                      selectedEvent.status === 'pending' ? '#FFF9C4' : '#FFEBEE'
                      }
                    ]}>
                      <Text style={[
                        styles.statusText, 
                        { 
                          color: selectedEvent.status === 'approved' ? '#2E7D32' : 
                                selectedEvent.status === 'pending' ? '#F57F17' : '#C62828'
                        }
                      ]}>
                        {selectedEvent.status === 'approved' ? 'Approuvé' : 
                        selectedEvent.status === 'pending' ? 'En attente' : 'Rejeté'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.description}>{selectedEvent.description}</Text>
                  </View>
                  
                  <View style={styles.modalActions}>
                    {selectedEvent.status !== 'approved' && (
                      <TouchableOpacity 
                        style={[styles.modalButton, { backgroundColor: '#E8F5E9' }]} 
                        onPress={() => {
                          handleApproveEvent(selectedEvent.id);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={[styles.modalButtonText, { color: '#2E7D32' }]}>Approuver</Text>
                      </TouchableOpacity>
                    )}
                    {selectedEvent.status !== 'rejected' && (
                      <TouchableOpacity 
                        style={[styles.modalButton, { backgroundColor: '#FFEBEE' }]} 
                        onPress={() => {
                          handleRejectEvent(selectedEvent.id);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={[styles.modalButtonText, { color: '#C62828' }]}>Rejeter</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={[styles.modalButton, { backgroundColor: '#FFEBEE' }]} 
                      onPress={() => {
                        handleDeleteEvent(selectedEvent.id);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={[styles.modalButtonText, { color: '#C62828' }]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...boxShadow,
  },
  eventCardPending: {
    backgroundColor: '#FFFDE7',
    borderLeftWidth: 4,
    borderLeftColor: '#F57F17',
  },
  eventCardRejected: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },
  eventImageContainer: {
    position: 'relative',
    height: 120,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventDateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderTopRightRadius: 8,
  },
  eventDate: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.xs,
  },
  eventTime: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
  },
  eventContent: {
    padding: SPACING.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
    marginLeft: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  eventLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  eventOrganizer: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary_dark,
    marginBottom: SPACING.xs,
    fontStyle: 'italic',
  },
  eventDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
    lineHeight: 20,
  },
  eventActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.light_gray,
    padding: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    ...boxShadow,
  },
  modalImage: {
    width: '100%',
    height: 180,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light_gray,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.gray,
  },
  modalBody: {
    padding: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    width: '35%',
  },
  detailValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    flex: 1,
  },
  descriptionContainer: {
    marginVertical: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
  },
});
