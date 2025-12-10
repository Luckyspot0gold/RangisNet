/**
 * Supabase Client for RangisHeartbeat
 * Database integration from Xion hackathon entry
 * 
 * Setup Instructions:
 * 1. Get your keys from: https://supabase.com/dashboard/project/_/settings/api
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  wallet_address?: string;
  premium_tier?: 'basic' | 'pro' | 'enterprise';
  premium_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  coinbase_charge_id: string;
  amount: number;
  currency: string;
  tier: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmed_at?: string;
  created_at: string;
}

export interface VisualizationPreference {
  id: string;
  user_id: string;
  symbol: string;
  mode: 'all' | 'spinor' | 'bloch' | 'torus';
  audio_enabled: boolean;
  haptics_enabled: boolean;
  color_scheme?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Initialize Supabase client (browser-safe)
 */
export function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Initialize Supabase admin client (server-side only)
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase admin not configured');
    return null;
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Update user premium tier
 */
export async function updatePremiumTier(
  userId: string,
  tier: 'basic' | 'pro' | 'enterprise',
  expiresAt: Date
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('user_profiles')
    .update({
      premium_tier: tier,
      premium_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Failed to update premium tier:', error);
    return false;
  }
  
  return true;
}

/**
 * Record payment
 */
export async function recordPayment(payment: Omit<PaymentRecord, 'id' | 'created_at'>): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('payment_records')
    .insert({
      ...payment,
      created_at: new Date().toISOString()
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Failed to record payment:', error);
    return null;
  }
  
  return data.id;
}

/**
 * Save visualization preferences
 */
export async function saveVisualizationPrefs(
  prefs: Omit<VisualizationPreference, 'id' | 'created_at' | 'updated_at'>
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('visualization_preferences')
    .upsert({
      ...prefs,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,symbol'
    });
  
  if (error) {
    console.error('Failed to save preferences:', error);
    return false;
  }
  
  return true;
}

/**
 * Get visualization preferences
 */
export async function getVisualizationPrefs(
  userId: string,
  symbol: string
): Promise<VisualizationPreference | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('visualization_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('symbol', symbol)
    .single();
  
  if (error) {
    console.error('Failed to fetch preferences:', error);
    return null;
  }
  
  return data;
}

/**
 * SQL Schema for Supabase (run this in Supabase SQL Editor):
 * 
 * -- User Profiles
 * CREATE TABLE user_profiles (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email TEXT UNIQUE NOT NULL,
 *   wallet_address TEXT,
 *   premium_tier TEXT CHECK (premium_tier IN ('basic', 'pro', 'enterprise')),
 *   premium_expires_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Payment Records
 * CREATE TABLE payment_records (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
 *   coinbase_charge_id TEXT UNIQUE NOT NULL,
 *   amount NUMERIC(10,2) NOT NULL,
 *   currency TEXT NOT NULL,
 *   tier TEXT NOT NULL,
 *   status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')),
 *   confirmed_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Visualization Preferences
 * CREATE TABLE visualization_preferences (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
 *   symbol TEXT NOT NULL,
 *   mode TEXT CHECK (mode IN ('all', 'spinor', 'bloch', 'torus')),
 *   audio_enabled BOOLEAN DEFAULT true,
 *   haptics_enabled BOOLEAN DEFAULT true,
 *   color_scheme TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, symbol)
 * );
 * 
 * -- Indexes
 * CREATE INDEX idx_payment_records_user_id ON payment_records(user_id);
 * CREATE INDEX idx_payment_records_status ON payment_records(status);
 * CREATE INDEX idx_visualization_prefs_user_id ON visualization_preferences(user_id);
 */

export default getSupabaseClient;
