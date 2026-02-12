import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * Navbar renders the top navigation with auth controls.
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="Navbar">
      <div className="Navbar__inner">
        <Link to="/" className="Navbar__brand" aria-label="Event Planner Home">
          <span className="BrandMark" aria-hidden="true">
            EP
          </span>
          <span className="Navbar__title">Event Planner Pro</span>
        </Link>

        <nav className="Navbar__nav" aria-label="Primary">
          <NavLink
            to="/events"
            className={({ isActive }) => `NavLink ${isActive ? "NavLink--active" : ""}`}
          >
            Events
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `NavLink ${isActive ? "NavLink--active" : ""}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `NavLink ${isActive ? "NavLink--active" : ""}`}
              >
                Register
              </NavLink>
            </>
          ) : (
            <div className="Navbar__user">
              <span className="Navbar__userLabel" title={user?.email || ""}>
                {user?.name ? user.name : "Signed in"}
              </span>
              <button type="button" className="Button Button--ghost" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
