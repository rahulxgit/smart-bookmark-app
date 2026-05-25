"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import BookmarkCard from "@/components/BookmarkCard";
import toast from "react-hot-toast";
import {
  getBookmarks,
  createBookmark,
  removeBookmark,
} from "@/services/bookmarkService";
import { MagnifyingGlassIcon, PlusIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  // ---------------- STATE ----------------
  const [userId, setUserId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ title: "", url: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // ---------------- GET USER ----------------
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
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
        (payload) => {
          setBookmarks((prev) => prev.some((b) => b.id === payload.new.id) ? prev : [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
        (payload) => {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
        (payload) => {
          setBookmarks((prev) => prev.map((b) => b.id === payload.new.id ? payload.new : b));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------- ADD BOOKMARK ----------------
  const addBookmark = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.url) {
      setError("Please complete all required fields.");
      return toast.error("All fields are required");
    }

    let formattedUrl = form.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      setAdding(true);
      const newBookmark = await createBookmark({
        title: form.title,
        url: formattedUrl,
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

  // ---------------- SEARCH FILTERING ----------------
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery) return bookmarks;
    const lowerQuery = searchQuery.toLowerCase();
    return bookmarks.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) || 
      b.url.toLowerCase().includes(lowerQuery)
    );
  }, [bookmarks, searchQuery]);

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your space...</p>
        </div>
      </div>
    );
  }

  // ---------------- REUSABLE INPUT STYLE ----------------
  const inputStyle =
    "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 " +
    "text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm";

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Your Library
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              {bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'} saved securely
            </p>
          </div>
        </header>

        {/* ADD BOOKMARK FORM */}
        <section className="glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 dark:border-white/10">
          <form onSubmit={addBookmark} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Website Title (e.g. GitHub)"
                  className={inputStyle}
                  autoComplete="off"
                />
              </div>
              <div className="flex-[1.5]">
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="URL (e.g. github.com)"
                  className={inputStyle}
                  autoComplete="off"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {adding ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  Save
                </>
              )}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-red-500 dark:text-red-400 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </p>
          )}
        </section>

        {/* SEARCH BAR */}
        {bookmarks.length > 0 && (
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search your bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        )}

        {/* BOOKMARK LIST */}
        <section className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookmarkSquareIcon className="w-8 h-8" />
              </div>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-300">Your library is empty</p>
              <p className="text-base mt-2 max-w-sm mx-auto">
                Save your first website using the form above to start building your collection.
              </p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <p className="text-lg font-medium">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${Math.random() * 100}ms` }}>
                  <BookmarkCard
                    bookmark={bookmark}
                    onDelete={deleteBookmark}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
