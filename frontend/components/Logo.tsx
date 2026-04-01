import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | number;
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showWordmark = true }) => {
  // Handle both named sizes and custom pixel sizes
  const logoSize = typeof size === 'number' 
    ? size 
    : size === 'small' ? 40 : size === 'large' ? 80 : 60;
  const fontSize = typeof size === 'number'
    ? 22
    : size === 'small' ? 18 : size === 'large' ? 28 : 22;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://scansavvy.app/assets/scansavvy-logo.png' }}
        style={{ width: logoSize, height: logoSize }}
        resizeMode="contain"
      />
      {showWordmark && (
        <Text style={[styles.wordmark, { fontSize }]}>ScanSavvy</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    color: Colors.navy,
    fontWeight: '700',
  },
});
