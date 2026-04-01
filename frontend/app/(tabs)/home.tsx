import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { CouponCard } from '../../components/CouponCard';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COUPONS, COMMUNITY_STATS, MOCK_ACTIVITY } from '../../constants/MockData';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showNearbyStore, setShowNearbyStore] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const trendingDeals = MOCK_COUPONS.slice(0, 4);
  const totalCoupons = MOCK_COUPONS.length;
  const totalStores = 5;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {user?.name || 'there'}! 👋</Text>
            <Text style={styles.subtitle}>
              You have {totalCoupons} coupons ready across {totalStores} stores
            </Text>
          </View>
        </View>

        {/* Nearby Store Banner */}
        {showNearbyStore && (
          <View style={styles.nearbyBanner}>
            <View style={styles.nearbyContent}>
              <Ionicons name="location" size={24} color="#FFFFFF" />
              <View style={styles.nearbyText}>
                <Text style={styles.nearbyStore}>Kroger</Text>
                <Text style={styles.nearbyLabel}>Nearby</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.nearbyButton}
              onPress={() => router.push('/qr-code')}
            >
              <Text style={styles.nearbyButtonText}>Get My Coupons →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trending Deals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={20} color={Colors.navy} />
            <Text style={styles.sectionTitle}>Trending Deals</Text>
          </View>
          {trendingDeals.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </View>

        {/* Community Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color={Colors.navy} />
            <Text style={styles.sectionTitle}>Your Area This Week</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${COMMUNITY_STATS.totalSaved.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Saved by local shoppers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{COMMUNITY_STATS.couponsRedeemed.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Coupons redeemed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${COMMUNITY_STATS.avgSavings}</Text>
              <Text style={styles.statLabel}>Avg savings per trip</Text>
            </View>
          </View>
        </View>

        {/* Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Near You</Text>
          {MOCK_ACTIVITY.map((activity, index) => (
            <View key={index} style={styles.activityRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{activity.name.charAt(0)}</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  {' '}saved{' '}
                  <Text style={styles.activityAmount}>${activity.amount}</Text>
                  {' '}this month
                </Text>
                <Text style={styles.activityStores}>
                  {activity.stores.join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: Typography.heroHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.subtext,
  },
  nearbyBanner: {
    backgroundColor: Colors.navy,
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nearbyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nearbyText: {
    marginLeft: 12,
  },
  nearbyStore: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: '#FFFFFF',
  },
  nearbyLabel: {
    fontSize: Typography.caption,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  nearbyButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
  },
  nearbyButtonText: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginLeft: 8,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.secondaryCardBackground,
    borderRadius: 12,
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: Typography.weightExtraBold,
    color: Colors.navy,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: '#FFFFFF',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: Typography.body,
    color: Colors.bodyText,
    marginBottom: 2,
  },
  activityName: {
    fontWeight: Typography.weightBold,
  },
  activityAmount: {
    fontWeight: Typography.weightBold,
  },
  activityStores: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
});
