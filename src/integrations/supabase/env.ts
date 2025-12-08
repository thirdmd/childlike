/**
 * Supabase environment variable loader
 *
 * Required environment variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anon public key
 *
 * Local development: Add to .env file
 * Vercel production: Add to Project Settings > Environment Variables
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log warnings but don't crash - let components handle gracefully
if (!supabaseUrl) {
  console.error(
    '❌ Missing VITE_SUPABASE_URL\n' +
    'This is required for the app to work.\n' +
    'Local: Add to .env file\n' +
    'Vercel: Add to Project Settings > Environment Variables'
  );
}

if (!supabaseAnonKey) {
  console.error(
    '❌ Missing VITE_SUPABASE_ANON_KEY\n' +
    'This is required for the app to work.\n' +
    'Local: Add to .env file\n' +
    'Vercel: Add to Project Settings > Environment Variables'
  );
}

export { supabaseUrl, supabaseAnonKey };
