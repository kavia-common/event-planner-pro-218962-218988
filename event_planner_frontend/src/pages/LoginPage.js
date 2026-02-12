import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * LoginPage allows a user to sign in.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("next") || "/events";
  }, [location.search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(nextPath);
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="Page">
      <div className="Container Container--narrow">
        <div className="Card">
          <h1 className="H1">Login</h1>
          <p className="Subtle">
            Welcome back. Enter your credentials to access your events.
          </p>

          <form onSubmit={onSubmit} className="Form" aria-label="Login form">
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

            <FormField label="Password" htmlFor="password">
              <input
                id="password"
                className="Input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
                {submitting ? "Signing in…" : "Sign in"}
              </button>
              <Link className="Link" to="/register">
                Need an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
