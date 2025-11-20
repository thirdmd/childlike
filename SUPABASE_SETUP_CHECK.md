# Supabase Setup Verification Checklist

Use this checklist to verify your Supabase is configured correctly for profile pictures.

## ✅ Step 1: Check Storage Bucket

1. Go to Supabase Dashboard → Your Project
2. Click **Storage** in left sidebar
3. Look for a bucket named: **`user_profiles`** (with underscore, NOT hyphen)

**If it doesn't exist:**
- Click "Create bucket"
- Name: `user_profiles`
- Public: **NO** (keep it private for security)
- Click "Create"

## ✅ Step 2: Check Storage Policies

1. Click on the `user_profiles` bucket
2. Click **Policies** tab
3. You should see these 3 policies:

### Policy 1: Users can upload own profile picture
```sql
create policy "Users can upload own profile picture"
  on storage.objects for insert
  with check (bucket_id = 'user_profiles' and auth.uid() = (storage.foldername(name))[1]::uuid);
```

### Policy 2: Users can update own profile picture
```sql
create policy "Users can update own profile picture"
  on storage.objects for update
  using (bucket_id = 'user_profiles' and auth.uid() = (storage.foldername(name))[1]::uuid);
```

### Policy 3: Authenticated users can see all profile pictures
```sql
create policy "Authenticated users can see all profile pictures"
  on storage.objects for select
  using (bucket_id = 'user_profiles');
```

**If missing:** Click "New Policy" → "For full customization" → Paste SQL above

## ✅ Step 3: Check Database Table

1. Go to **Table Editor** in left sidebar
2. Look for table: **`user_profiles`**
3. Check these columns exist:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `email` (text)
   - `full_name` (text, nullable)
   - `phone` (text, nullable)
   - **`profile_picture_url` (text, nullable)** ← IMPORTANT!
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

**If `profile_picture_url` is missing:**
- Run this SQL in SQL Editor:
```sql
alter table public.user_profiles
  add column if not exists profile_picture_url text;
```

## ✅ Step 4: Check Table RLS Policies

1. Click on `user_profiles` table
2. Check **RLS is enabled**
3. You should have these policies:

### Users can view own profile
```sql
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);
```

### Users can update own profile
```sql
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);
```

## ✅ Step 5: Check Realtime (for auto-sync)

1. Go to **Database** → **Replication**
2. Find `user_profiles` table
3. Make sure **Realtime** is **enabled**

**If disabled:** Click the toggle to enable it

## ✅ Step 6: Test Upload with Console Logs

1. Open your app
2. Open browser console (F12 or Cmd+Shift+I)
3. Go to Account page
4. Click camera icon
5. Upload a picture
6. Watch the console for these logs:

```
=== ACCOUNT: Starting upload ===
Cropped blob size: XXX KB
Created file: profile.jpg image/jpeg
User ID: xxxxx-xxxx-xxxx
=== UPLOAD START ===
File: profile.jpg image/jpeg XX.XX KB
Upload path: profile-pictures/xxxxx-timestamp.jpg
Uploading to storage bucket: user_profiles
Upload successful: { path: "..." }
Public URL: https://...
Updating database...
Database update result: { updateData: [...], updateError: null }
=== UPLOAD SUCCESS ===
Upload result: { success: true, url: "..." }
=== REFRESH PROFILE START ===
Fetching profile for user: xxxxx
Profile fetch result: { data: {...profile_picture_url: "..."}, profileError: null }
Setting profile: {...}
Profile state updated
=== REFRESH PROFILE END ===
```

## ⚠️ Common Errors & Solutions

### Error: "new row violates row-level security policy"
**Solution:** Check RLS policies on `user_profiles` table

### Error: "The resource you are looking for could not be found"
**Solution:** Bucket `user_profiles` doesn't exist - create it

### Error: "new row violates row-level security policy for table storage.objects"
**Solution:** Storage bucket policies are missing - add them

### Upload succeeds but picture doesn't show
**Solution:**
1. Check if `profile_picture_url` column exists
2. Check browser console for real-time subscription status
3. Verify Realtime is enabled on `user_profiles` table

### Database update returns null
**Solution:** RLS policy blocks update - check "Users can update own profile" policy

---

## Quick SQL Setup (Run all at once)

If you want to set everything up at once, run this in SQL Editor:

```sql
-- Ensure column exists
alter table public.user_profiles
  add column if not exists profile_picture_url text;

-- Enable RLS on table
alter table public.user_profiles enable row level security;

-- Table policies
drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

-- Storage policies
drop policy if exists "Users can upload own profile picture" on storage.objects;
create policy "Users can upload own profile picture"
  on storage.objects for insert
  with check (bucket_id = 'user_profiles' and auth.uid() = (storage.foldername(name))[1]::uuid);

drop policy if exists "Users can update own profile picture" on storage.objects;
create policy "Users can update own profile picture"
  on storage.objects for update
  using (bucket_id = 'user_profiles' and auth.uid() = (storage.foldername(name))[1]::uuid);

drop policy if exists "Authenticated users can see all profile pictures" on storage.objects;
create policy "Authenticated users can see all profile pictures"
  on storage.objects for select
  using (bucket_id = 'user_profiles');
```

**After running SQL:**
- Create storage bucket `user_profiles` manually in UI
- Enable Realtime on `user_profiles` table

---

**Status:** Run through this checklist and report which step fails!
