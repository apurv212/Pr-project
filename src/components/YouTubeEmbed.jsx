import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";

/**
 * A click-to-play YouTube facade.
 *
 * At rest this is just a thumbnail and a play button — none of YouTube's player
 * JS (~500KB) is fetched, so a reader who never watches pays nothing for the
 * embed, and none of YouTube's chrome (channel bar, "Watch on YouTube") shows.
 * The real <iframe> only mounts on click, and because that click is a user
 * gesture the browser lets it autoplay *with sound*: one click, not two.
 *
 * Shape is measured, not guessed. A Short is 9:16 and a normal upload 16:9, and
 * an iframe pasted into a post body carries no hint which it is — so we ask
 * YouTube's oEmbed endpoint for the video's real dimensions and match them.
 * Until that lands (or if it fails) we assume 16:9, the common case.
 *
 * @param {{
 *   videoId?: string,        // preferred: the bare 11-char id
 *   embedUrl?: string,       // https://www.youtube.com/embed/<id> — id parsed out of it
 *   watchUrl?: string|null,  // https://youtube.com/shorts/<id> — a free Shorts hint
 *   title: string,
 *   darkMode?: boolean,
 * }} props
 */
const YouTubeEmbed = ({ videoId, embedUrl, watchUrl, title, darkMode = false }) => {
  const id = videoId ?? extractVideoId(embedUrl);

  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  // A /shorts/ watch URL is proof on its own, so start there and let the fetched
  // dimensions correct us if it was absent.
  const [portrait, setPortrait] = useState(() => /\/shorts\//.test(watchUrl ?? ""));

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    // oEmbed is public, CORS-open, and needs no API key. It reports the player's
    // natural width/height, which is the only way to tell a Short from a
    // landscape video when all we were given is an /embed/ URL.
    fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${id}`
      )}`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then(({ width, height }) => {
        if (width > 0 && height > 0) setPortrait(height > width);
      })
      // A private/removed video, a rate limit, or an offline network all land
      // here. 16:9 is the safe default, so there is nothing to recover from.
      .catch(() => {});

    return () => controller.abort();
  }, [id]);

  if (!id) return null;

  // maxres doesn't exist for every upload; hq always does. We start with maxres
  // and fall back on error rather than probing, to keep this to one request.
  const thumbnail = thumbFailed
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

  const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;

  // The frame is what gives the video its shape. A portrait video gets a box that
  // is capped so it can't swallow the whole column; a landscape one fills the
  // column at 16:9.
  const frameClass = portrait
    ? "relative mx-auto mb-10 aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-lg shadow-lg"
    : "relative mb-10 aspect-video w-full overflow-hidden rounded-lg shadow-lg";

  if (playing) {
    return (
      <div className={frameClass}>
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${title}`}
        className={`group absolute inset-0 h-full w-full cursor-pointer border-0 p-0 ${
          darkMode ? "bg-gray-800" : "bg-gray-900"
        }`}
      >
        <img
          src={thumbnail}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onError={() => setThumbFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/25" />

        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110">
          <Play
            size={26}
            className="ml-1 fill-gray-900 text-gray-900"
            aria-hidden="true"
          />
        </span>
      </button>
    </div>
  );
};

/** Pull the 11-char id out of a /embed/<id> URL. */
const extractVideoId = (embedUrl) => {
  const match = /\/embed\/([A-Za-z0-9_-]{11})/.exec(embedUrl ?? "");
  return match ? match[1] : null;
};

export default YouTubeEmbed;
