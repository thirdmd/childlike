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
      // Validate file
      if (!file) {
        return { success: false, error: "No file selected" };
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "File must be an image" };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "File must be less than 5MB" };
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("user_profiles")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user_profiles").getPublicUrl(filePath);
      console.log("Got public URL:", publicUrl);

      // Update profile with picture URL
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ profile_picture_url: publicUrl })
        .eq("user_id", userId);

      console.log("Database update:", updateError ? "ERROR: " + updateError.message : "SUCCESS");

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, url: publicUrl };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};
