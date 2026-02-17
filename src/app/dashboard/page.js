"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookmarkCard from "@/components/BookmarkCard";
import toast from "react-hot-toast";
import {
  getBookmarks,
  createBookmark,
  removeBookmark,
} from "@/services/bookmarkService";

export default function Dashboard() {
  // ---------------- STATE ----------------
  const [userId, setUserId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ title: "", url: "" });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // ---------------- GET USER (SSR handles protection via middleware) ----------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!data?.user) {
          window.location.href = "/";
          return;
        }

        setUserId(data.user.id);
      } catch (err) {
        console.error("User fetch error:", err);
        toast.error("Authentication required");
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ---------------- FETCH BOOKMARKS ----------------
  const fetchBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load bookmarks");
    }
  };

  // ---------------- REALTIME + INITIAL LOAD ----------------
  useEffect(() => {
    if (!userId) return;

    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")

      // INSERT
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.some((b) => b.id === payload.new.id)
              ? prev
              : [payload.new, ...prev]
          );
        }
      )

      // DELETE
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )

      // UPDATE
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.map((b) =>
              b.id === payload.new.id ? payload.new : b
            )
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------- ADD BOOKMARK ----------------
  const addBookmark = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.url) {
      setError("Please complete all required fields.");
      return toast.error("All fields are required");
    }

    if (!form.url.startsWith("http")) {
      setError("URL must start with http:// or https://");
      return toast.error("Invalid URL");
    }

    try {
      setAdding(true);

      const newBookmark = await createBookmark({
        title: form.title,
        url: form.url,
        user_id: userId,
      });

      setBookmarks((prev) => [newBookmark, ...prev]);
      setForm({ title: "", url: "" });

      toast.success("Bookmark saved successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to save bookmark. Please try again.");
      toast.error("Failed to save bookmark");
    } finally {
      setAdding(false);
    }
  };

  // ---------------- DELETE BOOKMARK ----------------
  const deleteBookmark = async (id) => {
    try {
      await removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete bookmark");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 text-lg">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  // ---------------- REUSABLE INPUT STYLE ----------------
  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-3 bg-white " +
    "text-gray-900 placeholder-gray-700 " +
    "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition";

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Bookmark Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Save, organize, and access your important websites securely.
          </p>
        </header>

        {/* ADD BOOKMARK FORM */}
        <section className="bg-white border rounded-2xl shadow-sm p-8">
          <form onSubmit={addBookmark} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Bookmark
              </h2>
              <p className="text-sm text-gray-500">
                Store your favorite websites for quick access.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* TITLE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Bookmark Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: GitHub, Portfolio"
                className={inputStyle}
              />
            </div>

            {/* URL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Website URL
              </label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://example.com"
                className={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full flex items-center justify-center gap-2
              bg-black text-white py-3 rounded-lg
              hover:opacity-90 active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {adding ? "Saving Bookmark..." : "Save Bookmark"}
            </button>
          </form>
        </section>

        {/* BOOKMARK LIST */}
        <section className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
              <p className="text-lg font-medium">No bookmarks yet</p>
              <p className="text-sm mt-1">
                Start by adding your first website above.
              </p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={deleteBookmark}
              />
            ))
          )}
        </section>

      </div>
    </main>
  );
}
