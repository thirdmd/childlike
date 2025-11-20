# Childlike Setup Instructions

## Required Supabase Configuration

### 1. Profile Picture Setup (SQL)

Run the SQL in `SQL_PROFILE_PICTURE_SETUP.sql` in your Supabase SQL Editor:
- Adds `profile_picture_url` column to `user_profiles` table
- Ensures RLS policies are correct
- Ready for picture uploads

**Steps:**
1. Go to Supabase Dashboard → Your Project
2. Click "SQL Editor" in left sidebar
3. Click "+ New Query"
4. Copy and paste contents of `SQL_PROFILE_PICTURE_SETUP.sql`
5. Click "Run"

### 2. Create Storage Bucket for Profile Pictures

You need to create a `user-profiles` storage bucket for picture uploads.

**Steps:**
1. Go to Supabase Dashboard → Your Project
2. Click "Storage" in left sidebar
3. Click "Create a new bucket"
4. Name: `user-profiles`
5. Check "Private" (important for security)
6. Click "Create bucket"
7. Click on the bucket, then "Policies" tab
8. Add policy for authenticated users:
   - Click "Create policy"
   - Choose "For full customization use SQL editor"
   - Use this policy:
```sql
create policy "Users can upload own profile picture"
  on storage.objects for insert
  with check (bucket_id = 'user-profiles' and auth.uid() = (storage.foldername(name))[1]::uuid);

create policy "Users can read own profile picture"
  on storage.objects for select
  using (bucket_id = 'user-profiles' and auth.uid() = (storage.foldername(name))[1]::uuid);

create policy "Authenticated users can see all profile pictures"
  on storage.objects for select
  using (bucket_id = 'user-profiles');
```

### 3. Cart Persistence Setup (SQL)

Run the SQL in `SQL_USER_CARTS.sql` in your Supabase SQL Editor:
- Creates `user_carts` table for storing shopping carts
- Enables RLS for security
- Cart will persist across login/logout sessions

**Steps:** (same as step 1, but use `SQL_USER_CARTS.sql`)

## Features Now Enabled

✅ **Profile Pictures**
- Users can upload profile pictures via drag-and-drop or file input
- Pictures stored securely in Supabase Storage
- URL saved in database
- Displayed in Account page and Header

✅ **Nickname Updates**
- Users can edit their nickname
- Changes display immediately after saving
- Calls `refreshProfile()` to sync with database

✅ **Password Management**
- Two-step verification (verify old password first)
- Secure password change with validation
- Loading states and error handling

✅ **Cart Persistence**
- Anonymous users: cart stored in localStorage
- Authenticated users: cart synced to database
- On login: local cart merged with database cart
- On logout: cart cleared from localStorage (database preserved)

## Testing Checklist

1. **Profile Picture Upload**
   - [ ] Go to Account page while logged in
   - [ ] Click camera icon on avatar
   - [ ] Select an image file
   - [ ] Picture uploads and displays
   - [ ] Picture persists after page reload

2. **Nickname Update**
   - [ ] Go to Account page
   - [ ] Click "Set nickname" or existing nickname
   - [ ] Enter new nickname
   - [ ] Click "Save"
   - [ ] Nickname displays immediately
   - [ ] Nickname persists after page reload

3. **Password Change**
   - [ ] Go to Account page
   - [ ] Enter current password
   - [ ] Click "Verify Password"
   - [ ] See "✓ Password verified" message
   - [ ] Enter new password
   - [ ] Confirm new password
   - [ ] Click "Update Password"
   - [ ] Success message appears
   - [ ] Can log in with new password

4. **Cart Persistence**
   - [ ] Add items to cart as anonymous user
   - [ ] Go to login page
   - [ ] Login
   - [ ] Items still in cart
   - [ ] Log out
   - [ ] Log back in
   - [ ] Items still in cart

## Troubleshooting

**Profile picture not uploading:**
- Check that `user-profiles` storage bucket exists
- Check storage policies are correctly set
- Check browser console for errors
- Verify file is under 5MB and is an image

**Nickname not updating:**
- Check that `profile_picture_url` column exists in `user_profiles`
- Check RLS policies are correct
- Try refreshing the page
- Check browser console for errors

**Cart not persisting:**
- Ensure `user_carts` table SQL has been run
- Check that you're logged in (cart only persists for authenticated users)
- Check browser localStorage is enabled
- Check Supabase RLS policies for `user_carts`

**File upload fails with permission error:**
- Check storage bucket policies are set correctly
- Verify user is authenticated
- Check bucket name is exactly `user-profiles`
