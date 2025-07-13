import React from "react";

const Experience = ({ darkMode }) => {
  const experiences = [
    {
      year: "March 2025 - Present",
      title: "Keywords Studio",
      type: "work",
      description: "Research associate Engineer",
    },
    {
      year: "May 2024 - Feb 2025",
      title: "Nirmaan Organization",
      type: "education",
      description:
        "specialized in delivering comprehensive training in Frontend Web development.\n Led interactive sessions on Git, OPPS, web development frameworks ( Tailwind CSS, ReactJS, Redux).",
    },
    {
      year: "May 2023 - Oct 2023",
      title: "Frontend Developer Intern",
      type: "work",
      description: `Improved website performance, achieving a 20% faster page loading speed by implementing code minification, image optimization, and lazy loading techniques.\nCollaborated with backend developers to integrate APIs.`,
},
        
    {
      year: "2020 - 2024",
      title: "Bachelor of Engineering in Computer Science",
      type: "education",
      description:
        "Graduated with a B.Tech from [Visvesvaraya Technological University ]. Focused on software engineering, and web development. Completed projects in React and Java.",
    },
  ];

  return (
    <div className="py-16 px-4 md:px-8">
      <h2 className={`text-3xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Experience & Education
      </h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Timeline Line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-500"></div>

        {experiences.map((exp, index) => (
          <div 
            key={index}
            className={`relative flex flex-col md:flex-row md:items-center mb-16 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Timeline Dot with Animation */}
            <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full z-10">
              <div className={`w-6 h-6 rounded-full ${exp.type === 'work' ? 'bg-blue-500' : 'bg-purple-500'} relative`}>
                <div className="absolute inset-0 rounded-full bg-opacity-50 animate-ping" style={{ 
                  backgroundColor: exp.type === 'work' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(168, 85, 247, 0.5)',
                  animationDuration: '3s'
                }}></div>
              </div>
            </div>

            {/* Content */}
            <div className={`md:w-1/2 ${
              index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
            } pl-12 md:pl-0`}>
              <div className="relative p-6 overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backdropFilter: 'blur(8px)',
                    backgroundColor: darkMode 
                      ? 'rgba(30, 41, 59, 0.6)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0px 10px lightgreen',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
              >
                {/* Animated Border */}
                <div className="absolute inset-0 animate-borderGlow pointer-events-none" 
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)',
                      backgroundSize: '200% 200%',
                      animation: 'gradient 3s ease infinite',
                      backgroundPosition: '200% 50%',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      padding: '1px',
                      borderRadius: 'inherit',
                    }}
                ></div>
                
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {exp.title}
                </h3>
                <p className={`text-sm font-semibold mb-3 ${
                  exp.type === 'work' ? 'text-blue-500' : 'text-purple-500'
                }`}>
                  {exp.year}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
  {exp.description.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ))}
</p>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Experience;