/**
 * Presentation helpers shared by anything that renders post content.
 */

/** "2026-07-11T12:36:54.082497Z" -> "11 July 2026" */
export const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const stripHtml = (html) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** Reading time from an HTML body, at ~200 words per minute. */
export const readingTime = (html) => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** Plain-text preview for a card, cut on a word boundary. */
export const excerpt = (html, maxLength = 140) => {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" ")) || cut}…`;
};

/**
 * Post bodies arrive as HTML and are rendered with dangerouslySetInnerHTML, so
 * strip anything executable first: tags are allowlisted, and every on* handler
 * and javascript:/data: URL is dropped.
 */
const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "a", "img", "code", "pre",
  "table", "thead", "tbody", "tr", "th", "td",
  "figure", "figcaption", "span", "div",
  "iframe",
]);

// `data-youtube-id` is on the list because the slot divs we synthesize below
// carry it; its value is always an id we parsed ourselves, never author text.
const ALLOWED_ATTRS = new Set([
  "href", "src", "alt", "title", "colspan", "rowspan", "data-youtube-id",
]);

// `class` carries no behaviour, but an author-supplied one could collide with an
// app class, so only the wrappers our own CSS styles keep theirs. The editor
// emits `instagram-embed` around an IG post and `video` around a YouTube one.
const ALLOWED_CLASSES = new Set(["instagram-embed", "video", "youtube-slot"]);

// An <iframe> runs someone else's page inside ours, so it survives sanitizing
// only when it points at an embed host we've deliberately chosen to trust.
// YouTube is deliberately absent: its iframes are pulled out and replaced with
// the click-to-play facade (see YOUTUBE_SLOT below) rather than framed directly.
const EMBED_HOSTS = new Map([
  ["www.instagram.com", "encrypted-media; picture-in-picture"],
  ["instagram.com", "encrypted-media; picture-in-picture"],
]);

/** The host's `allow` value if we trust it to frame us, otherwise null. */
const embedPermissions = (src) => {
  try {
    const url = new URL(src ?? "", window.location.origin);
    if (url.protocol !== "https:") return null;
    return EMBED_HOSTS.get(url.hostname) ?? null;
  } catch {
    return null;
  }
};

/**
 * A YouTube iframe in a post body would load ~500KB of player JS on page load and
 * come with YouTube's own chrome (channel bar, "Watch on YouTube"). We don't want
 * either, so sanitizing swaps each one for an empty div carrying just the video
 * id; BlogPost then renders a <YouTubeEmbed> facade into the slot.
 */
export const YOUTUBE_SLOT_CLASS = "youtube-slot";
export const YOUTUBE_SLOT_ID_ATTR = "data-youtube-id";

const YOUTUBE_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "www.youtube-nocookie.com",
  "youtu.be",
]);

/** The 11-char video id from any YouTube URL shape (/embed/, /shorts/, ?v=, youtu.be). */
export const youtubeVideoId = (src) => {
  let url;
  try {
    url = new URL(src ?? "", window.location.origin);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  const fromPath = /\/(?:embed|shorts|v|live)\/([A-Za-z0-9_-]{11})/.exec(url.pathname);
  if (fromPath) return fromPath[1];

  if (url.hostname === "youtu.be") {
    const id = url.pathname.slice(1);
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }

  const v = url.searchParams.get("v");
  return v && /^[A-Za-z0-9_-]{11}$/.test(v) ? v : null;
};

const isSafeUrl = (value) =>
  !/^\s*(javascript|data|vbscript):/i.test((value ?? "").trim());

export const sanitizeHtml = (html) => {
  if (!html || typeof window === "undefined") return "";

  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      el.replaceWith(...el.childNodes); // keep the text, drop the tag
      return;
    }

    let permissions = null;

    if (tag === "iframe") {
      const src = el.getAttribute("src");
      const videoId = youtubeVideoId(src);

      // A YouTube frame is replaced by a slot the facade mounts into. The id is
      // re-derived from the URL and re-emitted, so nothing the author wrote
      // (extra params, a hostile `allow`) survives into the DOM.
      if (videoId) {
        const slot = doc.createElement("div");
        slot.setAttribute("class", YOUTUBE_SLOT_CLASS);
        slot.setAttribute(YOUTUBE_SLOT_ID_ATTR, videoId);
        el.replaceWith(slot);
        return;
      }

      // Unwrapping an untrusted iframe would leave its empty children in place
      // of the frame; drop the element instead.
      permissions = embedPermissions(src);
      if (!permissions) {
        el.remove();
        return;
      }
    }

    [...el.attributes].forEach(({ name, value }) => {
      const attr = name.toLowerCase();
      const isUrlAttr = attr === "href" || attr === "src";

      if (attr === "class") {
        const kept = value.split(/\s+/).filter((cls) => ALLOWED_CLASSES.has(cls));
        if (kept.length) el.setAttribute("class", kept.join(" "));
        else el.removeAttribute(name);
        return;
      }

      if (!ALLOWED_ATTRS.has(attr) || (isUrlAttr && !isSafeUrl(value))) {
        el.removeAttribute(name);
      }
    });

    if (tag === "a") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
    if (tag === "img") {
      el.setAttribute("loading", "lazy");
    }
    if (tag === "iframe") {
      // Set here rather than allowlisted, so a post body can't widen `allow` or
      // talk its way out of the sandbox by supplying its own values.
      el.setAttribute("loading", "lazy");
      el.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      el.setAttribute("allow", permissions);
      el.setAttribute("allowfullscreen", "");
      el.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      );
    }
  });

  return doc.body.innerHTML;
};
