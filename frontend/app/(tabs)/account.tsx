import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Account() {
  const router = useRouter();
  const { user, stores, logout, updateLinkedStores } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState('0.5');

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const toggleStoreConnection = (storeId: string) => {
    const updated = stores.map(store =>
      store.id === storeId ? { ...store, connected: !store.connected } : store
    );
    updateLinkedStores(updated);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Linked Accounts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Accounts</Text>
          {stores.map((store) => (
            <View key={store.id} style={styles.storeCard}>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.loyaltyProgram}>{store.loyaltyProgram}</Text>
              </View>
              {store.connected ? (
                <TouchableOpacity
                  style={styles.disconnectButton}
                  onPress={() => toggleStoreConnection(store.id)}
                >
                  <Text style={styles.disconnectButtonText}>Disconnect</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => toggleStoreConnection(store.id)}
                >
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get notified of new deals</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.navy }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Location Alerts</Text>
              <Text style={styles.settingDescription}>Alert when near stores</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: Colors.border, true: Colors.navy }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.radiusSelector}>
            <Text style={styles.radiusLabel}>Geofence Radius</Text>
            <View style={styles.radiusOptions}>
              {['0.25', '0.5', '1'].map((radius) => (
                <TouchableOpacity
                  key={radius}
                  style={[
                    styles.radiusOption,
                    geofenceRadius === radius && styles.radiusOptionActive,
                  ]}
                  onPress={() => setGeofenceRadius(radius)}
                >
                  <Text
                    style={[
                      styles.radiusOptionText,
                      geofenceRadius === radius && styles.radiusOptionTextActive,
                    ]}
                  >
                    {radius} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>FREE PLAN</Text>
            </View>
            <Text style={styles.planName}>Free</Text>
            <Text style={styles.planDescription}>
              Up to 3 stores · 1 weekly QR bundle
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => Alert.alert('Upgrade', 'Premium plans coming soon!')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
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
    paddingBottom: 40,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: Typography.weightBold,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 4,
  },
  email: {
    fontSize: Typography.body,
    color: Colors.subtext,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 16,
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: Typography.cardTitle,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 2,
  },
  loyaltyProgram: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  disconnectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: Colors.secondaryCardBackground,
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: Colors.subtext,
  },
  settingRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: Typography.caption,
    color: Colors.subtext,
  },
  radiusSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  radiusLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 12,
  },
  radiusOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  radiusOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.secondaryCardBackground,
    alignItems: 'center',
  },
  radiusOptionActive: {
    backgroundColor: Colors.navy,
  },
  radiusOptionText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  radiusOptionTextActive: {
    color: '#FFFFFF',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  planBadge: {
    backgroundColor: Colors.secondaryCardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
  },
  planName: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: Colors.navy,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: Typography.body,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: '#FFFFFF',
  },
  signOutButton: {
    marginHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
    color: '#DC2626',
  },
});
