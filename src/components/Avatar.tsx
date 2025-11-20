/**
 * AVATAR COMPONENT
 * Displays user avatar with initials
 * Uses centralized avatar config for consistent styling
 */

import { getAvatarPropsForUser } from "@/config/avatarConfig";

interface AvatarProps {
  userId: string;
  fullName?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
  profilePictureUrl?: string | null;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
};

export const Avatar = ({
  userId,
  fullName,
  email,
  size = "md",
  profilePictureUrl,
}: AvatarProps) => {
  const avatarProps = getAvatarPropsForUser(userId, fullName, email);

  // If profile picture exists, show it
  if (profilePictureUrl) {
    return (
      <img
        src={profilePictureUrl}
        alt={fullName || email || "User avatar"}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  // Otherwise show initials in colored circle
  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${avatarProps.color} flex items-center justify-center font-bold text-brand-white`}
    >
      {avatarProps.initials}
    </div>
  );
};
