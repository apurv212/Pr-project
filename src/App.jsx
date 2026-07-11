import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Portfolio from "./Portfolio";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";

function App() {
  // Owned here so the theme survives navigation between the portfolio and blog.
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((mode) => !mode);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Portfolio darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/blog"
          element={<BlogList darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/blog/:slug"
          element={<BlogPost darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;