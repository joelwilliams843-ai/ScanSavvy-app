import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Store } from '../constants/MockData';

export default function LinkStores() {
  const router = useRouter();
  const { stores, updateLinkedStores, completeOnboarding } = useAuth();
  const [localStores, setLocalStores] = useState(stores);

  const toggleStore = (storeId: string) => {
    const updated = localStores.map(store =>
      store.id === storeId ? { ...store, connected: !store.connected } : store
    );
    setLocalStores(updated);
    updateLinkedStores(updated);
  };

  const handleContinue = () => {
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const hasConnectedStores = localStores.some(s => s.connected);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Link Your Store Accounts</Text>
        <Text style={styles.subheading}>
          Connect your loyalty accounts so we can auto-clip coupons for you.
        </Text>

        <View style={styles.storeList}>
          {localStores.map((store) => (
            <View key={store.id} style={styles.storeCard}>
              <View style={styles.storeInfo}>
                <Text style={[styles.storeName, { color: Colors.navy }]}>
                  {store.name}
                </Text>
                <Text style={styles.loyaltyProgram}>{store.loyaltyProgram}</Text>
              </View>

              {store.connected ? (
                <View style={styles.connectedContainer}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.successGreen} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => toggleStore(store.id)}
                >
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!hasConnectedStores}
          style={styles.continueButton}
        />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  heading: {
    fontSize: Typography.heroHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 12,
  },
  subheading: {
    fontSize: Typography.body,
    color: Colors.subtext,
    marginBottom: 32,
    lineHeight: 22,
  },
  storeList: {
    gap: 12,
  },
  storeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: Typography.cardTitle,
    fontWeight: Typography.weightBold,
    marginBottom: 4,
  },
  loyaltyProgram: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
  connectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: Colors.successGreen,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  continueButton: {
    marginBottom: 12,
  },
  skipText: {
    fontSize: Typography.body,
    color: Colors.subtext,
    textAlign: 'center',
  },
});
