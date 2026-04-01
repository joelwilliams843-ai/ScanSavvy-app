import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { CouponCard } from '../../components/CouponCard';
import { MOCK_COUPONS, CATEGORIES } from '../../constants/MockData';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const STORES = ['All', 'Walmart', 'Target', 'Kroger', 'CVS', 'Walgreens'];

export default function Coupons() {
  const { clippedCoupons, toggleCoupon } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');

  // Filter coupons
  let filteredCoupons = MOCK_COUPONS;

  if (searchQuery) {
    filteredCoupons = filteredCoupons.filter(
      (c) =>
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.store.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory !== 'All') {
    filteredCoupons = filteredCoupons.filter((c) => c.category === selectedCategory);
  }

  if (selectedStore !== 'All') {
    filteredCoupons = filteredCoupons.filter((c) => c.store === selectedStore);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Browse Coupons</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search coupons..."
            placeholderTextColor={Colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterPill,
              selectedCategory === category && styles.filterPillActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCategory === category && styles.filterPillTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Store Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STORES.map((store) => (
          <TouchableOpacity
            key={store}
            style={[
              styles.storePill,
              selectedStore === store && styles.storePillActive,
            ]}
            onPress={() => setSelectedStore(store)}
          >
            <Text
              style={[
                styles.storePillText,
                selectedStore === store && styles.storePillTextActive,
              ]}
            >
              {store}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Coupon List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listHeader}>
          <Text style={styles.resultCount}>
            {filteredCoupons.length} {filteredCoupons.length === 1 ? 'coupon' : 'coupons'}
          </Text>
        </View>

        {filteredCoupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            showClipButton
            isClipped={clippedCoupons.includes(coupon.id)}
            onClipToggle={() => toggleCoupon(coupon.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heading: {
    fontSize: Typography.heroHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.navy,
  },
  filterRow: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.secondaryCardBackground,
  },
  filterPillActive: {
    backgroundColor: Colors.navy,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.navy,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  storePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storePillActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  storePillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.navy,
  },
  storePillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
});
