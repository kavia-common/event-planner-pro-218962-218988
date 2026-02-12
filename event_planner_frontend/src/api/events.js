import { apiRequest } from "./client";

/**
 * PUBLIC_INTERFACE
 * List events.
 */
export async function listEvents() {
  // Common REST route
  return apiRequest("/events", { method: "GET" });
}

/**
 * PUBLIC_INTERFACE
 * Get event details.
 */
export async function getEvent(eventId) {
  return apiRequest(`/events/${encodeURIComponent(eventId)}`, { method: "GET" });
}

/**
 * PUBLIC_INTERFACE
 * Create a new event.
 */
export async function createEvent(payload) {
  return apiRequest("/events", { method: "POST", body: payload });
}

/**
 * PUBLIC_INTERFACE
 * RSVP to an event.
 */
export async function rsvpToEvent(eventId, status) {
  // Common route patterns:
  // 1) POST /events/:id/rsvp { status }
  // 2) POST /events/:id/rsvp { attending: true }
  // We send status and let backend decide.
  return apiRequest(`/events/${encodeURIComponent(eventId)}/rsvp`, {
    method: "POST",
    body: { status },
  });
}
