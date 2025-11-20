/**
 * CENTRALIZED AVATAR & PROFILE CONFIGURATION
 * Single source of truth for user avatar styling and colors
 * Ready for backend integration (profile_picture_url in user_profiles)
 */

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
];

/**
 * Generate consistent avatar color based on user ID
 * Always returns same color for same ID (deterministic)
 */
export const getAvatarColorForUser = (userId: string): string => {
  // Use first 8 chars of UUID to generate consistent index
  const hash = userId.substring(0, 8);
  const charCode = hash.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = charCode % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

/**
 * Get user initials from email
 * E.g., "john.doe@example.com" → "JD"
 */
export const getInitialsFromEmail = (email: string): string => {
  const parts = email.split("@")[0].split(".");
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
  return initials.substring(0, 2); // Max 2 characters
};

/**
 * Get user initials from full name
 * E.g., "John Doe" → "JD"
 */
export const getInitialsFromName = (fullName: string | null | undefined): string => {
  if (!fullName) return "U"; // Default "U" for User

  const parts = fullName.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

/**
 * Get display initials (prefer name, fallback to email)
 */
export const getDisplayInitials = (
  fullName: string | null | undefined,
  email: string | null | undefined
): string => {
  if (fullName) return getInitialsFromName(fullName);
  if (email) return getInitialsFromEmail(email);
  return "U";
};

/**
 * Generate avatar props (color + initials) for user
 * Ready for profile picture URL in future
 */
export const getAvatarPropsForUser = (
  userId: string,
  fullName?: string | null,
  email?: string | null
) => {
  return {
    color: getAvatarColorForUser(userId),
    initials: getDisplayInitials(fullName, email),
    // Future: profilePictureUrl from database
  };
};
