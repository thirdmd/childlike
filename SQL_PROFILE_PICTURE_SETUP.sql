-- PROFILE PICTURE SETUP
-- Ensures user_profiles table has profile_picture_url column
-- Run this in Supabase SQL Editor

-- 1. Add profile_picture_url column if it doesn't exist
alter table if exists public.user_profiles
add column if not exists profile_picture_url text;

-- 2. Ensure RLS is enabled
alter table public.user_profiles enable row level security;

-- 3. Verify existing policies (drop and recreate if needed)
drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

-- Done! The user_profiles table is now ready for profile pictures
