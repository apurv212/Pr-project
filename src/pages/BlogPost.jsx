import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Calendar, Clock, RefreshCw, User } from "lucide-react";
import SiteLayout from "../components/SiteLayout";
import RelatedStories from "../components/RelatedStories";
import ShareButton from "../components/ShareButton";
import LazyImage from "../components/LazyImage";
import YouTubeEmbed from "../components/YouTubeEmbed";
import { BlogPostSkeleton } from "../components/Skeleton";
import { getPost } from "../api/posts";
import { useApi } from "../hooks/useApi";
import {
  YOUTUBE_SLOT_CLASS,
  YOUTUBE_SLOT_ID_ATTR,
  formatDate,
  readingTime,
  sanitizeHtml,
} from "../utils/format";

const BlogPost = ({ darkMode = false, toggleDarkMode }) => {
  const { slug } = useParams();

  const { data: post, error, isLoading, reload } = useApi(
    ({ signal }) => getPost(slug, { signal }),
    [slug]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} — Apurv Shashvat`;
    return () => {
      document.title = "Apurv Shashvat";
    };
  }, [post?.title]);

  // The API serves body as HTML; strip anything executable before injecting it.
  // Sanitizing also turns any YouTube iframe into an empty slot, which we then
  // split the body around so a real <YouTubeEmbed> can be rendered in its place.
  const segments = useMemo(() => splitAtVideoSlots(sanitizeHtml(post?.body)), [post?.body]);

  return (
    <SiteLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <article className="container mx-auto px-5 sm:px-6 pt-4 pb-12 sm:pt-10 sm:pb-16 max-w-3xl lg:max-w-6xl">
        <Link
          to="/blog"
          className={`inline-flex items-center gap-1.5 text-sm mb-5 sm:mb-8 transition-colors ${
            darkMode
              ? "text-gray-400 hover:text-cyan-400"
              : "text-gray-500 hover:text-cyan-600"
          }`}
        >
          <ArrowLeft size={16} />
          All posts
        </Link>

        {isLoading && (
          <div role="status" aria-label="Loading post">
            <BlogPostSkeleton darkMode={darkMode} />
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
            <p className="mb-1 font-medium">
              {error.isNotFound ? "That post doesn't exist." : "Couldn't load this post."}
            </p>
            <p className="text-sm mb-6 opacity-80">{error.message}</p>

            {!error.isNotFound && (
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
            )}
          </div>
        )}

        {!isLoading && !error && post && (
          // Article + sidebar sit side by side from `lg` up; below that the
          // sidebar falls back under the body, which is the mobile layout.
          <div className="lg:flex lg:items-start lg:gap-10">
            <div className="min-w-0 lg:flex-1">
            <header className="mb-8">
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight text-balance ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {post.title}
              </h1>

              <div
                className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {post.author}
                  </span>
                )}
                {post.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </span>
                )}
                {post.body && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {readingTime(post.body)} min read
                  </span>
                )}

                <ShareButton title={post.title} darkMode={darkMode} />
              </div>
            </header>

            {post.coverImage && (
              // Aspect ratio is fixed so the article body doesn't jump down when
              // the cover lands. Eager: it's the LCP element on this page.
              <LazyImage
                src={post.coverImage}
                alt={post.title}
                eager
                darkMode={darkMode}
                className="aspect-video w-full rounded-lg shadow-lg mb-10"
              />
            )}

            {post.youtubeEmbedUrl && (
              <YouTubeEmbed
                embedUrl={post.youtubeEmbedUrl}
                watchUrl={post.youtubeUrl}
                title={post.title}
                darkMode={darkMode}
              />
            )}

            <div className={`blog-body ${darkMode ? "blog-body--dark" : ""}`}>
              {segments.map((segment, i) =>
                segment.type === "video" ? (
                  <YouTubeEmbed
                    key={`video-${i}-${segment.videoId}`}
                    videoId={segment.videoId}
                    title={post.title}
                    darkMode={darkMode}
                  />
                ) : (
                  <div
                    key={`html-${i}`}
                    dangerouslySetInnerHTML={{ __html: segment.html }}
                  />
                )
              )}
            </div>

            </div>

            {/* `top-24` clears the fixed header when the sidebar sticks. */}
            <aside className="lg:sticky lg:top-24 lg:w-72 lg:flex-none xl:w-80">
              <RelatedStories currentSlug={slug} darkMode={darkMode} />
            </aside>
          </div>
        )}
      </article>
    </SiteLayout>
  );
};

/**
 * Cut sanitized body HTML into an alternating list of HTML runs and video slots:
 * [{type:"html", html}, {type:"video", videoId}, {type:"html", html}, …]
 *
 * A YouTube embed has to be a real React component (it holds click-to-play state
 * and fetches its own aspect ratio), and dangerouslySetInnerHTML can't host one —
 * so the body is rendered as several fragments with components between them
 * rather than as one blob.
 */
const splitAtVideoSlots = (html) => {
  if (!html) return [];
  if (typeof window === "undefined") return [{ type: "html", html }];

  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc.querySelector(`.${YOUTUBE_SLOT_CLASS}`)) return [{ type: "html", html }];

  // A slot is usually wrapped (<div class="video"><slot></div>). Hoist each one
  // to the top level first, so the walk below is a flat scan and a wrapper that
  // also held a caption keeps it instead of being dropped with the iframe.
  doc.querySelectorAll(`.${YOUTUBE_SLOT_CLASS}`).forEach((slot) => {
    while (slot.parentElement && slot.parentElement !== doc.body) {
      const parent = slot.parentElement;
      const after = parent.cloneNode(false); // same wrapper, for what follows the slot

      while (slot.nextSibling) after.appendChild(slot.nextSibling);

      parent.after(slot);
      if (after.childNodes.length) slot.after(after);
      if (!parent.childNodes.length) parent.remove();
    }
  });

  const segments = [];
  let buffer = "";

  const flush = () => {
    if (buffer.trim()) segments.push({ type: "html", html: buffer });
    buffer = "";
  };

  doc.body.childNodes.forEach((node) => {
    const isSlot =
      node.nodeType === Node.ELEMENT_NODE && node.classList.contains(YOUTUBE_SLOT_CLASS);

    if (!isSlot) {
      buffer += node.nodeType === Node.TEXT_NODE ? node.textContent : (node.outerHTML ?? "");
      return;
    }

    flush();
    segments.push({ type: "video", videoId: node.getAttribute(YOUTUBE_SLOT_ID_ATTR) });
  });

  flush();
  return segments;
};

export default BlogPost;
