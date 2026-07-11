import React, { useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
} from "lucide-react";
import BlogCard from "../components/BlogCard";
import SiteLayout from "../components/SiteLayout";
import { BlogCardSkeleton } from "../components/Skeleton";
import { listPosts } from "../api/posts";
import { useApi } from "../hooks/useApi";

// Enough to fill the fold at every breakpoint (3 across at lg) without showing
// a wall of grey on mobile, where only the first is visible anyway.
const SKELETON_COUNT = 3;

const BlogList = ({ darkMode = false, toggleDarkMode }) => {
  const [page, setPage] = useState(1);

  const { data, error, isLoading, reload } = useApi(
    ({ signal }) => listPosts({ page, signal }),
    [page]
  );

  return (
    <SiteLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="container mx-auto px-5 sm:px-6 pt-4 pb-12 sm:pt-10 sm:pb-16 max-w-6xl">
        {isLoading && (
          <div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading posts"
          >
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <BlogCardSkeleton key={i} darkMode={darkMode} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div
            className={`rounded-lg p-8 text-center ${
              darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}
          >
            <AlertCircle
              size={40}
              className={`mx-auto mb-4 ${darkMode ? "text-red-400" : "text-red-500"}`}
            />
            <p className="mb-1 font-medium">Couldn't load the blog.</p>
            <p className="text-sm mb-6 opacity-80">{error.message}</p>
            <button
              onClick={reload}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-cyan-950 text-cyan-300 hover:bg-cyan-900"
                  : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
              }`}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && data?.items.length === 0 && (
          <div
            className={`rounded-lg p-12 text-center ${
              darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
            }`}
          >
            <FileText size={40} className="mx-auto mb-4 opacity-60" />
            <p className="font-medium">No posts published yet.</p>
            <p className="text-sm mt-1 opacity-80">Check back soon.</p>
          </div>
        )}

        {!isLoading && !error && data?.items.length > 0 && (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((post, i) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  darkMode={darkMode}
                  eagerImage={i === 0}
                />
              ))}
            </div>

            {(data.hasPrevious || data.hasNext) && (
              <nav className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.hasPrevious}
                  className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Page {page}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.hasNext}
                  className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
};

export default BlogList;
