"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookmarkIcon, ArrowRightOnRectangleIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef();

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user ?? null);
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // ---------------- CLOSE MENU ON OUTSIDE CLICK ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ---------------- USER INITIAL ----------------
  const getInitial = (email) => email?.charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* LEFT — LOGO */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
            <BookmarkIcon className="w-5 h-5" />
          </div>

          <div className="leading-tight hidden sm:block">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              SmartBookmark
            </p>
          </div>
        </Link>

        {/* RIGHT — USER AREA */}
        {!loading && user && (
          <div className="relative" ref={menuRef}>
            {/* USER BUTTON */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
              aria-haspopup="true"
              aria-expanded={openMenu}
            >
              {/* Email (desktop) */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                  {user.email.split('@')[0]}
                </span>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-300 text-white dark:text-slate-900 flex items-center justify-center text-sm font-bold shadow-inner">
                {getInitial(user.email)}
              </div>
            </button>

            {/* DROPDOWN MENU */}
            {openMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95 origin-top-right">
                {/* User Info */}
                <div className="px-4 py-3 mb-1 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pro Account
                  </p>
                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                >
                  <Squares2X2Icon className="w-5 h-5" />
                  Dashboard
                </Link>

                <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-2" />

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
