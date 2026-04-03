import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { MOCK_STORES, Store } from '../constants/MockData';
import {
  getProfile,
  createProfile,
  getLoyaltyAccounts,
  upsertLoyaltyAccount,
  getClippedCoupons,
  clipCoupon,
  unclipCoupon,
  getTotalSavings,
  LoyaltyAccount,
} from '../lib/database';

interface User {
  id: string;
  name: string;
  email: string;
  totalSaved: number;
  linkedStores: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  stores: Store[];
  clippedCoupons: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  updateLinkedStores: (stores: Store[]) => Promise<void>;
  toggleCoupon: (couponId: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [clippedCoupons, setClippedCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserData(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserData(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setStores(MOCK_STORES);
        setClippedCoupons([]);
        setHasCompletedOnboarding(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string, email: string) => {
    try {
      // Get profile
      const profile = await getProfile(userId);
      
      // Get loyalty accounts
      const loyaltyAccounts = await getLoyaltyAccounts(userId);
      
      // Get clipped coupons
      const clipped = await getClippedCoupons(userId);
      
      // Get total savings
      const totalSaved = await getTotalSavings(userId);

      // Map loyalty accounts to stores
      const updatedStores = MOCK_STORES.map(store => {
        const account = loyaltyAccounts.find(acc => acc.store_name === store.name);
        return {
          ...store,
          connected: account?.connected || false,
        };
      });

      // Get linked store names
      const linkedStores = loyaltyAccounts
        .filter(acc => acc.connected)
        .map(acc => acc.store_name);

      setUser({
        id: userId,
        name: profile?.name || 'User',
        email: profile?.email || email,
        totalSaved,
        linkedStores,
      });

      setStores(updatedStores);
      setClippedCoupons(clipped);
      
      // If user has linked stores, they've completed onboarding
      if (linkedStores.length > 0) {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (session?.user) {
      await loadUserData(session.user.id, session.user.email || '');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Sign up with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        await createProfile(data.user.id, name, email);
        
        // Initialize default stores in database (all disconnected)
        for (const store of MOCK_STORES) {
          await upsertLoyaltyAccount(data.user.id, store.name, store.loyaltyProgram, false);
        }

        // Load user data
        await loadUserData(data.user.id, email);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id, email);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setStores(MOCK_STORES);
      setClippedCoupons([]);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const updateLinkedStores = async (updatedStores: Store[]) => {
    if (!user) return;

    setLoading(true);
    try {
      // Update each store in database
      for (const store of updatedStores) {
        await upsertLoyaltyAccount(
          user.id,
          store.name,
          store.loyaltyProgram,
          store.connected
        );
      }

      // Update local state
      setStores(updatedStores);

      // Update user's linked stores
      const linkedStoreNames = updatedStores
        .filter(s => s.connected)
        .map(s => s.name);

      setUser({
        ...user,
        linkedStores: linkedStoreNames,
      });
    } catch (error) {
      console.error('Error updating linked stores:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleCoupon = async (couponId: string) => {
    if (!user) return;

    try {
      if (clippedCoupons.includes(couponId)) {
        // Unclip
        await unclipCoupon(user.id, couponId);
        setClippedCoupons(prev => prev.filter(id => id !== couponId));
      } else {
        // Clip
        await clipCoupon(user.id, couponId);
        setClippedCoupons(prev => [...prev, couponId]);
      }
    } catch (error) {
      console.error('Error toggling coupon:', error);
      throw error;
    }
  };

  const updateUserName = async (name: string) => {
    if (!user) return;

    try {
      // Update profile in database
      await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);

      // Update local state
      setUser({ ...user, name });
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        hasCompletedOnboarding,
        stores,
        clippedCoupons,
        loading,
        login,
        signup,
        logout,
        completeOnboarding,
        updateLinkedStores,
        toggleCoupon,
        updateUserName,
        refreshUserData,
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
