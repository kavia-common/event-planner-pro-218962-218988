import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * RegisterPage allows a new user to create an account.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate("/events");
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="Page">
      <div className="Container Container--narrow">
        <div className="Card">
          <h1 className="H1">Register</h1>
          <p className="Subtle">Create an account to start creating and RSVPing to events.</p>

          <form onSubmit={onSubmit} className="Form" aria-label="Register form">
            <FormField label="Display name" htmlFor="name">
              <input
                id="name"
                className="Input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Retro Ranger"
              />
            </FormField>

            <FormField label="Email" htmlFor="email">
              <input
                id="email"
                className="Input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </FormField>

            <FormField label="Password" htmlFor="password" hint="At least 6 characters.">
              <input
                id="password"
                className="Input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </FormField>

            {error ? (
              <div className="InlineAlert InlineAlert--error" role="alert">
                {error}
              </div>
            ) : null}

            <div className="Form__actions">
              <button className="Button Button--primary" type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create account"}
              </button>
              <Link className="Link" to="/login">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
