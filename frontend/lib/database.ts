import { supabase } from './supabase';
import { Store } from '../constants/MockData';

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface LoyaltyAccount {
  id: string;
  user_id: string;
  store_name: string;
  loyalty_program: string;
  connected: boolean;
  created_at: string;
}

export interface ClippedCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  created_at: string;
}

export interface VisitSession {
  id: string;
  user_id: string;
  store_name: string;
  estimated_savings: number;
  coupon_count: number;
  created_at: string;
}

// Profile operations
export const createProfile = async (userId: string, name: string, email: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, name, email }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Loyalty account operations
export const getLoyaltyAccounts = async (userId: string): Promise<LoyaltyAccount[]> => {
  const { data, error } = await supabase
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const upsertLoyaltyAccount = async (
  userId: string,
  storeName: string,
  loyaltyProgram: string,
  connected: boolean
) => {
  // Check if account already exists
  const { data: existing } = await supabase
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('store_name', storeName)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('loyalty_accounts')
      .update({ connected, loyalty_program: loyaltyProgram })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('loyalty_accounts')
      .insert([{ user_id: userId, store_name: storeName, loyalty_program: loyaltyProgram, connected }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const updateLoyaltyAccountConnection = async (
  userId: string,
  storeName: string,
  connected: boolean
) => {
  const { data, error } = await supabase
    .from('loyalty_accounts')
    .update({ connected })
    .eq('user_id', userId)
    .eq('store_name', storeName)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Clipped coupon operations
export const getClippedCoupons = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('clipped_coupons')
    .select('coupon_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).map(item => item.coupon_id);
};

export const clipCoupon = async (userId: string, couponId: string) => {
  const { data, error } = await supabase
    .from('clipped_coupons')
    .insert([{ user_id: userId, coupon_id: couponId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const unclipCoupon = async (userId: string, couponId: string) => {
  const { error } = await supabase
    .from('clipped_coupons')
    .delete()
    .eq('user_id', userId)
    .eq('coupon_id', couponId);

  if (error) throw error;
};

// Visit session operations
export const createVisitSession = async (
  userId: string,
  storeName: string,
  estimatedSavings: number,
  couponCount: number
) => {
  const { data, error } = await supabase
    .from('visit_sessions')
    .insert([{
      user_id: userId,
      store_name: storeName,
      estimated_savings: estimatedSavings,
      coupon_count: couponCount,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getVisitSessions = async (userId: string): Promise<VisitSession[]> => {
  const { data, error } = await supabase
    .from('visit_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
};

// Calculate total savings from visit sessions
export const getTotalSavings = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('visit_sessions')
    .select('estimated_savings')
    .eq('user_id', userId);

  if (error) throw error;
  
  const total = (data || []).reduce((sum, session) => sum + (session.estimated_savings || 0), 0);
  return total;
};
