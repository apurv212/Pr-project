import React, { useState, useEffect } from 'react';

// Using individual imports to avoid issues
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import { Github } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const projects = [
    {
      image: '/public/one_note.png', 
      title: 'One Note App',
      description: 'A note-taking app that helps you organize your thoughts and ideas.',
      githubLink: 'https://github.com/apurv212',
    },
    {
      image: '/public/to_do.png',
      title: 'To-Do App',
      description: 'A simple to-do list app to manage your tasks efficiently.',
      githubLink: 'https://github.com/apurv212',
    },
    {
      image: '/public/spring_boot.png', 
      title: 'Spring Boot Application',
      description: 'A full-stack web application built with Spring Boot and React.',
      githubLink: 'https://github.com/apurv212',
    },
  ];


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header - Sticky and changes background on scroll */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? darkMode 
              ? 'bg-gray-800 shadow-md py-2' 
              : 'bg-white shadow-md py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo/Name */}
            <div className={`text-xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <span className="transition-all duration-300">Apurv Shashvat</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'About Me', 'Projects', 'Contact'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {item}
                </button>
              ))}
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className={`p-2 rounded-full transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {/* Dark Mode Toggle for Mobile */}
              <button 
                onClick={toggleDarkMode} 
                className={`p-2 mr-2 rounded-full transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={darkMode ? 'text-gray-300' : 'text-gray-600'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className={`md:hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col px-4 py-2">
              {['Home', 'About Me', 'Projects', 'Contact'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className={`py-3 text-left transition-colors duration-300 ${
                    darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} overflow-hidden`}>
          <div 
            className="absolute inset-0 bg-cover bg-center "
            style={{ 
              backgroundImage: "url('/api/placeholder/1600/900')"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Hello, I'm Apurv Shashvat
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
           Full Stack Web Developer, Designer
          </p>
          <button 
            onClick={() => scrollToSection('projects')}
            className={`px-6 py-3 text-white rounded-full flex items-center mx-auto transform hover:scale-105 transition-all duration-300 ${
              darkMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            View My Work
            <ArrowDown className="ml-2" size={18} />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ArrowDown className="text-white animate-bounce" size={24} />
        </div>
      </section>

      {/* About Me Section */}
      <section id="about-me" className={`py-20 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            About Me
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Profile Image */}
            <div className="md:w-1/3 flex justify-center">
              <div className={`rounded-full h-64 w-64 overflow-hidden border-4 shadow-xl transform hover:scale-105 transition-transform duration-300 ${
                darkMode ? 'border-indigo-400' : 'border-indigo-500'
              }`}>
                <img
                  src="/public/apurv_college_coat.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Bio */}
            <div className="md:w-2/3">
              <p className={`text-lg mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                I'm a passionate web developer with 1+ years of experience creating engaging, 
                user-friendly websites and applications. I specialize in front-end development 
                with a strong foundation in modern frameworks like React.js My goal is to build 
                digital experiences that are both beautiful and functional.
              </p>
              
              {/* Skills */}
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                My Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["HTML5", "CSS3","Tailwing CSS", "JavaScript", "React", "Node.js", "Git", "Express ja", "Java","Spring Boot","Rest API", "Hibernate", "J2EE", "Postman"].map(skill => (
                  <div 
                    key={skill}
                    className={`rounded-lg py-2 px-4 text-center transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-indigo-900 hover:text-indigo-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
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

      {/* Projects Section */}
      <section id="projects" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            My Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <div
                key={i}
                className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
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
                    className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {project.description}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className={`transition-colors ${
                        darkMode
                          ? 'text-indigo-400 hover:text-indigo-300'
                          : 'text-indigo-600 hover:text-indigo-800'
                      }`}
                    >
                      View Details
                    </button>
                    <a
                      href={project.githubLink}
                      className={`transition-colors ${
                        darkMode
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-500 hover:text-gray-700'
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

      {/* Contact Section */}
      <section id="contact" className={`py-20 ${darkMode ? 'bg-indigo-950' : 'bg-indigo-900'} text-white`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-12">
              <a href="#" className="flex items-center group">
                <Mail className="mr-3 group-hover:text-indigo-300 transition-colors" size={24} />
                <span className="group-hover:text-indigo-300 transition-colors">sharshit416@gmail.com</span>
              </a>
              <a href="#" className="flex items-center group">
                <Linkedin className="mr-3 group-hover:text-indigo-300 transition-colors" size={24} />
                <span className="group-hover:text-indigo-300 transition-colors">linkedin.com/in/apurv-s-023564269</span>
              </a>
              <a href="#" className="flex items-center group">
                <Github className="mr-3 group-hover:text-indigo-300 transition-colors" size={24} />
                <span className="group-hover:text-indigo-300 transition-colors">github.com/apurv212</span>
              </a>
            </div>
            
            <div className="mt-12 text-center">
              <p className="mb-6">I'm always open to discussing new projects, opportunities or partnerships.</p>
              <button className={`px-8 py-3 rounded-full transition-colors duration-300 font-medium ${
                darkMode ? 'bg-gray-200 text-indigo-950 hover:bg-white' : 'bg-white text-indigo-900 hover:bg-gray-100'
              }`}  >
               <a 
    href="/public/apurv_shashvat_resume25.pdf" 
    download="apurv_shashvat.pdf"  
    className="w-full h-full inline-block"
  >
    Download Resume
  </a>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 text-center ${
        darkMode ? 'bg-gray-950 text-gray-500' : 'bg-gray-800 text-gray-400'
      }`}>
        <div className="container mx-auto">
          <p>© 2024 Apurv Shashvat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;