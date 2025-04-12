
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Bell,
  Clock,
  User,
  Filter
} from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import * as Animatable from 'react-native-animatable';

const ReservationManagementScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('pending');
  
  // Mock reservation data
  const mockReservations = {
    pending: [
      { id: 1, name: 'Mohammed Ben Ali', date: '15/03/2025', time: '19:30', people: 4, contact: '+216 22 333 444' },
      { id: 2, name: 'Sarah Trabelsi', date: '16/03/2025', time: '20:00', people: 2, contact: '+216 55 666 777' },
      { id: 3, name: 'Youssef Karim', date: '16/03/2025', time: '13:30', people: 6, contact: '+216 88 999 000' },
    ],
    confirmed: [
      { id: 4, name: 'Amina Salah', date: '17/03/2025', time: '19:00', people: 3, contact: '+216 33 444 555' },
      { id: 5, name: 'Omar Mansour', date: '18/03/2025', time: '12:30', people: 2, contact: '+216 66 777 888' },
    ],
    cancelled: [
      { id: 6, name: 'Leila Ben Hassan', date: '12/03/2025', time: '20:30', people: 5, contact: '+216 99 000 111' },
    ],
  };

  const renderReservationItem = ({ item }) => (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      style={styles.reservationCard}
    >
      <View style={styles.reservationHeader}>
        <View style={styles.userInfo}>
          <User size={18} color={COLORS.primary} />
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <View style={styles.dateTime}>
          <Calendar size={16} color={COLORS.gray} />
          <Text style={styles.dateTimeText}>{item.date}</Text>
          <Clock size={16} color={COLORS.gray} style={{ marginLeft: 8 }} />
          <Text style={styles.dateTimeText}>{item.time}</Text>
        </View>
      </View>
      
      <View style={styles.reservationDetails}>
        <Text style={styles.detailText}>Personnes: {item.people}</Text>
        <Text style={styles.detailText}>Contact: {item.contact}</Text>
      </View>
      
      {activeTab === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
            <CheckCircle size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Accepter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
            <XCircle size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'confirmed' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.notifyButton]}>
            <Bell size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Rappeler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
            <XCircle size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestion des réservations</Text>
        <Text style={styles.subtitle}>Gérez toutes vos réservations</Text>
      </Animatable.View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'pending' && styles.activeTab
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'pending' && styles.activeTabText
            ]}
          >
            En attente ({mockReservations.pending.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'confirmed' && styles.activeTab
          ]}
          onPress={() => setActiveTab('confirmed')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'confirmed' && styles.activeTabText
            ]}
          >
            Confirmées ({mockReservations.confirmed.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'cancelled' && styles.activeTab
          ]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'cancelled' && styles.activeTabText
            ]}
          >
            Annulées ({mockReservations.cancelled.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color={COLORS.primary} />
          <Text style={styles.filterText}>Filtrer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockReservations[activeTab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl * 2 : SPACING.xl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    marginLeft: 4,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  reservationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
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
  reservationHeader: {
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
    color: COLORS.primary,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginLeft: 4,
  },
  reservationDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.light_gray,
    paddingTop: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flex: 1,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  notifyButton: {
    backgroundColor: COLORS.info,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default ReservationManagementScreen;
