import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
  Required Supabase Tables (run these SQL commands in your Supabase SQL editor):

  -- Contact Messages Table
  create table if not exists contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    created_at timestamptz default now()
  );

  -- Waitlist Signups Table
  create table if not exists waitlist_signups (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    source text,
    created_at timestamptz default now()
  );

  -- Optional: Add RLS policies if needed
  -- alter table contact_messages enable row level security;
  -- alter table waitlist_signups enable row level security;
  
  -- For public insert access (adjust based on your security needs):
  -- create policy "Allow public inserts" on contact_messages for insert with check (true);
  -- create policy "Allow public inserts" on waitlist_signups for insert with check (true);
*/
