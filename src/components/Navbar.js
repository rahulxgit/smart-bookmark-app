"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const getInitial = (email) => email?.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT — LOGO */}
        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-semibold group-hover:scale-105 transition">
            SB
          </div>

          <div className="leading-tight">
            <p className="text-lg font-semibold text-gray-900">
              Smart Bookmark
            </p>
            <p className="text-xs text-gray-500">
              Bookmark Manager
            </p>
          </div>
        </div>

        {/* RIGHT — USER AREA */}
        {!loading && user && (
          <div className="relative" ref={menuRef}>

            {/* USER BUTTON */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition focus:outline-none"
              aria-haspopup="true"
              aria-expanded={openMenu}
            >
              {/* Email (desktop) */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-gray-900">
                  {user.email}
                </span>
                <span className="text-xs text-gray-500">
                  Account
                </span>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                {getInitial(user.email)}
              </div>
            </button>

            {/* DROPDOWN MENU */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg p-2 animate-in fade-in zoom-in-95">

                {/* User Info */}
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Signed in account
                  </p>
                </div>

                {/* Dashboard */}
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
                >
                  Dashboard
                </button>

                {/* Divider */}
                <div className="border-t my-2" />

                {/* Logout Button — Premium Danger Style */}
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg
                  text-red-600 hover:bg-red-50 hover:text-red-700
                  transition font-medium"
                >
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
