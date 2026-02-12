const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Attempt to parse a response body as JSON, falling back to text.
 */
async function parseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : null;
}

function buildUrl(baseUrl, path) {
  if (!path) return baseUrl;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = baseUrl.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function getApiBaseUrl() {
  // Prefer REACT_APP_API_BASE; fallback to REACT_APP_BACKEND_URL.
  return (
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:3001"
  );
}

function getToken() {
  try {
    return localStorage.getItem("ep_token");
  } catch (e) {
    return null;
  }
}

function setToken(token) {
  try {
    if (!token) localStorage.removeItem("ep_token");
    else localStorage.setItem("ep_token", token);
  } catch (e) {
    // ignore
  }
}

function getUser() {
  try {
    const raw = localStorage.getItem("ep_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setUser(user) {
  try {
    if (!user) localStorage.removeItem("ep_user");
    else localStorage.setItem("ep_user", JSON.stringify(user));
  } catch (e) {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * ApiError represents a non-2xx response from the backend.
 */
export class ApiError extends Error {
  /** Create an ApiError. */
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * PUBLIC_INTERFACE
 * Perform an HTTP request against the backend API, with optional auth token.
 */
export async function apiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = buildUrl(baseUrl, path);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions = {
    method: options.method || "GET",
    headers,
    signal: controller.signal,
  };

  if (options.body !== undefined) {
    fetchOptions.body =
      typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const body = await parseBody(response);

    if (!response.ok) {
      const message =
        (body && (body.message || body.error)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, body);
    }

    return body;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out", 408, { timeoutMs: DEFAULT_TIMEOUT_MS });
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * PUBLIC_INTERFACE
 * Read current session info (token + user) from localStorage.
 */
export function readSession() {
  return { token: getToken(), user: getUser() };
}

/**
 * PUBLIC_INTERFACE
 * Persist session info (token + user) to localStorage.
 */
export function writeSession({ token, user }) {
  setToken(token || null);
  setUser(user || null);
}

/**
 * PUBLIC_INTERFACE
 * Clear current session.
 */
export function clearSession() {
  setToken(null);
  setUser(null);
}
