import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Share,
  ScrollView,
  Image,
  Platform,
  Animated,
} from 'react-native';
import Header from '../Commons/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../common/design';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const RewardScreen = () => {
  const [points] = useState(120);
  const [maxPoints] = useState(500);
  const referralLink = 'flix-pay/awesomeyou-xyz';
  const { t } = useTranslation();

  // Mock data for recent invites with better profile images
  const recentInvites = [
    { id: 1, name: 'Laura', image: 'https://i.pravatar.cc/150?img=44' },
    { id: 2, name: 'Mike', image: 'https://i.pravatar.cc/150?img=68' },
    { id: 3, name: 'Sarah', image: 'https://i.pravatar.cc/150?img=47' },
    { id: 4, name: 'John', image: 'https://i.pravatar.cc/150?img=12' },
    { id: 5, name: 'Maya', image: 'https://i.pravatar.cc/150?img=45' },
  ];

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralLink);
    // Toast notification would be added here
  };

  const shareReferralLink = async () => {
    try {
      const message = `Join me on our app using my referral link: ${referralLink}`;
      const result = await Share.share({
        message,
        title: 'Share Referral Link',
        url: referralLink, // iOS only
      }, {
        dialogTitle: 'Share your referral link', // Android only
        subject: 'Join me on our app', // iOS subject
        tintColor: '#893571', // iOS only
      });
    } catch (error) {
      console.error(error);
    }
  };

  const progressPercentage = (points / maxPoints) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Referral Section */}
          <View style={[styles.card, Shadows.medium]}>
            <Text style={[Typography.h2, styles.title]}>
              Refer your friend & earn 100 points
            </Text>
            
            <View style={styles.referralLinkContainer}>
              <Text style={[Typography.bodyMedium, styles.referralLink]}>
                {referralLink}
              </Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                <Icon name="copy-outline" size={20} color="#893571" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.shareButton}
              onPress={shareReferralLink}
            >
              <Icon name="share-social-outline" size={20} color="#FFFFFF" style={styles.shareIcon} />
              <Text style={styles.shareButtonText}>Share with Friends</Text>
            </TouchableOpacity>
          </View>

          {/* Points Section */}
          <View style={[styles.card, Shadows.medium]}>
            <View style={styles.pointsHeader}>
              <Icon name="star" size={24} color="#FFD700" />
              <Text style={[Typography.h3, styles.pointsTitle]}>Reward Points</Text>
            </View>
            
            <View style={styles.pointsCardInner}>
              <View style={styles.pointsVisual}>
                <View style={styles.pointsTextContainer}>
                  <Text style={styles.currentPoints}>{points}</Text>
                  <Text style={styles.maxPoints}>/{maxPoints}</Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${progressPercentage}%` }
                    ]} 
                  />
                  <View style={styles.progressMarker} />
                </View>
              </View>
            </View>

            {/* Recent Invites Section */}
            <View style={styles.recentInvitesSection}>
              <Text style={[Typography.h3, styles.recentInvitesTitle]}>Recent Invites</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.invitesContainer}>
                  {recentInvites.map((invite, index) => (
                    <View key={invite.id} style={[
                      styles.inviteItem,
                      index > 0 && styles.inviteItemOverlap
                    ]}>
                      <Image 
                        source={{ uri: invite.image }} 
                        style={styles.inviteImage} 
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, Shadows.small]}>
              <Icon name="time-outline" size={24} color="#893571" />
              <Text style={[Typography.labelMedium, styles.actionText]}>Activity</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, Shadows.small]}>
              <Icon name="gift-outline" size={24} color="#893571" />
              <Text style={[Typography.labelMedium, styles.actionText]}>How to Earn</Text>
            </TouchableOpacity>
          </View>

          {/* Rewards Section */}
          <View style={styles.rewardsHeader}>
            <Text style={[Typography.h2, styles.rewardsTitle]}>Available Rewards</Text>
            <TouchableOpacity>
              <Text style={[Typography.labelMedium, styles.seeAllText]}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Example Reward Item */}
          <View style={[styles.rewardCard, Shadows.small]}>
            <View style={styles.rewardInfo}>
              <View style={styles.rewardIconContainer}>
                <Icon name="pricetag-outline" size={24} color="#893571" />
              </View>
              <View>
                <Text style={[Typography.labelLarge, styles.rewardName]}>5% Off next purchase</Text>
                <Text style={[Typography.bodySmall, styles.rewardPoints]}>17/17 points to redeem</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemButtonText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    color: '#333333',
    marginBottom: Spacing.md,
    fontSize: 22,
    textAlign: 'center',
  },
  referralLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  referralLink: {
    flex: 1,
    color: '#666666',
  },
  copyButton: {
    padding: Spacing.xs,
  },
  shareButton: {
    backgroundColor: '#893571',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pointsTitle: {
    color: '#333333',
    marginLeft: Spacing.sm,
    fontSize: 18,
  },
  pointsCardInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  pointsVisual: {
    alignItems: 'flex-start', // Changed to left alignment
  },
  pointsTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  currentPoints: {
    fontSize: 32, // Reduced from 40
    fontWeight: '700',
    color: '#893571',
  },
  maxPoints: {
    fontSize: 20, // Reduced from 24
    color: '#666666',
    fontWeight: '500',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 8, // Reduced from 12
    backgroundColor: '#F0F0F0',
    borderRadius: BorderRadius.round,
    width: '100%',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#893571',
    borderRadius: BorderRadius.round,
  },
  progressMarker: {
    position: 'absolute',
    right: 0,
    top: -4,
    width: 16, // Reduced from 20
    height: 16, // Reduced from 20
    backgroundColor: '#893571',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  recentInvitesSection: {
    marginTop: Spacing.md,
  },
  recentInvitesTitle: {
    marginBottom: Spacing.sm,
    color: '#333333',
    fontSize: 18,
  },
  invitesContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  inviteItem: {
    alignItems: 'center',
  },
  inviteItemOverlap: {
    marginLeft: -20, // Increased overlap
  },
  inviteImage: {
    width: 45, // Slightly reduced
    height: 45, // Slightly reduced
    borderRadius: 23,
    marginBottom: Spacing.xs,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Shadows.small,
  },
  inviteName: {
    color: '#666666',
    fontSize: 12,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  actionText: {
    color: '#333333',
    marginTop: Spacing.xs,
  },
  rewardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rewardsTitle: {
    color: '#333333',
    fontSize: 20,
  },
  seeAllText: {
    color: '#893571',
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rewardName: {
    color: '#333333',
  },
  rewardPoints: {
    color: '#666666',
  },
  redeemButton: {
    backgroundColor: '#893571',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default RewardScreen;