"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { supabase } from "@/lib/supabase";

// ---------------- CREATE CONTEXT ----------------
const AuthContext = createContext(undefined);

// ---------------- AUTH PROVIDER ----------------
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // ---- Get initial session ----
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          setSession(data?.session ?? null);
        }
      } catch (err) {
        console.error("Auth session error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    // ---- Listen to auth changes ----
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
      }
    });

    // ---- Cleanup ----
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---- Memoize context value (performance) ----
  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      loading,
    }),
    [session, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- CUSTOM HOOK ----------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
