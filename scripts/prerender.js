import { writeFile, mkdir, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";

/**
 * Build-time prerendering for the blog.
 *
 * The SPA ships one index.html for every URL, so a crawler asking for a post
 * gets the portfolio's <title> and a canonical pointing at the homepage — i.e.
 * "this page is a duplicate, don't index it". React fixes the tags after the
 * API resolves, but that is far too late: Google reads the raw HTML, and
 * WhatsApp/LinkedIn/Twitter never run JavaScript at all.
 *
 * So at build time we fetch every post and emit a real
 *   dist/blog/<slug>/index.html
 * carrying that post's own title, description, cover and self-canonical, plus a
 * sitemap listing them. The SPA still hydrates on top — this only fixes <head>.
 */

const SITE_URL = "https://pr-project-puce.vercel.app";
const API_BASE = process.env.VITE_API_BASE_URL || "https://apurv212.pythonanywhere.com";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fetchJson = async (url) => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
};

/**
 * Rewrite the <head> of the SPA shell for one post.
 *
 * Every tag is *replaced*, never appended: the shell already carries the
 * portfolio's title/canonical/og tags, and leaving those beside the post's own
 * would leave the duplicate-content signal intact.
 */
const renderPostHtml = (shell, post) => {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = escapeHtml(post.meta_title || post.title);
  const description = escapeHtml(post.meta_description || "");
  const image = post.cover_image
    ? escapeHtml(post.cover_image)
    : `${SITE_URL}/og-image.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta_title || post.title,
    description: post.meta_description || undefined,
    image: post.cover_image || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.published_at || undefined,
    author: { "@type": "Person", name: post.author || "Apurv Shashvat" },
    publisher: { "@type": "Person", name: "Apurv Shashvat" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta property="og:image"[^>]*>/,
      `<meta property="og:image" content="${image}" />`
    )
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(
      /<meta property="og:type"[^>]*>/,
      `<meta property="og:type" content="article" />`
    )
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${description}" />`
    )
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${image}" />`
    )
    .replace(
      "</head>",
      `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>\n  </head>`
    );
};

const renderSitemap = (posts) => {
  const entry = (loc, lastmod, priority) =>
    [
      "  <url>",
      `    <loc>${escapeHtml(loc)}</loc>`,
      lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entry(`${SITE_URL}/`, null, "1.0"),
    entry(`${SITE_URL}/blog`, null, "0.9"),
    ...posts.map((p) => entry(`${SITE_URL}/blog/${p.slug}`, p.published_at, "0.8")),
    "</urlset>",
    "",
  ].join("\n");
};

export const prerenderBlog = () => ({
  name: "prerender-blog",
  apply: "build",

  // closeBundle: dist/ is fully written, so index.html exists to use as a shell.
  async closeBundle() {
    const dist = resolve(process.cwd(), "dist");
    const shell = await readFile(resolve(dist, "index.html"), "utf8");

    console.log(`\n[prerender] fetching posts from ${API_BASE}`);

    // A failure here must abort the build. Shipping the SPA with zero prerendered
    // posts looks fine locally but silently re-ships the un-indexable site this
    // exists to fix — better that Vercel keeps serving the last good deploy.
    const summaries = await fetchJson(`${API_BASE}/api/posts/all/`);
    if (!Array.isArray(summaries) || summaries.length === 0) {
      throw new Error("[prerender] /api/posts/all/ returned no posts — aborting build");
    }

    const posts = [];
    for (const summary of summaries) {
      // Serial, not parallel: the API throttles at 60 requests/min per IP.
      const detail = await fetchJson(
        `${API_BASE}/api/posts/${encodeURIComponent(summary.slug)}/`
      );
      const post = { ...summary, ...detail };

      const file = resolve(dist, "blog", post.slug, "index.html");
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, renderPostHtml(shell, post), "utf8");
      posts.push(post);

      console.log(`[prerender] blog/${post.slug}/index.html`);
    }

    await writeFile(resolve(dist, "sitemap.xml"), renderSitemap(posts), "utf8");
    console.log(`[prerender] sitemap.xml — ${posts.length + 2} urls\n`);
  },
});
