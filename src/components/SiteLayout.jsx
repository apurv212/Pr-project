import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "./Footer";

/**
 * Chrome shared by the routed pages that aren't the portfolio (i.e. the blog):
 * fixed Navbar, footer, and back-to-top button.
 *
 * The Navbar's section links only mean something on the portfolio, so here they
 * navigate to "/#<section>" and let Portfolio scroll on arrival.
 */
const SiteLayout = ({ darkMode, toggleDarkMode, children }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0
          ? Math.min(100, Math.max(0, (scrollPosition / docHeight) * 100))
          : 0;

      setIsScrolled(scrollPosition > 10);
      setShowScrollTop(scrollPosition > 200);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const goToSection = (sectionId) => {
    setIsMenuOpen(false);
    navigate(`/#${sectionId}`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden w-full max-w-[100vw] ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isScrolled={isScrolled}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        scrollToSection={goToSection}
      />

      {/* Offsets the fixed header so page content doesn't start underneath it. */}
      <main className="flex-1 pt-16 sm:pt-20">{children}</main>

      <Footer darkMode={darkMode} />

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-progress-btn fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 group"
          aria-label="Scroll to top"
        >
          <svg className="scroll-progress-ring" viewBox="0 0 56 56" aria-hidden="true">
            <circle className="scroll-progress-track" cx="28" cy="28" r="24" />
            <circle
              className="scroll-progress-bar"
              cx="28"
              cy="28"
              r="24"
              style={{
                strokeDasharray: 150.8,
                strokeDashoffset: 150.8 - (150.8 * scrollProgress) / 100,
              }}
            />
          </svg>
          <ArrowUp
            size={20}
            className={`scroll-progress-icon ${
              darkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          />
        </button>
      )}
    </div>
  );
};

export default SiteLayout;
