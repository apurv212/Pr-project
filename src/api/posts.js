import { get } from "./client";

/**
 * Blog posts resource: the two endpoints, plus the normalizers that map the
 * raw snake_case payloads into the objects the UI consumes. A field rename on
 * the backend is fixed here and nowhere else.
 *
 * Every new API area gets a sibling module shaped like this one.
 */

/**
 * List item — GET /api/posts/
 * @typedef {object} PostSummary
 * @property {string} title
 * @property {string} slug
 * @property {string|null} coverImage
 * @property {string|null} publishedAt   ISO-8601, e.g. "2026-07-11T12:36:54.082497Z"
 */

/**
 * Detail — GET /api/posts/{slug}/. Extends PostSummary.
 * @typedef {PostSummary & {
 *   body: string,
 *   youtubeUrl: string|null,
 *   youtubeEmbedUrl: string|null,
 *   author: string|null,
 * }} Post
 */

const BASE = "/api/posts/";

const emptyToNull = (value) =>
  typeof value === "string" && value.trim() !== "" ? value : null;

/** @returns {PostSummary} */
const toPostSummary = (raw) => ({
  title: raw?.title ?? "Untitled",
  slug: raw?.slug ?? "",
  coverImage: emptyToNull(raw?.cover_image),
  publishedAt: emptyToNull(raw?.published_at),
});

/** @returns {Post} */
const toPost = (raw) => ({
  ...toPostSummary(raw),
  body: raw?.body ?? "",
  youtubeUrl: emptyToNull(raw?.youtube_url),
  youtubeEmbedUrl: emptyToNull(raw?.youtube_embed_url),
  author: emptyToNull(raw?.author),
});

/** DRF pagination envelope -> {items, count, hasNext, hasPrevious}. */
const toPage = (raw, mapItem) => ({
  items: Array.isArray(raw?.results) ? raw.results.map(mapItem) : [],
  count: raw?.count ?? 0,
  hasNext: Boolean(raw?.next),
  hasPrevious: Boolean(raw?.previous),
});

/**
 * GET /api/posts/
 * @param {{page?: number, search?: string, signal?: AbortSignal}} [options]
 * @returns {Promise<{items: PostSummary[], count: number, hasNext: boolean, hasPrevious: boolean}>}
 */
export const listPosts = async ({ page, search, signal } = {}) => {
  const raw = await get(BASE, { params: { page, search }, signal });
  return toPage(raw, toPostSummary);
};

/**
 * GET /api/posts/{slug}/
 * @param {string} slug
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<Post>}
 */
export const getPost = async (slug, { signal } = {}) => {
  const raw = await get(`${BASE}${encodeURIComponent(slug)}/`, { signal });
  return toPost(raw);
};
