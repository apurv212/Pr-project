import React, { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";

/**
 * Shares the current post. Nothing here touches the API — a share is just the
 * post's own URL, which the frontend already knows.
 *
 * Mobile browsers get the OS share sheet (Web Share API); everywhere else the
 * link is copied to the clipboard and the button confirms it.
 *
 * @param {{title: string, darkMode: boolean}} props
 */
const ShareButton = ({ title, darkMode }) => {
  const [copied, setCopied] = useState(false);

  // Reset the "Link copied!" confirmation after a moment.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // The Clipboard API needs a secure context (https/localhost) and can be
      // blocked outright — fall back to the old execCommand trick.
      const input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(input);
      if (ok) setCopied(true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Dismissing the sheet throws AbortError — that's the user saying no,
        // not a failure, so don't quietly copy the link behind their back.
        if (error.name === "AbortError") return;
      }
    }

    await copyToClipboard(url);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : `Share "${title}"`}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        copied
          ? darkMode
            ? "bg-green-950 text-green-300"
            : "bg-green-100 text-green-700"
          : darkMode
            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-cyan-400"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-cyan-600"
      }`}
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? "Link copied!" : "Share"}
    </button>
  );
};

export default ShareButton;
