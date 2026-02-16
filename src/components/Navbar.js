"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // get logged in user
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  // logout function
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b px-8 py-4 flex justify-between items-center">
      {/* Logo / App Name */}
      <h1
        onClick={() => router.push("/dashboard")}
        className="text-xl font-bold cursor-pointer"
      >
        Smart Bookmark
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <p className="text-sm text-gray-600">{user.email}</p>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
