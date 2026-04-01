import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RetailerColors } from '../constants/Colors';

interface StoreBadgeProps {
  storeName: string;
  style?: any;
}

export const StoreBadge: React.FC<StoreBadgeProps> = ({ storeName, style }) => {
  const backgroundColor = RetailerColors[storeName] || '#1A2E44';

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={styles.text}>{storeName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
