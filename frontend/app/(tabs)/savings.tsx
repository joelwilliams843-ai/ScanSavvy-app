import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { MOCK_SAVINGS_VISITS } from '../../constants/MockData';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { RetailerColors } from '../../constants/Colors';

export default function Savings() {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Your Savings</Text>
        </View>

        {/* Hero Stat */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total saved with ScanSavvy</Text>
          <Text style={styles.heroValue}>${user?.totalSaved?.toFixed(2) || '0.00'}</Text>
        </View>

        {/* Monthly Chart Placeholder */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Savings</Text>
          <View style={styles.chartPlaceholder}>
            {/* Simple bar chart visualization */}
            <View style={styles.barContainer}>
              {[45, 78, 62, 89, 56].map((height, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${height}%`, backgroundColor: Colors.navy },
                    ]}
                  />
                  <Text style={styles.barLabel}>
                    {['Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Visit History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Visits</Text>
          {MOCK_SAVINGS_VISITS.map((visit) => (
            <View key={visit.id} style={styles.visitCard}>
              <View style={styles.visitHeader}>
                <Text
                  style={[
                    styles.visitStore,
                    { color: RetailerColors[visit.store] || Colors.navy },
                  ]}
                >
                  {visit.store}
                </Text>
                <Text style={styles.visitDate}>{formatDate(visit.date)}</Text>
              </View>
              <Text style={styles.visitDetails}>
                {visit.couponsUsed} coupons · ${visit.amountSaved.toFixed(2)} saved
              </Text>
              <View style={styles.visitCoupons}>
                {visit.coupons.map((coupon, index) => (
                  <Text key={index} style={styles.couponTag}>
                    {coupon}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => alert('Share feature coming soon!')}
        >
          <Ionicons name="share-social-outline" size={20} color={Colors.navy} />
          <Text style={styles.shareButtonText}>Share My Savings</Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  heading: {
    fontSize: Typography.heroHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroLabel: {
    fontSize: Typography.body,
    color: Colors.subtext,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: Typography.weightExtraBold,
    color: Colors.successGreen,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: Typography.cardTitle,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 24,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: 32,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.subtext,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 16,
  },
  visitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  visitStore: {
    fontSize: Typography.cardTitle,
    fontWeight: Typography.weightBold,
  },
  visitDate: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
  visitDetails: {
    fontSize: Typography.body,
    color: Colors.subtext,
    marginBottom: 10,
  },
  visitCoupons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  couponTag: {
    fontSize: 12,
    color: Colors.navy,
    backgroundColor: Colors.secondaryCardBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.navy,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
});
