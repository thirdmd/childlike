import { useState, useEffect } from "react";
import { authService } from "@/integrations/supabase/authService";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface CurrentUserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  profile_picture_url: string | null;
  created_at: string;
}

export interface UseCurrentUserResult {
  user: User | null;
  profile: CurrentUserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        setError(profileError.message);
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  useEffect(() => {
    let profileSubscription: ReturnType<typeof supabase.channel> | null = null;

    const loadUser = async () => {
      try {
        const { session, error: sessionError } =
          await authService.getCurrentSession();

        if (sessionError) {
          setError(sessionError);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        const { data, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
        } else {
          setProfile(data);
        }

        profileSubscription = supabase
          .channel(`user_profile_${session.user.id}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "user_profiles",
              filter: `user_id=eq.${session.user.id}`,
            },
            (payload) => {
              setProfile(payload.new as CurrentUserProfile);
            }
          )
          .subscribe();
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const { data: authListener } = authService.onAuthStateChange((session) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
      profileSubscription?.unsubscribe();
    };
  }, []);

  return { user, profile, loading, error, refreshProfile };
}
