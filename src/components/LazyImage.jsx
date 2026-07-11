import React, { useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * An <img> that shows a shimmering placeholder until it decodes, then fades in.
 *
 * Covers are served from a remote host and can take seconds on mobile; without
 * this the card is a flat grey box that snaps to an image with no transition.
 *
 * The wrapper owns the box (height/aspect ratio comes from `className`), so the
 * layout never shifts when the image lands. `loading="lazy"` keeps offscreen
 * covers off the wire entirely.
 *
 * @param {{
 *   src: string|null,
 *   alt: string,
 *   className?: string,      // sizing/shape of the box
 *   imgClassName?: string,   // extra classes on the <img> itself (e.g. hover zoom)
 *   eager?: boolean,         // above-the-fold: skip lazy loading, raise priority
 *   darkMode?: boolean,
 * }} props
 */
const LazyImage = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  eager = false,
  darkMode = false,
}) => {
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  return (
    <div
      className={`relative overflow-hidden ${
        darkMode ? "bg-gray-700" : "bg-gray-100"
      } ${className}`}
    >
      {src && status === "loading" && (
        <div
          className={`absolute inset-0 skeleton-shimmer ${
            darkMode ? "skeleton-shimmer--dark" : ""
          }`}
        />
      )}

      {(!src || status === "error") && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            darkMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          <ImageOff size={22} aria-hidden="true" />
        </div>
      )}

      {src && status !== "error" && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default LazyImage;
