import { useMemo } from "react";
import { useAuth as useAuthContext } from "@/context/AuthContext";

// ---------------- CUSTOM AUTH HOOK ----------------
export default function useUser() {
  const { session, user, isAuthenticated, loading } = useAuthContext();

  // ---- Memoized return (performance optimization) ----
  return useMemo(
    () => ({
      session,
      user: user ?? session?.user ?? null,
      isLoggedIn: isAuthenticated ?? !!session,
      loading,
    }),
    [session, user, isAuthenticated, loading]
  );
}
