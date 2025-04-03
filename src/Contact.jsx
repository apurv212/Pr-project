import React, { useEffect, useRef } from "react";
import { Github, Linkedin, Mail, MessageCircle, ExternalLink } from "lucide-react";
import ReactGA from "react-ga4";

const Contact = ({ darkMode }) => {
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const elements = contactRef.current.querySelectorAll('.animate-item');
          elements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('animate-in');
            }, index * 150);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, []);

  return (
    <section
      id="contact"
      ref={contactRef}
      className={`py-20 ${
        darkMode ? "bg-indigo-950" : "bg-indigo-900"
      } text-white relative overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className={`absolute w-40 h-40 rounded-full ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} opacity-20 top-10 left-10 animate-float-slow`}></div>
        <div className={`absolute w-64 h-64 rounded-full ${darkMode ? "bg-indigo-700" : "bg-indigo-600"} opacity-10 bottom-20 right-20 animate-float`}></div>
        <div className={`absolute w-20 h-20 rounded-full ${darkMode ? "bg-purple-700" : "bg-purple-600"} opacity-20 top-40 right-40 animate-float-medium`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 animate-item opacity-0 transition-all duration-700 transform translate-y-8">Get In Touch</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-y-8 gap-x-12">
            <a
              href="mailto:sharshit416@gmail.com"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked Email Link",
                  label: "Email",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <Mail className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                sharshit416@gmail.com
              </span>
            </a>
            
            <a
              href="http://www.linkedin.com/in/apurv-s-023564269"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked LinkedIn Link",
                  label: "LinkedIn",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <Linkedin className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                LinkedIn
              </span>
            </a>
            
            <a
              href="https://github.com/apurv212"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked GitHub Link",
                  label: "GitHub",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <Github className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                GitHub
              </span>
            </a>
            
            <a
              href="https://wa.me/+917677672641"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked WhatsApp Link",
                  label: "WhatsApp",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <MessageCircle className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                WhatsApp
              </span>
            </a>
          </div>
          
          <div className="mt-16 text-center">
            <p className="mb-8 animate-item opacity-0 transition-all duration-500 transform translate-y-6 max-w-lg mx-auto">
              I'm always open to discussing new projects, opportunities or
              partnerships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-item opacity-0 transition-all duration-500 transform translate-y-6">
              <button
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 shadow-lg ${
                  darkMode
                    ? "bg-gray-200 text-indigo-950 hover:bg-white"
                    : "bg-white text-indigo-900 hover:bg-gray-100"
                }`}
              >
                <a
                  href="/apurv_shashvat_resume25.pdf"
                  download="apurv_shashvat.pdf"
                  className="w-full h-full inline-block"
                  onClick={() =>
                    ReactGA.event({
                      category: "Resume",
                      action: "Downloaded Resume",
                      label: "Resume Download",
                    })
                  }
                >
                  Download Resume
                </a>
              </button>
              
              <a
                href="https://linktr.ee/apurv_shashvat"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 shadow-lg flex items-center justify-center ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                }`}
                onClick={() =>
                  ReactGA.event({
                    category: "Contact",
                    action: "Clicked Linktree Profile",
                    label: "Detailed Profile",
                  })
                }
              >
                <span>Detailed Profile</span>
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;