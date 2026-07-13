// Navbar.jsx
import React from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const Navbar = ({
  isMenuOpen,
  setIsMenuOpen,
  isScrolled,
  darkMode,
  toggleDarkMode,
  scrollToSection,
}) => {
  // Most items scroll to a section on this page; Blog is a route of its own.
  const navItems = [
    { label: "Home", section: "home" },
    { label: "About Me", section: "about-me" },
    { label: "Experience", section: "experience" },
    { label: "Projects", section: "projects" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", section: "contact" },
  ];

  const { pathname } = useLocation();
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const brandLabel = isBlog ? "Tech News" : "Apurv Shashvat";

  const trackClick = (label) =>
    ReactGA.event({
      category: "Navigation",
      action: "Clicked Menu Item",
      label,
    });

  const linkClasses = darkMode
    ? "text-gray-300 hover:text-cyan-400"
    : "text-gray-600 hover:text-cyan-600";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? darkMode
            ? "bg-gray-800 shadow-md py-2"
            : "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className={`text-xl font-bold ${
              darkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          >
            <span className="transition-all duration-300">{brandLabel}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => trackClick(item.label)}
                  className={`transition-colors duration-300 ${linkClasses}`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    scrollToSection(item.section);
                    trackClick(item.label);
                  }}
                  className={`transition-colors duration-300 ${linkClasses}`}
                >
                  {item.label}
                </button>
              )
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 mr-2 rounded-full transition-colors ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={darkMode ? "text-gray-300" : "text-gray-600"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`md:hidden shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col px-4 py-2">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => {
                    trackClick(item.label);
                    setIsMenuOpen(false);
                  }}
                  className={`py-3 text-left transition-colors duration-300 ${linkClasses}`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.section)}
                  className={`py-3 text-left transition-colors duration-300 ${linkClasses}`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;