import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Calendar, Clock, RefreshCw, User } from "lucide-react";
import SiteLayout from "../components/SiteLayout";
import RelatedStories from "../components/RelatedStories";
import ShareButton from "../components/ShareButton";
import LazyImage from "../components/LazyImage";
import { BlogPostSkeleton } from "../components/Skeleton";
import { getPost } from "../api/posts";
import { useApi } from "../hooks/useApi";
import { formatDate, readingTime, sanitizeHtml } from "../utils/format";

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
  const safeBody = useMemo(() => sanitizeHtml(post?.body), [post?.body]);

  return (
    <SiteLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <article className="container mx-auto px-5 sm:px-6 pt-4 pb-12 sm:pt-10 sm:pb-16 max-w-3xl">
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
          <>
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
              <div className="relative w-full mb-10 rounded-lg overflow-hidden shadow-lg aspect-video">
                <iframe
                  src={post.youtubeEmbedUrl}
                  title={post.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            )}

            <div
              className={`blog-body ${darkMode ? "blog-body--dark" : ""}`}
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />

            <RelatedStories currentSlug={slug} darkMode={darkMode} />
          </>
        )}
      </article>
    </SiteLayout>
  );
};

export default BlogPost;
