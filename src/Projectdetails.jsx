import React from "react";
import { Github } from "lucide-react";
import ReactGA from "react-ga4";

const Projects = ({ darkMode }) => {
  const projects = [
    {
      image: "/one_note.png",
      title: "One Note App",
      description:
        "Developed a centralized platform for all your learning notes.Consolidate and access notes from diverse external sources, providing a one-stop shop for students to access relevant learning materials.\nImplemented an SGPA calculator into the platform,.",
      githubLink: "https://github.com/apurv212",
    },
    {
      image: "/to_do.png",
      title: "Advance To-Do App",
      description: "Developed a feature-rich to-do list application, offering CRUD operations, task pinning, and local storage for offline data retention.\nImplemented advanced functionalities like voice-to-text input, date/time-based note retrieval, note locking,sharing tasks, search functionality, and theme customization.",
      githubLink: "https://github.com/apurv212",
    },
    {
      image: "/spring_boot.png",
      title: "Spring Boot Application",
      description:
        "A full-stack web application built with Spring Boot and React and Swagger for Api documentation",
      githubLink: "https://github.com/apurv212",
    },
  ];

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
          My Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div
              key={i}
              className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={`Project ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
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
                  className= {`text-justify  mb-4 ${
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
                <div className="flex justify-between">
                  <button
                    className={`transition-colors ${
                      darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    View Details
                  </button>
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