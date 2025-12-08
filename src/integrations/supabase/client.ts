import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './env';

/**
 * Supabase client instance
 *
 * If env vars are missing, this will be null. Components should check
 * for this before using Supabase features.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
