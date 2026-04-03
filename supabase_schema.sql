-- ScanSavvy Supabase Database Schema
-- Run this in your Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (stores additional user info)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Loyalty Accounts table (stores connected stores)
CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  loyalty_program TEXT NOT NULL,
  connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, store_name)
);

-- Enable Row Level Security
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;

-- Loyalty accounts policies
CREATE POLICY "Users can view own loyalty accounts" ON public.loyalty_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loyalty accounts" ON public.loyalty_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loyalty accounts" ON public.loyalty_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loyalty accounts" ON public.loyalty_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Clipped Coupons table (stores user's clipped coupons)
CREATE TABLE IF NOT EXISTS public.clipped_coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  coupon_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, coupon_id)
);

-- Enable Row Level Security
ALTER TABLE public.clipped_coupons ENABLE ROW LEVEL SECURITY;

-- Clipped coupons policies
CREATE POLICY "Users can view own clipped coupons" ON public.clipped_coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clipped coupons" ON public.clipped_coupons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clipped coupons" ON public.clipped_coupons
  FOR DELETE USING (auth.uid() = user_id);

-- Visit Sessions table (stores QR code generation sessions)
CREATE TABLE IF NOT EXISTS public.visit_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  estimated_savings NUMERIC(10, 2) DEFAULT 0,
  coupon_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.visit_sessions ENABLE ROW LEVEL SECURITY;

-- Visit sessions policies
CREATE POLICY "Users can view own visit sessions" ON public.visit_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visit sessions" ON public.visit_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS loyalty_accounts_user_id_idx ON public.loyalty_accounts(user_id);
CREATE INDEX IF NOT EXISTS clipped_coupons_user_id_idx ON public.clipped_coupons(user_id);
CREATE INDEX IF NOT EXISTS visit_sessions_user_id_idx ON public.visit_sessions(user_id);
CREATE INDEX IF NOT EXISTS visit_sessions_created_at_idx ON public.visit_sessions(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_loyalty_accounts_updated_at
  BEFORE UPDATE ON public.loyalty_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Success message
SELECT 'ScanSavvy database schema created successfully!' as message;
