/**
 * Supabase environment variable loader
 * Validates and exports required Supabase configuration from environment variables
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing required environment variable: VITE_SUPABASE_URL. ' +
    'Please ensure it is defined in your .env file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing required environment variable: VITE_SUPABASE_ANON_KEY. ' +
    'Please ensure it is defined in your .env file.'
  );
}

export { supabaseUrl, supabaseAnonKey };
