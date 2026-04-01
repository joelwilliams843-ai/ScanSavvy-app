import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showWordmark = true }) => {
  const logoSize = size === 'small' ? 40 : size === 'large' ? 80 : 60;
  const fontSize = size === 'small' ? 18 : size === 'large' ? 28 : 22;

  return (
    <View style={styles.container}>
      <View style={[styles.logoMark, { width: logoSize, height: logoSize }]}>
        <Text style={[styles.arrow, { fontSize: logoSize * 0.5 }]}>›</Text>
      </View>
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
  logoMark: {
    backgroundColor: Colors.navy,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  wordmark: {
    color: Colors.navy,
    fontWeight: '700',
  },
});
