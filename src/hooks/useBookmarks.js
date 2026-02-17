import { useState, useCallback } from "react";
import { getBookmarks } from "@/services/bookmarkService";

// ---------------- CUSTOM BOOKMARK HOOK ----------------
export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---- Fetch bookmarks from database ----
  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      console.error("Fetch bookmarks error:", err);
      setError("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookmarks,
    setBookmarks,
    fetchBookmarks,
    loading,
    error,
  };
}
