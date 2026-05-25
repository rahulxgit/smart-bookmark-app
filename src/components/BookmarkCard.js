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
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300">
      
      {/* Background Gradient Hover Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

      {/* LEFT CONTENT */}
      <div className="flex items-center gap-4 flex-1 min-w-0 z-10 w-full sm:w-auto">
        {/* Favicon Container */}
        <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
          {domain ? (
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
              alt="favicon"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          {/* Fallback Icon */}
          <div className="text-slate-400 dark:text-slate-500 font-bold text-lg" style={{ display: domain ? 'none' : 'block' }}>
            {bookmark.title?.charAt(0).toUpperCase() || "B"}
          </div>
        </div>

        {/* Title + URL */}
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {bookmark.title}
          </h3>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate w-max max-w-full"
          >
            {bookmark.url.replace(/^https?:\/\/(www\.)?/, '')}
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 self-end sm:self-auto z-10 w-full sm:w-auto justify-end mt-2 sm:mt-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all sm:hidden group-hover:flex"
          aria-label="Open bookmark"
        >
          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
        </a>

        <button
          onClick={() => onDelete(bookmark.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete bookmark"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
