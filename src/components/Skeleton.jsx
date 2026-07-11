import React from "react";

/**
 * Loading placeholders. One shimmer definition (`.skeleton-shimmer` in App.css)
 * backs every skeleton on the site so they all pulse at the same rhythm.
 */

/** A single shimmering block. Size it with `className`. */
export const Skeleton = ({ className = "", darkMode = false }) => (
  <div
    aria-hidden="true"
    className={`skeleton-shimmer rounded ${
      darkMode ? "skeleton-shimmer--dark" : ""
    } ${className}`}
  />
);

/** Stand-in for a <BlogCard> while the list loads. Mirrors its box exactly. */
export const BlogCardSkeleton = ({ darkMode = false }) => (
  <div
    className={`flex flex-col overflow-hidden rounded-lg shadow-lg ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <Skeleton className="h-48 rounded-none" darkMode={darkMode} />

    <div className="flex flex-col gap-3 p-5">
      <Skeleton className="h-3 w-24" darkMode={darkMode} />
      <Skeleton className="h-4 w-full" darkMode={darkMode} />
      <Skeleton className="h-4 w-2/3" darkMode={darkMode} />
      <Skeleton className="mt-2 h-4 w-28" darkMode={darkMode} />
    </div>
  </div>
);

/** Stand-in for one row of <RelatedStories>: thumb left, two lines right. */
export const RelatedStorySkeleton = ({ darkMode = false }) => (
  <div className="flex items-start gap-3 py-3">
    <Skeleton
      className="h-16 w-24 flex-none sm:h-[70px] sm:w-28"
      darkMode={darkMode}
    />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-3 w-20" darkMode={darkMode} />
      <Skeleton className="h-4 w-full" darkMode={darkMode} />
      <Skeleton className="h-4 w-1/2" darkMode={darkMode} />
    </div>
  </div>
);

/** Stand-in for a full article while the post loads. */
export const BlogPostSkeleton = ({ darkMode = false }) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" darkMode={darkMode} />
      <Skeleton className="h-8 w-2/3" darkMode={darkMode} />
    </div>

    <div className="flex flex-wrap gap-4">
      <Skeleton className="h-4 w-24" darkMode={darkMode} />
      <Skeleton className="h-4 w-28" darkMode={darkMode} />
      <Skeleton className="h-4 w-20" darkMode={darkMode} />
    </div>

    <Skeleton className="aspect-video w-full rounded-lg" darkMode={darkMode} />

    <div className="space-y-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === 5 ? "w-2/3" : "w-full"}`}
          darkMode={darkMode}
        />
      ))}
    </div>
  </div>
);
