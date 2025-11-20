# Account Management Architecture

## Overview
The Childlike account system is now fully centralized and reusable for future e-commerce projects. All user data flows through a single source of truth: the `user_profiles` table in Supabase.

---

## Data Flow

```
┌─────────────────────┐
│  Supabase Database  │
│   user_profiles     │
└──────────┬──────────┘
           │
           │ Real-time sync
           │
    ┌──────▼──────────┐
    │ useCurrentUser  │ ◄── Centralized hook
    │      Hook       │
    └──────┬──────────┘
           │
           ├─── Header (Avatar + Name)
           ├─── Account Page (Profile editing)
           └─── Future components (Cart, Orders, etc.)
```

---

## Core Components

### 1. **Database: `user_profiles` table**
Single source of truth for all user data.

**Schema:**
- `user_id` - Links to Supabase auth user
- `email` - User email
- `full_name` - Display name (nickname)
- `phone` - Phone number (optional)
- `profile_picture_url` - Profile picture from storage
- `created_at` - Timestamp

### 2. **Hook: `useCurrentUser`**
Centralized React hook that manages user state across the app.

**Features:**
- Loads current user and profile on mount
- Real-time sync via Supabase subscriptions
- Auto-updates all components when profile changes
- Provides `refreshProfile()` for manual refresh

**Returns:**
- `user` - Auth user object
- `profile` - Full profile data from database
- `loading` - Loading state
- `error` - Error state
- `refreshProfile()` - Manual refresh function

### 3. **Service: `authService`**
Handles all auth and profile operations.

**Key Methods:**
- `signUpWithEmail()` - Creates user + profile
- `signInWithEmail()` - Login
- `updateProfile()` - Updates profile fields
- `uploadProfilePicture()` - Handles image upload
- `changePassword()` - Password updates
- `verifyCurrentPassword()` - Password verification

### 4. **Component: `Avatar`**
Reusable avatar component with initials or profile picture.

**Props:**
- `userId` - Required
- `fullName` - Display name (from profile)
- `email` - Fallback for initials
- `profilePictureUrl` - Optional image
- `size` - "sm" | "md" | "lg"

---

## Fixed Issues

### Issue 1: ✅ Nickname not updating in Header
**Problem:** Header was using `user.user_metadata.full_name` instead of database
**Solution:** Changed to `profile.full_name` from `user_profiles` table

### Issue 2: ✅ Large click surface area
**Problem:** Entire avatar + nickname was one button, so clicking camera icon edited nickname
**Solution:** Separated into two zones:
- Avatar area = Upload photo (label wrapping avatar)
- Nickname text = Edit nickname (separate button)

### Issue 3: ✅ No real-time sync
**Problem:** Changes didn't appear in Header without page refresh
**Solution:** Added Supabase real-time subscription in `useCurrentUser`:
```typescript
supabase
  .channel(`user_profile_${user.id}`)
  .on("postgres_changes", {
    event: "UPDATE",
    table: "user_profiles",
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    setProfile(payload.new);
  })
```

---

## How to Use in Future Projects

### 1. Copy Core Files
- `/src/hooks/useCurrentUser.ts`
- `/src/integrations/supabase/authService.ts`
- `/src/components/Avatar.tsx`

### 2. Database Setup
Run the SQL migration:
```sql
-- See SQL_PROFILE_PICTURE_SETUP.sql
```

### 3. Use in Components
```tsx
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar } from "@/components/Avatar";

export default function MyComponent() {
  const { user, profile, loading } = useCurrentUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <Avatar
        userId={user.id}
        fullName={profile?.full_name}
        email={user.email}
        profilePictureUrl={profile?.profile_picture_url}
      />
      <p>Hello, {profile?.full_name || 'User'}!</p>
    </div>
  );
}
```

### 4. Update Profile
```tsx
import { authService } from "@/integrations/supabase/authService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const { user, refreshProfile } = useCurrentUser();

// Update nickname
await authService.updateProfile(user.id, {
  full_name: "New Name"
});
await refreshProfile(); // Optional - real-time sync will auto-update

// Upload profile picture
const result = await authService.uploadProfilePicture(user.id, fileObject);
if (result.success) {
  console.log("Uploaded to:", result.url);
}
```

---

## Reusability Features

### ✅ Centralized Data
- Single hook (`useCurrentUser`) for all user data
- No duplicate state management
- Consistent across all pages

### ✅ Real-time Sync
- Changes propagate automatically
- No manual refresh needed
- All components stay in sync

### ✅ Type Safety
- Full TypeScript support
- `CurrentUserProfile` interface
- Type-safe operations

### ✅ Modular Components
- `Avatar` is fully reusable
- Clean separation of concerns
- Easy to extend

### ✅ Scalable
- Ready for cart sync
- Ready for order history
- Ready for subscriptions

---

## Next Steps for E-commerce

1. **Cart Management**
   - Use same pattern: `useCart` hook
   - Real-time sync via Supabase
   - Link to `user_id`

2. **Order History**
   - `orders` table linked to `user_id`
   - Show in Account page
   - Real-time updates

3. **Payment Integration**
   - Stripe customer ID in `user_profiles`
   - Centralized payment service
   - Link to user account

---

## Key Principles Applied

1. **Single Source of Truth** - Database is the authority
2. **Centralization** - One hook, one service, reusable everywhere
3. **Real-time First** - Auto-sync via Supabase subscriptions
4. **Type Safety** - TypeScript everywhere
5. **Minimal Code** - No bloat, maximum efficiency
6. **Reusability** - Built for future projects

---

**Last Updated:** November 21, 2025
**Status:** Production Ready ✅
