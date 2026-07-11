import React from "react";
import MPlayer from "../MPlayer";

const Footer = ({ darkMode }) => (
  <footer
    className={`py-6 text-center relative overflow-x-hidden ${
      darkMode ? "bg-gray-950 text-gray-500" : "bg-gray-800 text-gray-400"
    }`}
  >
    <div className="container mx-auto px-4">
      <p className="text-sm sm:text-base break-words">
        © 2025 Apurv Shashvat - contact for personal website making 7677672641 and SEO boosting
      </p>
    </div>

    <MPlayer darkMode={darkMode} />
  </footer>
);

export default Footer;
