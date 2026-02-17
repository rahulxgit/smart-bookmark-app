"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookmarkCard from "@/components/BookmarkCard";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  getBookmarks,
  createBookmark,
  removeBookmark,
} from "@/services/bookmarkService";

export default function Dashboard() {
  const router = useRouter();

  // ---------------- STATE ----------------
  const [userId, setUserId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    url: "",
  });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // ---------------- AUTH CHECK (PRODUCTION SAFE) ----------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!data?.session) {
          router.replace("/");
          return;
        }

        setUserId(data.session.user.id);
      } catch (err) {
        console.log("Auth error:", err);
        toast.error("Authentication failed");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  // ---------------- FETCH BOOKMARKS ----------------
  const fetchBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      console.log("Fetch error:", err);
      toast.error("Failed to load bookmarks");
    }
  };

  // ---------------- REALTIME SUBSCRIPTION ----------------
  useEffect(() => {
    if (!userId) return;

    // initial load
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime-channel")

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
          setBookmarks((prev) => {
            const exists = prev.some((b) => b.id === payload.new.id);
            if (exists) return prev;
            return [payload.new, ...prev];
          });
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
  const addBookmark = async () => {
    setError("");

    if (!form.title || !form.url) {
      setError("All fields required");
      return toast.error("All fields required");
    }

    if (!form.url.startsWith("http")) {
      setError("URL must start with http or https");
      return toast.error("Invalid URL");
    }

    try {
      setAdding(true);

      const newBookmark = await createBookmark({
        title: form.title,
        url: form.url,
        user_id: userId,
      });

      // optimistic UI
      setBookmarks((prev) => [newBookmark, ...prev]);

      setForm({ title: "", url: "" });
      toast.success("Bookmark added successfully ✅");
    } catch (err) {
      console.log("Insert error:", err);
      setError("Failed to add bookmark");
      toast.error("Failed to add bookmark");
    } finally {
      setAdding(false);
    }
  };

  // ---------------- DELETE BOOKMARK ----------------
  const deleteBookmark = async (id) => {
    try {
      await removeBookmark(id);

      // optimistic UI
      setBookmarks((prev) => prev.filter((b) => b.id !== id));

      toast.success("Bookmark deleted");
    } catch (err) {
      console.log("Delete error:", err);
      toast.error("Failed to delete bookmark");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>

      {/* ADD FORM */}
      <div className="border rounded p-4 mb-6 space-y-3">
        <h2 className="font-semibold">Add New Bookmark</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="title"
          placeholder="Bookmark title"
          value={form.title}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />

        <input
          name="url"
          placeholder="https://example.com"
          value={form.url}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />

        <button
          onClick={addBookmark}
          disabled={adding}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {adding ? "Adding..." : "Add Bookmark"}
        </button>
      </div>

      {/* BOOKMARK LIST */}
      <div className="space-y-3">
        {bookmarks.length === 0 ? (
          <p className="text-gray-500">No bookmarks added yet.</p>
        ) : (
          bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={deleteBookmark}
            />
          ))
        )}
      </div>
    </div>
  );
}
