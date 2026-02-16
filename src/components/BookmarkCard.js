"use client";

export default function BookmarkCard({ bookmark, onDelete }) {
  return (
    <div className="flex justify-between items-center border rounded p-4 hover:shadow transition">
      {/* LEFT SIDE */}
      <div className="flex flex-col">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium text-blue-600 hover:underline"
        >
          {bookmark.title}
        </a>

        <p className="text-sm text-gray-500 truncate max-w-md">
          {bookmark.url}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <button
        onClick={() => onDelete(bookmark.id)}
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Delete
      </button>
    </div>
  );
}
