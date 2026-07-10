// Portfolio.jsx
import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import Navbar from "./Navbar";
import Contact from "./Contact";
import Projects from "./Projectdetails";
import Experience from "./Experience"; 
import MPlayer from "./MPlayer";
import { ArrowDown, ArrowUp } from "lucide-react";

// Replace your single tracking ID with an array of IDs
const TRACKING_ID = ["G-3GQBSQFLV6"];

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
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
      className={`min-h-screen font-sans overflow-x-hidden w-full max-w-[100vw] ${
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
          className={`absolute inset-0 overflow-hidden ${
            darkMode ? "hero-bg hero-bg--dark" : "hero-bg hero-bg--light"
          }`}
        >
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
        </div>

        <div className="relative text-center px-4 max-w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 break-words">
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
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 px-2">
            Full Stack Web Developer, Designer
          </p>
          <button
            onClick={() => scrollToSection("projects")}
            className="ai-cta px-6 py-3 text-white rounded-full flex items-center mx-auto transform hover:scale-105 transition-all duration-300"
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
            <div className="md:w-1/3 flex justify-center w-full">
              <div
                className={`rounded-full h-48 w-48 sm:h-64 sm:w-64 overflow-hidden border-4 shadow-xl transform hover:scale-105 transition-transform duration-300 ${
                  darkMode ? "border-cyan-400" : "border-cyan-500"
                }`}
              >
                <img
                  src="/apurv_college_coat.webp"
                  alt="Apurv Shashvat - Web Developer"
                  className="w-full h-full object-cover"
                  width="256"
                  height="256"
                  loading="eager"
                  decoding="async"
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
                  "Tailwind CSS",
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Next.js",
                  "Vue.js",
                  "Python",
                  "Django",
                  "FastAPI",
                  "PostgreSQL",
                  "Docker",
                  "AWS",
                  "Google ADK",
                  "Java",
                  "Rest API",
                  "Git",
                  "Postman",
                ].map((skill) => (
                  <div
                    key={skill}
                    className={`rounded-lg py-2 px-4 text-center transition-colors duration-300 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-cyan-950 hover:text-cyan-300"
                        : "bg-gray-100 text-gray-700 hover:bg-cyan-100 hover:text-cyan-600"
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
        className={`py-6 text-center relative overflow-x-hidden ${
          darkMode ? "bg-gray-950 text-gray-500" : "bg-gray-800 text-gray-400"
        }`}
      >
        <div className="container mx-auto px-4">
          <p className="text-sm sm:text-base break-words">
            © 2025 Apurv Shashvat - contact for personal website making 7677672641 and SEO boosting
          </p>
        </div>
        
        {/* Music Player - Only visible in footer */}
        <MPlayer darkMode={darkMode} />
      </footer>

      {/* Scroll progress + back to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
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

export default Portfolio;