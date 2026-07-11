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
]);

const ALLOWED_ATTRS = new Set(["href", "src", "alt", "title", "colspan", "rowspan"]);

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

    [...el.attributes].forEach(({ name, value }) => {
      const attr = name.toLowerCase();
      const isUrlAttr = attr === "href" || attr === "src";

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
  });

  return doc.body.innerHTML;
};
