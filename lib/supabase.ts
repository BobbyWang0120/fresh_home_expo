/**
 * Supabase Client Configuration
 * 
 * This file sets up and exports the Supabase client instance for database interactions.
 * 
 * Key Dependencies:
 * - @supabase/supabase-js: Main Supabase client library
 * 
 * Usage:
 * Import the supabase client instance where needed:
 * import { supabase } from '../lib/supabase'
 */

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
