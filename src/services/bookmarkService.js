import { supabase } from "@/lib/supabase";

// ---------------- CONSTANTS ----------------
const TABLE_NAME = "bookmarks";

// ---------------- ERROR HANDLER ----------------
const handleError = (error, message) => {
  console.error(message, error);
  throw new Error(message);
};

// ---------------- GET BOOKMARKS ----------------
export const getBookmarks = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    handleError(error, "Failed to fetch bookmarks");
  }
};

// ---------------- CREATE BOOKMARK ----------------
export const createBookmark = async (bookmark) => {
  try {
    if (!bookmark?.title || !bookmark?.url || !bookmark?.user_id) {
      throw new Error("Invalid bookmark data");
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([bookmark])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    handleError(error, "Failed to create bookmark");
  }
};

// ---------------- DELETE BOOKMARK ----------------
export const removeBookmark = async (id) => {
  try {
    if (!id) throw new Error("Bookmark ID required");

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    handleError(error, "Failed to delete bookmark");
  }
};
