import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import LazyImage from "./LazyImage";
import { formatDate } from "../utils/format";

/**
 * One post as a card in the blog grid.
 *
 * @param {{
 *   post: import("../api/posts").PostSummary,
 *   darkMode: boolean,
 *   eagerImage?: boolean,   // true for the first card: it's the LCP element
 * }} props
 */
const BlogCard = ({ post, darkMode, eagerImage = false }) => (
  <Link
    to={`/blog/${post.slug}`}
    className={`group flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <LazyImage
      src={post.coverImage}
      alt={post.title}
      eager={eagerImage}
      darkMode={darkMode}
      className="h-48"
      imgClassName="transition-transform duration-500 group-hover:scale-110"
    />

    <div className="flex flex-col flex-grow p-5">
      {post.publishedAt && (
        <div
          className={`flex items-center gap-1.5 text-xs mb-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <Calendar size={14} />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>
      )}

      <h3
        className={`text-lg font-semibold mb-3 line-clamp-2 transition-colors ${
          darkMode
            ? "text-gray-100 group-hover:text-cyan-400"
            : "text-gray-800 group-hover:text-cyan-600"
        }`}
      >
        {post.title}
      </h3>

      <span
        className={`mt-auto inline-flex items-center gap-1 text-sm font-medium ${
          darkMode ? "text-cyan-400" : "text-cyan-600"
        }`}
      >
        Read article
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </div>
  </Link>
);

export default BlogCard;
