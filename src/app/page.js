"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // ---------------- CHECK SESSION + AUTH LISTENER ----------------
  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      // handle auth events properly
      if (event === "SIGNED_IN") {
        toast.success("Logged in successfully ✅");
        router.push("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        toast.success("Logged out");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // ---------------- CHECK CURRENT SESSION ----------------
  const checkUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      setSession(data.session);

      // auto redirect if already logged in
      if (data.session) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log("Session check error:", err);
      toast.error("Session check failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const signIn = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.log("Login error:", error);
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
    } catch (err) {
      console.log("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Smart Bookmark App</h1>

      {!session ? (
        <button
          onClick={signIn}
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90"
        >
          Login with Google
        </button>
      ) : (
        <>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Go to Dashboard
          </button>

          <button
            onClick={signOut}
            className="bg-red-500 text-white px-6 py-3 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
