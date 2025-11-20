import { supabase } from "./client";
import type { Session } from "@supabase/supabase-js";

export interface AuthResult {
  success: boolean;
  error?: string;
}

export const authService = {
  async signUpWithEmail(
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: "Sign up failed" };

      // Create profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: data.user.id,
          email: data.user.email!,
          full_name: fullName || null,
        });

      if (profileError) {
        console.error("Profile creation failed:", profileError);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async signInWithEmail(
    email: string,
    password: string
  ): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async getCurrentSession(): Promise<{
    session: Session | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return { session: null, error: error.message };
      return { session: data.session };
    } catch (err) {
      return { session: null, error: String(err) };
    }
  },

  async verifyCurrentPassword(
    email: string,
    currentPassword: string
  ): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (error) {
        return { success: false, error: "Current password is incorrect" };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async changePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async updateProfile(
    userId: string,
    updates: {
      full_name?: string;
      phone?: string;
      profile_picture_url?: string;
    }
  ): Promise<AuthResult> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async uploadProfilePicture(
    userId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      console.log("=== UPLOAD START ===");
      console.log("User ID:", userId);
      console.log("File:", file.name, file.type, `${(file.size / 1024).toFixed(2)}KB`);

      // Validate file
      if (!file) {
        console.error("ERROR: No file selected");
        return { success: false, error: "No file selected" };
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.error("ERROR: File must be an image");
        return { success: false, error: "File must be an image" };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error("ERROR: File too large");
        return { success: false, error: "File must be less than 5MB" };
      }

      // Create unique filename with userId as folder
      const fileExt = file.name.split(".").pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      console.log("Upload path:", filePath);

      // Upload to Supabase storage
      console.log("Uploading to storage bucket: user_profiles");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user_profiles")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError);
        return { success: false, error: uploadError.message };
      }
      console.log("Upload successful:", uploadData);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user_profiles").getPublicUrl(filePath);
      console.log("Public URL:", publicUrl);

      // Update profile with picture URL
      console.log("Updating database...");
      const { data: updateData, error: updateError } = await supabase
        .from("user_profiles")
        .update({ profile_picture_url: publicUrl })
        .eq("user_id", userId)
        .select();

      console.log("Database update result:", { updateData, updateError });

      if (updateError) {
        console.error("DATABASE UPDATE ERROR:", updateError);
        return { success: false, error: updateError.message };
      }

      console.log("=== UPLOAD SUCCESS ===");
      return { success: true, url: publicUrl };
    } catch (err) {
      console.error("UNEXPECTED ERROR:", err);
      return { success: false, error: String(err) };
    }
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};
