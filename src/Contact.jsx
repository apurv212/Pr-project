// Contact.jsx
import React from "react";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react"; // Added MessageCircle for WhatsApp
import ReactGA from "react-ga4";

const Contact = ({ darkMode }) => {
  return (
    <section
      id="contact"
      className={`py-20 ${
        darkMode ? "bg-indigo-950" : "bg-indigo-900"
      } text-white`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-12">
            <a
              href="mailto:sharshit416@gmail.com"
              className="flex items-center group"
            >
              <Mail
                className="mr-3 group-hover:text-indigo-300 transition-colors"
                size={24}
              />
              <span className="group-hover:text-indigo-300 transition-colors">
                sharshit416@gmail.com
              </span>
            </a>
            <a
              href="http://www.linkedin.com/in/apurv-s-023564269"
              className="flex items-center group"
            >
              <Linkedin
                className="mr-3 group-hover:text-indigo-300 transition-colors"
                size={24}
              />
              <span className="group-hover:text-indigo-300 transition-colors">
                linkedin.com/in/apurv-s-023564269
              </span>
            </a>
            <a
              href="https://github.com/apurv212"
              className="flex items-center group"
            >
              <Github
                className="mr-3 group-hover:text-indigo-300 transition-colors"
                size={24}
              />
              <span className="group-hover:text-indigo-300 transition-colors">
                github.com/apurv212
              </span>
            </a>
            <a
              href="https://wa.me/+917677672641"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center group"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked WhatsApp Link",
                  label: "WhatsApp",
                })
              }
            >
              <MessageCircle
                className="mr-3 group-hover:text-indigo-300 transition-colors"
                size={24}
              />
              <span className="group-hover:text-indigo-300 transition-colors">
                Chat on WhatsApp
              </span>
            </a>
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6">
              I'm always open to discussing new projects, opportunities or
              partnerships.
            </p>
            <button
              className={`px-8 py-3 rounded-full transition-colors duration-300 font-medium ${
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;