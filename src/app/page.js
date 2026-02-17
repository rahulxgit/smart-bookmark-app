"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // ---------------- STATE ----------------
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // ---------------- CHECK SESSION + AUTH LISTENER ----------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(data.session);

        // auto redirect if already logged in
        if (data.session) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    // auth listener (login / logout updates UI instantly)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === "SIGNED_IN") {
        toast.success("Logged in successfully ✅");
        router.replace("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        toast.success("Logged out");
      }
    });

    return () => subscription.unsubscribe();
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
      toast.error("Login failed. Try again.");
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
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-gray-600 text-lg">
          Loading...
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        Smart Bookmark App
      </h1>

      {!session ? (
        <button
          onClick={signIn}
          className="bg-black text-white px-6 py-3 rounded-lg
          hover:opacity-90 active:scale-[0.98] transition"
        >
          Login with Google
        </button>
      ) : (
        <div className="flex flex-col gap-3 items-center">
          {/* Dashboard Navigation */}
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg
            hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>

          {/* Alternative Link (kept your feature) */}
          <Link href="/dashboard">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
              Go to Dashboard
            </button>
          </Link>

          {/* Logout */}
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </main>
  );
}
