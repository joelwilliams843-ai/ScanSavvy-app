import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER, MOCK_STORES, Store, MOCK_COUPONS, Coupon } from '../constants/MockData';

interface User {
  name: string;
  email: string;
  totalSaved: number;
  linkedStores: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  stores: Store[];
  clippedCoupons: string[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  updateLinkedStores: (stores: Store[]) => void;
  toggleCoupon: (couponId: string) => void;
  updateUserName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [clippedCoupons, setClippedCoupons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const onboardingData = await AsyncStorage.getItem('hasCompletedOnboarding');
      const storesData = await AsyncStorage.getItem('stores');
      const clippedData = await AsyncStorage.getItem('clippedCoupons');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (onboardingData) {
        setHasCompletedOnboarding(JSON.parse(onboardingData));
      }
      if (storesData) {
        setStores(JSON.parse(storesData));
      }
      if (clippedData) {
        setClippedCoupons(JSON.parse(clippedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const mockUser = { ...MOCK_USER, email };
    setUser(mockUser);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup - in real app, this would call an API
    const newUser = {
      name,
      email,
      totalSaved: 0,
      linkedStores: [],
    };
    setUser(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    setHasCompletedOnboarding(false);
    setStores(MOCK_STORES);
    setClippedCoupons([]);
    await AsyncStorage.multiRemove(['user', 'hasCompletedOnboarding', 'stores', 'clippedCoupons']);
  };

  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem('hasCompletedOnboarding', JSON.stringify(true));
  };

  const updateLinkedStores = async (updatedStores: Store[]) => {
    setStores(updatedStores);
    await AsyncStorage.setItem('stores', JSON.stringify(updatedStores));
    
    // Update user's linked stores
    if (user) {
      const linkedStoreNames = updatedStores
        .filter(s => s.connected)
        .map(s => s.name);
      const updatedUser = { ...user, linkedStores: linkedStoreNames };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const toggleCoupon = async (couponId: string) => {
    let updated: string[];
    if (clippedCoupons.includes(couponId)) {
      updated = clippedCoupons.filter(id => id !== couponId);
    } else {
      updated = [...clippedCoupons, couponId];
    }
    setClippedCoupons(updated);
    await AsyncStorage.setItem('clippedCoupons', JSON.stringify(updated));
  };

  const updateUserName = async (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasCompletedOnboarding,
        stores,
        clippedCoupons,
        login,
        signup,
        logout,
        completeOnboarding,
        updateLinkedStores,
        toggleCoupon,
        updateUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
