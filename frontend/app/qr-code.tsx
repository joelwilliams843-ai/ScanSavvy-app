import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Brightness from 'expo-brightness';
import { Logo } from '../components/Logo';
import { createVisitSession } from '../lib/database';

export default function QRCodeScreen() {
  const router = useRouter();
  const { user, clippedCoupons } = useAuth();
  const [loading, setLoading] = useState(true);
  const [originalBrightness, setOriginalBrightness] = useState(0.5);
  const [expanded, setExpanded] = useState(false);

  // Mock data for demonstration
  const storeName = 'Kroger';
  const estimatedSavings = 47.50;
  const couponCount = 12;
  const expiresInHours = 5;
  const expiresInMinutes = 42;

  // QR Code data
  const qrData = `scansavvy://redeem?store=${storeName.toLowerCase()}&session=demo2024&user=${user?.name || 'demo'}`;

  useEffect(() => {
    // Save original brightness and set to max
    const setupBrightness = async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          const current = await Brightness.getBrightnessAsync();
          setOriginalBrightness(current);
          await Brightness.setBrightnessAsync(1.0);
        }
      } catch (error) {
        console.log('Brightness error:', error);
      }
    };

    setupBrightness();

    // Simulate loading coupons
    const timer = setTimeout(async () => {
      setLoading(false);
      
      // Save visit session to database when QR code is generated
      if (user) {
        try {
          await createVisitSession(user.id, storeName, estimatedSavings, couponCount);
          console.log('Visit session saved to database');
        } catch (error) {
          console.error('Error saving visit session:', error);
        }
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      // Restore original brightness
      Brightness.setBrightnessAsync(originalBrightness);
    };
  }, [user]);

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={Colors.navy} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <View style={styles.storeHeader}>
            <Text style={[styles.storeName, { color: Colors.kroger }]}>{storeName}</Text>
          </View>
          <ActivityIndicator size="large" color={Colors.navy} style={styles.spinner} />
          <Text style={styles.loadingText}>Coupons clipping...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.storeHeader}>
          <Text style={[styles.storeName, { color: Colors.kroger }]}>{storeName}</Text>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <Logo size={32} showWordmark={false} />
            <Text style={styles.qrTitle}>My Coupons</Text>
          </View>

          <Text style={styles.weekLabel}>Week of {getCurrentWeek()}</Text>

          <View style={styles.qrCodeContainer}>
            <QRCode value={qrData} size={220} />
          </View>

          <View style={styles.divider} />

          <Text style={styles.savingsAmount}>${estimatedSavings.toFixed(2)}</Text>
          <Text style={styles.savingsLabel}>estimated savings</Text>
          <Text style={styles.couponInfo}>
            {couponCount} coupons · 1 store
          </Text>
        </View>

        {/* Timer and Info */}
        <View style={styles.infoSection}>
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={16} color={Colors.subtext} />
            <Text style={styles.timerText}>
              Expires in {expiresInHours}h {expiresInMinutes}m
            </Text>
          </View>

          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.expandButtonText}>View Clipped Coupons</Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.navy}
            />
          </TouchableOpacity>

          {expanded && (
            <View style={styles.couponList}>
              <Text style={styles.couponListTitle}>Clipped Coupons ({couponCount})</Text>
              {[
                'BOGO Free Select Snacks & Beverages',
                '20% OFF Organic Produce',
                '$5 OFF $25 Purchase',
                '$3 OFF Any 2 Participating Items',
                '30% OFF Store Brand Products',
              ].map((coupon, index) => (
                <View key={index} style={styles.couponListItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.successGreen} />
                  <Text style={styles.couponListItemText}>{coupon}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.brightnessNote}>
            <Ionicons name="sunny-outline" size={16} color={Colors.subtext} />
            <Text style={styles.brightnessNoteText}>Brightness auto-set for scanning</Text>
          </View>
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  storeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  storeName: {
    fontSize: 28,
    fontWeight: Typography.weightBold,
  },
  spinner: {
    marginVertical: 24,
  },
  loadingText: {
    fontSize: Typography.body,
    color: Colors.subtext,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.navy,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  weekLabel: {
    fontSize: Typography.caption,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 20,
  },
  savingsAmount: {
    fontSize: 40,
    fontWeight: Typography.weightExtraBold,
    color: Colors.navy,
    textAlign: 'center',
  },
  savingsLabel: {
    fontSize: Typography.body,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 8,
  },
  couponInfo: {
    fontSize: Typography.caption,
    color: Colors.subtext,
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  timerText: {
    fontSize: Typography.body,
    color: Colors.subtext,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    gap: 8,
    marginBottom: 16,
  },
  expandButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  couponList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  couponListTitle: {
    fontSize: Typography.cardTitle,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 12,
  },
  couponListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  couponListItemText: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.bodyText,
  },
  brightnessNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  brightnessNoteText: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
});
