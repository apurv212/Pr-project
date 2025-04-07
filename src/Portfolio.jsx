// Portfolio.jsx
import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import Navbar from "./Navbar";
import Contact from "./Contact";
import Projects from "./Projectdetails";
import Experience from "./Experience"; 
import { ArrowDown, ArrowUp } from "lucide-react";

const TRACKING_ID = "G-H3XLBLJ77Y";

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
      setShowScrollTop(scrollPosition > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const text = "Hello, I'm Apurv Shashvat";

  return (
    <div
      className={`min-h-screen font-sans ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isScrolled={isScrolled}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section
        id="home"
        className="h-screen relative flex items-center justify-center"
      >
        <div
          className={`absolute inset-0 ${
            darkMode ? "bg-gray-900" : "bg-gray-800"
          } overflow-hidden`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/api/placeholder/1600/900')",
            }}
          />
        </div>

        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {text.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block animate-type-repeat"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Full Stack Web Developer, Designer
          </p>
          <button
            onClick={() => scrollToSection("projects")}
            className={`px-6 py-3 text-white rounded-full flex items-center mx-auto transform hover:scale-105 transition-all duration-300 ${
              darkMode
                ? "bg-indigo-700 hover:bg-indigo-800"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            View My Work
            <ArrowDown className="ml-2" size={18} />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ArrowDown className="text-white animate-bounce" size={24} />
        </div>
      </section>

      {/* About Me Section */}
      <section
        id="about-me"
        className={`py-20 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl font-bold text-center mb-12 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            About Me
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/3 flex justify-center">
              <div
                className={`rounded-full h-64 w-64 overflow-hidden border-4 shadow-xl transform hover:scale-105 transition-transform duration-300 ${
                  darkMode ? "border-indigo-400" : "border-indigo-500"
                }`}
              >
                <img
                  src="/apurv_college_coat.png"
                  alt="Apurv Shashvat - Web Developer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <p
                className={`text-lg mb-6 leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                I'm a passionate web developer with 1+ years of experience
                creating engaging, user-friendly websites and applications. I
                specialize in front-end development with a strong foundation in
                modern frameworks like React.js My goal is to build digital
                experiences that are both beautiful and functional.
              </p>

              <h3
                className={`text-xl font-semibold mb-4 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                My Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "HTML5",
                  "CSS3",
                  "Tailwing CSS",
                  "JavaScript",
                  "React",
                  "Node.js",
                  "Git",
                  "Express js",
                  "Java",
                  "Spring Boot",
                  "Rest API",
                  "Hibernate",
                  "J2EE",
                  "Postman",
                ].map((skill) => (
                  <div
                    key={skill}
                    className={`rounded-lg py-2 px-4 text-center transition-colors duration-300 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-indigo-900 hover:text-indigo-300"
                        : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <Experience darkMode={darkMode} />

      {/* Projects Section */}
      <Projects darkMode={darkMode} />

      {/* Contact Section */}
      <Contact darkMode={darkMode} />

      {/* Footer */}
      <footer
        className={`py-6 text-center ${
          darkMode ? "bg-gray-950 text-gray-500" : "bg-gray-800 text-gray-400"
        }`}
      >
        <div className="container mx-auto">
          <p>© 2025 Apurv Shashvat - 7677672641</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            darkMode
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default Portfolio;