"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // ---------------- STATE ----------------
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Prevent duplicate login toast
  const hasShownLoginToast = useRef(false);

  // ---------------- SESSION CHECK + AUTH LISTENER ----------------
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!isMounted) return;

        setSession(data?.session ?? null);

        // Auto redirect if already logged in
        if (data?.session) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    // Listen for auth changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      setSession(session);

      // Ignore initial restore event
      if (event === "INITIAL_SESSION") return;

      if (event === "SIGNED_IN" && !hasShownLoginToast.current) {
        hasShownLoginToast.current = true;
        toast.success("Logged in successfully ✅");
        router.replace("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        toast.success("Logged out successfully");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // ---------------- GOOGLE LOGIN ----------------
  const signIn = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600 text-lg">
          Checking authentication...
        </div>
      </div>
    );
  }

  // ---------------- REUSABLE BUTTON STYLE ----------------
  const primaryBtn =
    "px-6 py-3 rounded-lg font-medium text-white transition active:scale-[0.98]";

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50 px-4">

      {/* APP HEADER */}
      <div className="text-center space-y-2 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Smart Bookmark App
        </h1>
        <p className="text-gray-600">
          Save, organize, and access your favorite websites securely with realtime sync.
        </p>
      </div>

      {/* AUTH UI */}
      {!session ? (
        <button
          onClick={signIn}
          className={`${primaryBtn} bg-black hover:opacity-90`}
        >
          Continue with Google
        </button>
      ) : (
        <div className="flex flex-col gap-4 items-center">

          {/* Dashboard Navigation — Window Redirect */}
          <button
            onClick={() => window.location.assign("/dashboard")}
            className={`${primaryBtn} bg-green-600 hover:bg-green-700`}
          >
            Go to Dashboard
          </button>

          {/* Dashboard Navigation — Next Link */}
          <Link
            href="/dashboard"
            className={`${primaryBtn} bg-green-500 hover:bg-green-600`}
          >
            Open Dashboard
          </Link>

          {/* Professional Action Group */}
          <div className="flex gap-3 mt-2">
            <Link
              href="/dashboard"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={signOut}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
