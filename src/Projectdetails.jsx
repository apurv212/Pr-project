import React, { useState } from "react";
import { Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import ReactGA from "react-ga4";

const Projects = ({ darkMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const projects = [
    {
      images: [
        "https://i.postimg.cc/g2jMGg4j/Screenshot-2025-05-21-002710.png",
        "https://i.postimg.cc/0Ng7hnBL/Screenshot-2025-05-21-003149.png", 
        "https://i.postimg.cc/JzXk3JzK/Screenshot-2025-05-21-003334.png"
      ],
      title: "Jewelry 360",
      description:
        "Dashboard for tracking sales, best-performing items, and trending jewellery.\nLow stock alerts for inventory management\nAutomated invoice generation that can be printed or sent to whatsapp.",
      liveLink: "https://lucent-macaron-094081.netlify.app/",
      githubLink: "https://github.com/apurv212",
      hasCarousel: true
    },
    {
      image: "/one_note.webp",
      title: "One Note App",
      description:
        "Developed a centralized platform for all your learning notes.Consolidate and access notes from diverse external sources, providing a one-stop shop for students to access relevant learning materials.\nImplemented an SGPA calculator into the platform,.",
      liveLink: "https://one-library.netlify.app/",
      githubLink: "https://github.com/apurv212/one-note",
      hasCarousel: false
    },
    {
      image: "/My_projects/secure_ai_vault.webp",
      title: "Secure AI Vault",
      description:
        "A secure web application for storing and managing card details (Credit/Debit, Aadhar, PAN) with AI-powered extraction.\nFeatures: Authentication, Multiple Input Methods (gallery, camera, manual entry), AI-Powered Extraction, Automatic Bank Categorization with filtering, Copy Card Details (number, name, expiry - not CVV), Re-extraction for failed extracts, Skeleton Loaders, and Responsive Design.",
      liveLink: "https://secure-ai-vault.vercel.app/login",
      githubLink: "https://github.com/apurv212/Secure-AI-Vault",
      hasCarousel: false
    },
    {
      image: "/My_projects/zryth_capital.webp",
      title: "Zryth Capital",
      description:
        "A freelance client website for a CA (ICAI) firm dealing in unlisted shares, mutual funds, and finance advice. Features live unlisted share prices, investment services, SIP calculator, and partner onboarding.",
      liveLink: "https://zrythcapital.com/equity-shares",
      githubLink: "https://github.com/apurv212",
      hasCarousel: false
    },
    {
      image: "/My_projects/spray_kart.webp",
      title: "Spraykart",
      description:
        "A freelance ecommerce website built for a client selling perfumes. Features product catalog, filters, wishlist, cart, and a full shopping experience for luxury fragrances.",
      liveLink: "https://www.spraykart.com/",
      githubLink: "https://github.com/apurv212",
      hasCarousel: false
    },
    {
      image: "/My_projects/oswaal_ai.webp",
      title: "Oswaal AI",
      description:
        "Contributed to the development of Oswaal AI for Oswaal Books, a renowned Indian educational publisher.\nBuilt features for AI-powered doubt solving, mock tests, PYQs, and multi-modal learning (PPT, mind maps and Podcast).",
      liveLink: "https://play.google.com/store/apps/details?id=com.oswaal.ai",
      githubLink: "https://github.com/apurv212",
      hasCarousel: false
    },
  ];

  const nextImage = (projectIndex) => {
    const project = projects[projectIndex];
    if (project.hasCarousel) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [projectIndex]: ((prev[projectIndex] || 0) + 1) % project.images.length
      }));
    }
  };

  const prevImage = (projectIndex) => {
    const project = projects[projectIndex];
    if (project.hasCarousel) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [projectIndex]: ((prev[projectIndex] || 0) - 1 + project.images.length) % project.images.length
      }));
    }
  };

  const getCurrentImage = (project, projectIndex) => {
    if (project.hasCarousel) {
      return project.images[currentImageIndex[projectIndex] || 0];
    }
    return project.image;
  };

  return (
    <section
      id="projects"
      className={`py-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl font-bold text-center mb-12 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div
              key={i}
              className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="h-48 overflow-hidden relative group">
                <img
                  src={getCurrentImage(project, i)}
                  alt={`${project.title} - ${project.hasCarousel ? `Image ${(currentImageIndex[i] || 0) + 1}` : 'Preview'}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Carousel Controls */}
                {project.hasCarousel && project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(i)}
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        darkMode ? "bg-gray-900/80 text-white hover:bg-gray-900" : "bg-white/80 text-gray-800 hover:bg-white"
                      }`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <button
                      onClick={() => nextImage(i)}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        darkMode ? "bg-gray-900/80 text-white hover:bg-gray-900" : "bg-white/80 text-gray-800 hover:bg-white"
                      }`}
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {project.images.map((_, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => setCurrentImageIndex(prev => ({ ...prev, [i]: imgIndex }))}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            (currentImageIndex[i] || 0) === imgIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {project.title}
                </h3>
                <p
                  className={`text-justify mb-4 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {project.description.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          ReactGA.event({
                            category: "Projects",
                            action: "Clicked Live Demo",
                            label: project.title,
                          })
                        }
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          darkMode
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    
                    {!project.liveLink && (
                      <button
                        className={`transition-colors ${
                          darkMode
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-indigo-600 hover:text-indigo-800"
                        }`}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                  
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      ReactGA.event({
                        category: "Projects",
                        action: "Clicked GitHub Link",
                        label: project.title,
                      })
                    }
                    className={`transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;