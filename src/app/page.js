"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { BookmarkIcon, SparklesIcon, CloudArrowUpIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();

  // ---------------- STATE ----------------
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      setSession(session);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse-soft mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse-soft mix-blend-multiply dark:mix-blend-screen pointer-events-none" style={{ animationDelay: "2s" }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-12">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-8 max-w-3xl mx-auto animate-float">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
            <SparklesIcon className="w-5 h-5" />
            <span>The smart way to save the web</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Intelligent <br className="hidden md:block"/> Bookmark Management
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Curate your personal corner of the internet. Save, organize, and access your favorite websites securely with beautiful previews and real-time sync across all your devices.
          </p>
        </div>

        {/* AUTH UI OR DASHBOARD LINKS */}
        <div className="mt-12 w-full max-w-md">
          {!session ? (
            <div className="glass p-8 rounded-3xl shadow-xl border border-white/50 dark:border-white/10 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BookmarkIcon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">Get Started</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join thousands of users organizing their web.</p>
              </div>
              <button
                onClick={signIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl shadow-xl border border-white/50 dark:border-white/10 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">Welcome Back!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your bookmarks are synced and ready.</p>
              </div>
              <div className="flex flex-col w-full gap-3">
                <Link
                  href="/dashboard"
                  className="w-full text-center bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="w-full text-center bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FEATURES GRID */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="glass p-6 rounded-2xl text-center flex flex-col items-center">
            <CloudArrowUpIcon className="w-10 h-10 text-blue-500 mb-4" />
            <h4 className="text-lg font-bold mb-2">Real-time Sync</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your bookmarks are instantly synchronized across all your devices, powered by Supabase.</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center flex flex-col items-center">
            <SparklesIcon className="w-10 h-10 text-indigo-500 mb-4" />
            <h4 className="text-lg font-bold mb-2">Beautiful Previews</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visual metadata extraction makes finding the right link easier than ever before.</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center flex flex-col items-center">
            <ShieldCheckIcon className="w-10 h-10 text-teal-500 mb-4" />
            <h4 className="text-lg font-bold mb-2">Secure & Private</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enterprise-grade security ensures your data remains completely private and isolated.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
