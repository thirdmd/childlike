import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndkqyoootwimzykmiiub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ka3F5b29vdHdpbXp5a21paXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDAwNDcsImV4cCI6MjA3ODk3NjA0N30.Vq8_R7jIONKDYMKmvEqf2nT88uEm7jy-pZ13aCYwO2I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
