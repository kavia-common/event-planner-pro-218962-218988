import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * App is the root SPA component (routes + theme toggle).
 */
export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <div className="AppShell">
      <Navbar />
      <button
        className="ThemeToggle"
        onClick={toggleTheme}
        type="button"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="Footer">
        <div className="Container">
          <div className="Footer__inner">
            <span className="Footer__muted">Event Planner Pro</span>
            <span className="Footer__muted">
              API: {process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
