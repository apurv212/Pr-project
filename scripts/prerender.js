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
 * sitemap listing them.
 *
 * The <body> matters as much as the <head>. The shell's #root holds a static
 * snapshot of the *portfolio* ("Hello, I'm Apurv Shashvat", Projects, Contact),
 * so rewriting only <head> served metadata about the article wrapped around a
 * body about something else — which reads to a crawler as a mismatched, thin
 * page. So #root is replaced with the post's own content too. React hydrates
 * over it on mount, so nothing changes for users with JS.
 */

// The canonical domain. Every self-canonical, og:url and sitemap <loc> is built
// from this, so it must be the one domain we want indexed — pr-project-puce
// .vercel.app now 301s here, and pointing these back at it would tell Google to
// index the redirect source instead.
const SITE_URL = "https://apurvshashvat.tech";
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
 * Swap the shell's #root — a static snapshot of the portfolio — for `inner`.
 *
 * Anchored on </body> rather than the module <script>: Vite hoists that script
 * into <head> at build time, so in dist/index.html it sits *above* #root and is
 * useless as an end marker. #root is the last element in <body>.
 */
const replaceRoot = (shell, inner) => {
  const next = shell.replace(
    /<div id="root">[\s\S]*<\/div>\s*(?=<\/body>)/,
    `<div id="root">\n${inner}\n    </div>\n  `
  );
  if (next === shell) {
    // The shell changed shape and the body is still the portfolio. Failing loud
    // beats shipping a build that looks fine and silently re-breaks indexing.
    throw new Error("[prerender] could not find #root in shell — aborting build");
  }
  return next;
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

/** Crawlable body for one post: the article itself, not the portfolio. */
const renderPostBody = (post) => {
  const heading = escapeHtml(post.title || post.meta_title);
  const date = post.published_at
    ? `<time datetime="${escapeHtml(post.published_at)}">${escapeHtml(
        formatDate(post.published_at)
      )}</time>`
    : "";
  const cover = post.cover_image
    ? `<img src="${escapeHtml(post.cover_image)}" alt="${heading}" width="1200" height="630" />`
    : "";

  return `      <header>
        <p>Tech News</p>
        <nav aria-label="Primary"><a href="/">Home</a> <a href="/blog">Blog</a></nav>
      </header>

      <main>
        <article>
          <h1>${heading}</h1>
          <p>By ${escapeHtml(post.author || "Apurv Shashvat")} ${date}</p>
          ${cover}
          ${post.body || ""}
        </article>
      </main>`;
};

/** Crawlable body for /blog: a real list of links, so the posts are discoverable. */
const renderBlogListBody = (posts) => {
  const items = posts
    .map((post) => {
      const heading = escapeHtml(post.title || post.meta_title);
      const date = post.published_at
        ? `<time datetime="${escapeHtml(post.published_at)}">${escapeHtml(
            formatDate(post.published_at)
          )}</time>`
        : "";
      return `          <li>
            <h2><a href="/blog/${escapeHtml(post.slug)}">${heading}</a></h2>
            ${date}
            <p>${escapeHtml(post.meta_description || "")}</p>
          </li>`;
    })
    .join("\n");

  return `      <header>
        <p>Tech News</p>
        <nav aria-label="Primary"><a href="/">Home</a> <a href="/blog">Blog</a></nav>
      </header>

      <main>
        <h1>Tech News</h1>
        <ul>
${items}
        </ul>
      </main>`;
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
  // meta_title arrives pre-truncated to ~60 chars with a trailing "…", which is
  // right for <title> (a display budget) and wrong everywhere else: a headline
  // or share card ending mid-word is a quality signal against us. Those get the
  // full title.
  const tabTitle = escapeHtml(post.meta_title || post.title);
  const fullTitle = escapeHtml(post.title || post.meta_title);
  const description = escapeHtml(post.meta_description || "");
  const image = post.cover_image
    ? escapeHtml(post.cover_image)
    : `${SITE_URL}/og-image.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || post.meta_title,
    description: post.meta_description || undefined,
    image: post.cover_image || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.published_at || undefined,
    author: { "@type": "Person", name: post.author || "Apurv Shashvat" },
    publisher: { "@type": "Person", name: "Apurv Shashvat" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return replaceRoot(shell, renderPostBody(post))
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${tabTitle}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${fullTitle}" />`
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
      `<meta name="twitter:title" content="${fullTitle}" />`
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

    // /blog served the portfolio snapshot too, so the list page offered a
    // crawler no links to the posts — nothing to follow, nothing to discover.
    const listUrl = `${SITE_URL}/blog`;
    const listHtml = replaceRoot(shell, renderBlogListBody(posts))
      .replace(/<title>[\s\S]*?<\/title>/, "<title>Tech News — Latest AI &amp; Tech Updates</title>")
      .replace(
        /<meta\s+name="description"[\s\S]*?\/>/,
        '<meta name="description" content="Tech News — the latest on AI tools, models, and developer tooling." />'
      )
      .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${listUrl}" />`)
      .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${listUrl}" />`)
      .replace(
        /<meta property="og:title"[^>]*>/,
        '<meta property="og:title" content="Tech News — Latest AI &amp; Tech Updates" />'
      );

    const listFile = resolve(dist, "blog", "index.html");
    await mkdir(dirname(listFile), { recursive: true });
    await writeFile(listFile, listHtml, "utf8");
    console.log(`[prerender] blog/index.html — ${posts.length} posts linked`);

    await writeFile(resolve(dist, "sitemap.xml"), renderSitemap(posts), "utf8");
    console.log(`[prerender] sitemap.xml — ${posts.length + 2} urls\n`);
  },
});
