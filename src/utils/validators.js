// ---------------- URL VALIDATOR ----------------
export const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  try {
    const parsedUrl = new URL(url.trim());

    // allow only http / https protocols
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// ---------------- REQUIRED FIELD VALIDATOR ----------------
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== "";
};

// ---------------- BOOKMARK VALIDATOR (Future Ready) ----------------
export const validateBookmark = ({ title, url }) => {
  if (!isRequired(title)) {
    return { valid: false, message: "Title is required" };
  }

  if (!isValidUrl(url)) {
    return { valid: false, message: "Invalid URL format" };
  }

  return { valid: true };
};
