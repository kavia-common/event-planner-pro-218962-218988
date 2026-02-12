import { apiRequest, clearSession, writeSession } from "./client";

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 * Note: Backend route shape may differ; this client attempts common fields.
 */
export async function register({ name, email, password }) {
  const res = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

  // Common patterns: {token, user} or {accessToken, user} or {user, token}
  const token = res?.token || res?.accessToken || res?.jwt || null;
  const user = res?.user || res?.data?.user || null;

  if (token || user) {
    writeSession({ token, user });
  }

  return res;
}

/**
 * PUBLIC_INTERFACE
 * Login.
 */
export async function login({ email, password }) {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const token = res?.token || res?.accessToken || res?.jwt || null;
  const user = res?.user || res?.data?.user || null;

  if (token || user) {
    writeSession({ token, user });
  }

  return res;
}

/**
 * PUBLIC_INTERFACE
 * Fetch current user (if backend supports it).
 */
export async function me() {
  return apiRequest("/auth/me", { method: "GET" });
}

/**
 * PUBLIC_INTERFACE
 * Logout locally.
 */
export function logout() {
  clearSession();
}
