import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coupon } from '../constants/MockData';
import { Colors, RetailerColors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface CouponCardProps {
  coupon: Coupon;
  onPress?: () => void;
  showClipButton?: boolean;
  isClipped?: boolean;
  onClipToggle?: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onPress,
  showClipButton = false,
  isClipped = false,
  onClipToggle,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={[styles.storeName, { color: RetailerColors[coupon.store] || Colors.navy }]}>
          {coupon.store}
        </Text>
        {coupon.badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: coupon.badge === 'HOT' ? Colors.hotBadgeBg : Colors.newBadgeBg,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: coupon.badge === 'HOT' ? Colors.hotBadgeText : Colors.newBadgeText,
                },
              ]}
            >
              {coupon.badge}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.discount}>{coupon.discount}</Text>
      <Text style={styles.description}>{coupon.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.claimed}>🔥 {coupon.claimed.toLocaleString()} claimed today</Text>
        {showClipButton && onClipToggle && (
          <TouchableOpacity
            style={[styles.clipButton, isClipped && styles.clippedButton]}
            onPress={onClipToggle}
          >
            <Text style={[styles.clipButtonText, isClipped && styles.clippedButtonText]}>
              {isClipped ? 'Clipped ✓' : 'Clip'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: Typography.cardTitle,
    fontWeight: Typography.weightBold,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: Typography.weightBold,
  },
  discount: {
    fontSize: 24,
    fontWeight: Typography.weightExtraBold,
    color: Colors.navy,
    marginBottom: 4,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.subtext,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  claimed: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
  clipButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  clippedButton: {
    backgroundColor: Colors.navy,
  },
  clipButtonText: {
    fontSize: 13,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  clippedButtonText: {
    color: '#FFFFFF',
  },
});
