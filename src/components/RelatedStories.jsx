import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import LazyImage from "./LazyImage";
import { RelatedStorySkeleton } from "./Skeleton";
import { listPosts } from "../api/posts";
import { formatDate } from "../utils/format";

const MAX_ITEMS = 5;
const SKELETON_COUNT = 3;

/**
 * "Related Stories" list shown under a post: thumbnail left, title + date right.
 *
 * The API has no topic/tag field, so "related" here means the latest posts (the
 * API already returns them newest-first) minus the one being read.
 *
 * The fetch is deferred until the section scrolls into view, so a reader who
 * bounces before the end of the article never pays for it.
 *
 * @param {{currentSlug: string, darkMode: boolean}} props
 */
const RelatedStories = ({ currentSlug, darkMode }) => {
  const sectionRef = useRef(null);
  const [posts, setPosts] = useState(null);
  // Distinct from `posts === null`: that state also covers "never started" and
  // "failed", and only the in-flight case should show skeletons.
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const controller = new AbortController();
    let cancelled = false;

    setPosts(null);
    setIsLoading(false);

    const load = async () => {
      if (cancelled) return;
      setIsLoading(true);
      try {
        const { items } = await listPosts({ signal: controller.signal });
        if (cancelled) return;
        setPosts(items.filter((p) => p.slug !== currentSlug).slice(0, MAX_ITEMS));
      } catch {
        // A failed sidebar shouldn't shout at the reader — just stay hidden.
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // No IntersectionObserver (old browser, SSR, jsdom): load rather than never show.
    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // fetch once
        load();
      },
      { rootMargin: "200px" } // start just before it scrolls into view
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      controller.abort();
    };
  }, [currentSlug]);

  // Failed, or this is the only post: render just the sentinel so the observer
  // has something to watch, but no empty heading.
  const hasPosts = posts !== null && posts.length > 0;
  const showSection = isLoading || hasPosts;

  return (
    // mt-14 spaces it below the article on mobile; in the desktop sidebar it sits
    // beside the article, so the gap is dropped and it aligns with the title.
    <section ref={sectionRef} className="mt-14 lg:mt-0">
      {showSection && (
        <h2
          className={`mb-5 border-l-4 border-cyan-500 pl-3 text-xl font-bold ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Related Stories
        </h2>
      )}

      {isLoading && (
        <div
          role="status"
          aria-label="Loading related stories"
          className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-200"}`}
        >
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <RelatedStorySkeleton key={i} darkMode={darkMode} />
          ))}
        </div>
      )}

      {hasPosts && (
        <ul className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-200"}`}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className={`group flex items-start gap-3 py-3 transition-colors ${
                  darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-100/70"
                }`}
              >
                <LazyImage
                  src={post.coverImage}
                  alt=""
                  darkMode={darkMode}
                  className="h-16 w-24 flex-none rounded sm:h-[70px] sm:w-28"
                />

                <div className="min-w-0">
                  {post.publishedAt && (
                    <span
                      className={`mb-1 flex items-center gap-1.5 text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <Calendar size={12} />
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </span>
                  )}

                  <h3
                    className={`text-sm font-semibold leading-snug transition-colors sm:text-base ${
                      darkMode
                        ? "text-gray-200 group-hover:text-cyan-400"
                        : "text-gray-800 group-hover:text-cyan-600"
                    }`}
                  >
                    {post.title}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RelatedStories;
