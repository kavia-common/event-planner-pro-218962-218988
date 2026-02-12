import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * HomePage is a lightweight landing page.
 */
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="Page">
      <div className="Container">
        <div className="Hero">
          <div className="Hero__badge">Retro Edition</div>
          <h1 className="Hero__title">Plan events like it’s 1989.</h1>
          <p className="Hero__subtitle">
            Create events, browse the lineup, and RSVP with a neon-slick, arcade-ready UI.
          </p>

          <div className="Hero__actions">
            <Link className="Button Button--primary" to="/events">
              Browse events
            </Link>
            {!isAuthenticated ? (
              <Link className="Button Button--ghost" to="/register">
                Create account
              </Link>
            ) : null}
          </div>

          <div className="Hero__grid">
            <div className="MiniCard">
              <div className="MiniCard__title">Create</div>
              <div className="MiniCard__body">Launch an event with title, time, and location.</div>
            </div>
            <div className="MiniCard">
              <div className="MiniCard__title">Explore</div>
              <div className="MiniCard__body">See what’s happening, from meetups to parties.</div>
            </div>
            <div className="MiniCard">
              <div className="MiniCard__title">RSVP</div>
              <div className="MiniCard__body">Going? Maybe? Can’t? Save it in one click.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
