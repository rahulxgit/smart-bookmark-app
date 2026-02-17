"use client";

import {
  TrashIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function BookmarkCard({ bookmark, onDelete }) {
  // ---- Extract domain for favicon (professional touch) ----
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  const domain = getDomain(bookmark.url);

  return (
    <div className="group flex items-center justify-between gap-4 p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200">
      {/* LEFT CONTENT */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Favicon */}
        {domain && (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt="favicon"
            className="w-8 h-8 rounded"
          />
        )}

        {/* Title + URL */}
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {bookmark.title}
          </h3>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 flex items-center gap-1 hover:underline truncate"
          >
            {bookmark.url}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={() => onDelete(bookmark.id)}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
        aria-label="Delete bookmark"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
