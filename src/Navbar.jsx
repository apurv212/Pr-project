// Navbar.jsx
import React from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import ReactGA from "react-ga4";

const Navbar = ({
  isMenuOpen,
  setIsMenuOpen,
  isScrolled,
  darkMode,
  toggleDarkMode,
  scrollToSection,
}) => {
  const navItems = ["Home", "About Me", "Experience", "Projects", "Contact"]; // Added "Experience"

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
          <div
            className={`text-xl font-bold ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            <span className="transition-all duration-300">Apurv Shashvat</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  scrollToSection(item.toLowerCase().replace(/\s+/g, "-"));
                  ReactGA.event({
                    category: "Navigation",
                    action: "Clicked Menu Item",
                    label: item,
                  });
                }}
                className={`transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-indigo-400"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {item}
              </button>
            ))}

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
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                }
                className={`py-3 text-left transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-indigo-400"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;