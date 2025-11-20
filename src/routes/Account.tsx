import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authService } from "@/integrations/supabase/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Avatar } from "@/components/Avatar";
import { ImageCropModal } from "@/components/ImageCropModal";
import { Mail, Lock, AlertCircle, Camera } from "lucide-react";

export default function Account() {
  const { user, profile, loading, refreshProfile } = useCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Nickname/Profile Picture state
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(profile?.full_name || "");
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  // Profile picture upload state
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);

  const isEmailVerified = user?.user_metadata?.email_confirmed || false;

  // Handle nickname update
  const handleUpdateNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    setNicknameError("");

    if (!newNickname.trim()) {
      setNicknameError("Nickname cannot be empty");
      return;
    }

    setNicknameLoading(true);
    const result = await authService.updateProfile(user!.id, {
      full_name: newNickname.trim(),
    });

    if (result.success) {
      toast({
        title: "Nickname updated",
        description: "Your nickname has been saved.",
      });
      setIsEditingNickname(false);
      // Refresh profile data to show updated nickname
      await refreshProfile();
    } else {
      setNicknameError(result.error || "Failed to update nickname");
    }

    setNicknameLoading(false);
  };

  // Handle file selection - show crop modal
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfilePictureError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle cropped image upload
  const handleCroppedImage = async (croppedBlob: Blob) => {
    console.log("=== ACCOUNT: Starting upload ===");
    console.log("Cropped blob size:", `${(croppedBlob.size / 1024).toFixed(2)}KB`);

    setShowCropModal(false);
    setSelectedImage(null);
    setProfilePictureLoading(true);
    setProfilePictureError("");

    const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
    console.log("Created file:", file.name, file.type);
    console.log("User ID:", user!.id);

    const result = await authService.uploadProfilePicture(user!.id, file);
    console.log("Upload result:", result);

    if (result.success) {
      console.log("Upload succeeded, showing toast");
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been uploaded.",
      });

      console.log("Calling refreshProfile...");
      await refreshProfile();
      console.log("RefreshProfile completed");

      console.log("Current profile state:", profile);
    } else {
      console.error("Upload failed:", result.error);
      setProfilePictureError(result.error || "Failed to upload picture");
    }

    setProfilePictureLoading(false);
    console.log("=== ACCOUNT: Upload flow complete ===");
  };

  // Step 1: Verify old password
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!oldPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    setPasswordLoading(true);
    const result = await authService.verifyCurrentPassword(
      user!.email!,
      oldPassword
    );

    if (result.success) {
      setPasswordVerified(true);
    } else {
      setPasswordError(result.error || "Failed to verify password");
    }

    setPasswordLoading(false);
  };

  // Step 2: Change password (after verification)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setPasswordError("Both fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    const result = await authService.changePassword(newPassword);

    if (result.success) {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      // Reset all fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordVerified(false);
    } else {
      setPasswordError(result.error || "Failed to change password");
    }

    setPasswordLoading(false);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-blue">
        <p className="text-brand-white">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-blue">
        <div className="text-center space-y-4">
          <p className="text-xl text-brand-white">You're not signed in</p>
          <Button onClick={() => navigate("/auth/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brand-blue">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-brand-white">Account</h1>

        {/* Avatar & Profile Card */}
        <div className="bg-brand-white/10 backdrop-blur-sm border border-brand-white/20 rounded-2xl p-8 space-y-6">
          {/* Avatar + Nickname Edit */}
          {!isEditingNickname ? (
            <div className="w-full flex flex-col items-center gap-6">
              {/* Avatar with camera icon overlay for upload */}
              <div className="relative group">
                <Avatar
                  userId={user.id}
                  fullName={profile?.full_name}
                  email={user.email}
                  size="lg"
                  profilePictureUrl={profile?.profile_picture_url}
                />

                {/* Hidden file input for picture upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={profilePictureLoading}
                  className="hidden"
                  id="profile-picture-input"
                />

                {/* Click overlay for photo upload */}
                <label
                  htmlFor="profile-picture-input"
                  className="absolute inset-0 rounded-full cursor-pointer transition-colors flex items-end justify-end hover:bg-brand-white/10"
                  title="Upload profile picture"
                >
                  <div className="bg-brand-blue border-2 border-brand-white/30 rounded-full p-2 group-hover:bg-brand-white/20 transition-colors pointer-events-none">
                    <Camera className="w-4 h-4 text-brand-white" />
                  </div>
                </label>
              </div>

              {/* Nickname or "Set nickname" - Separate clickable area */}
              <button
                onClick={() => {
                  setNewNickname(profile?.full_name || "");
                  setIsEditingNickname(true);
                }}
                className="text-center hover:opacity-80 transition-opacity"
              >
                <p className="text-2xl font-bold text-brand-white">
                  {profile?.full_name || "Set nickname"}
                </p>
                <p className="text-xs text-brand-white/50 mt-2">Click name to edit</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateNickname} className="flex flex-col items-center gap-6">
              {nicknameError && (
                <div className="w-full bg-red-500/10 text-red-400 p-3 rounded border border-red-500/20 text-sm">
                  {nicknameError}
                </div>
              )}

              <div className="relative group">
                <Avatar
                  userId={user.id}
                  fullName={newNickname}
                  email={user.email}
                  size="lg"
                  profilePictureUrl={profile?.profile_picture_url}
                />
                <div className="absolute bottom-0 right-0 bg-brand-blue border-2 border-brand-white/30 rounded-full p-2">
                  <Camera className="w-4 h-4 text-brand-white" />
                </div>
              </div>

              <div className="w-full space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your nickname"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  disabled={nicknameLoading}
                  className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40 text-center"
                />

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={nicknameLoading}
                    className="flex-1"
                  >
                    {nicknameLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditingNickname(false)}
                    variant="outline"
                    className="flex-1 border-brand-white/20 text-brand-white hover:bg-brand-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Email with verification badge */}
          <div className="space-y-3 border-t border-brand-white/10 pt-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-white/60" />
              <span className="text-sm text-brand-white/60">Email</span>
              {!isEmailVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400">
                  <AlertCircle className="w-3 h-3" />
                  Not verified
                </span>
              )}
              {isEmailVerified && (
                <span className="ml-auto text-xs px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="font-medium text-brand-white">{user.email}</p>
          </div>

          {/* Phone */}
          {profile?.phone && (
            <div className="space-y-3 border-t border-brand-white/10 pt-6">
              <p className="text-sm text-brand-white/60">Phone</p>
              <p className="font-medium text-brand-white">{profile.phone}</p>
            </div>
          )}
        </div>

        {/* Change Password - Two-Step Verification */}
        <div className="bg-brand-white/10 backdrop-blur-sm border border-brand-white/20 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-brand-white" />
            <h2 className="text-xl font-bold text-brand-white">Change Password</h2>
          </div>

          {passwordError && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded border border-red-500/20 text-sm">
              {passwordError}
            </div>
          )}

          {!passwordVerified ? (
            // Step 1: Verify current password
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <label className="block text-sm text-brand-white/60 mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
                />
              </div>

              <Button type="submit" disabled={passwordLoading} className="w-full">
                {passwordLoading ? "Verifying..." : "Verify Password"}
              </Button>
            </form>
          ) : (
            // Step 2: Set new password
            <form onSubmit={handleChangePassword} className="space-y-4">
              <p className="text-sm text-green-400">✓ Password verified</p>

              <div>
                <label className="block text-sm text-brand-white/60 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
                />
              </div>

              <div>
                <label className="block text-sm text-brand-white/60 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={passwordLoading} className="flex-1">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setPasswordVerified(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  variant="outline"
                  disabled={passwordLoading}
                  className="flex-1 border-brand-white/20 text-brand-white hover:bg-brand-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-brand-white/10 backdrop-blur-sm border border-brand-white/20 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-brand-white">Orders</h2>
          <p className="text-brand-white/60">Your order history will appear here</p>
        </div>

        {/* Sign Out - Bottom, Red */}
        <div className="border-t border-brand-white/10 pt-8">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && selectedImage && (
        <ImageCropModal
          image={selectedImage}
          onCropComplete={handleCroppedImage}
          onCancel={() => {
            setShowCropModal(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}
