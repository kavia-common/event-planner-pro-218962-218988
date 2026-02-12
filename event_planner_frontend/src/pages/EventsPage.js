import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { createEvent, listEvents } from "../api/events";
import { useAuth } from "../hooks/useAuth";

function normalizeEventsResponse(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.events)) return res.events;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

/**
 * PUBLIC_INTERFACE
 * EventsPage shows list of events and allows authenticated users to create one.
 */
export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const canCreate = useMemo(() => {
    return title.trim() && dateTime.trim() && location.trim();
  }, [title, dateTime, location]);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await listEvents();
      setEvents(normalizeEventsResponse(res));
    } catch (err) {
      setLoadError(err?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    if (!isAuthenticated) {
      navigate("/login?next=/events");
      return;
    }
    setCreateError("");
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    if (creating) return;
    setIsCreateOpen(false);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!canCreate) {
      setCreateError("Title, date/time, and location are required.");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        title: title.trim(),
        dateTime,
        location: location.trim(),
        description: description.trim(),
      };
      const created = await createEvent(payload);

      // Try to navigate to created event if backend returns an id.
      const newId =
        created?.id || created?._id || created?.event?.id || created?.event?._id || null;

      setIsCreateOpen(false);
      setTitle("");
      setDateTime("");
      setLocation("");
      setDescription("");

      await load();

      if (newId) {
        navigate(`/events/${newId}`);
      }
    } catch (err) {
      setCreateError(err?.message || "Failed to create event.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="Page">
      <div className="Container">
        <div className="PageHeader">
          <div>
            <h1 className="H1">Events</h1>
            <p className="Subtle">Browse the lineup. RSVP, or create your own retro bash.</p>
          </div>
          <div className="PageHeader__actions">
            <button className="Button Button--primary" type="button" onClick={openCreate}>
              + Create Event
            </button>
          </div>
        </div>

        {loading ? <div className="Loader">Loading events…</div> : null}

        {loadError ? (
          <div className="InlineAlert InlineAlert--error" role="alert">
            {loadError}{" "}
            <button type="button" className="Button Button--ghost" onClick={load}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !loadError && events.length === 0 ? (
          <div className="EmptyState">
            <div className="EmptyState__title">No events yet</div>
            <div className="EmptyState__body">
              Be the first to create a neon-lit gathering.
            </div>
            <button className="Button Button--primary" type="button" onClick={openCreate}>
              Create the first event
            </button>
          </div>
        ) : null}

        <div className="Grid">
          {events.map((ev) => {
            const id = ev.id || ev._id || ev.eventId;
            return (
              <Link key={id} to={`/events/${id}`} className="Card Card--clickable">
                <div className="Card__top">
                  <h2 className="H2">{ev.title || "Untitled Event"}</h2>
                  <div className="Pill">{ev.dateTime ? new Date(ev.dateTime).toLocaleString() : "TBA"}</div>
                </div>
                <div className="Card__body">
                  <div className="MetaRow">
                    <span className="MetaLabel">Location</span>
                    <span className="MetaValue">{ev.location || "TBA"}</span>
                  </div>
                  {ev.description ? <p className="Clamp2">{ev.description}</p> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Modal title="Create Event" isOpen={isCreateOpen} onClose={closeCreate}>
        <form onSubmit={onCreate} className="Form" aria-label="Create event form">
          <FormField label="Title" htmlFor="title">
            <input
              id="title"
              className="Input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Synthwave Social"
            />
          </FormField>

          <FormField label="Date & time" htmlFor="dateTime" hint="Use your local time zone.">
            <input
              id="dateTime"
              className="Input"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </FormField>

          <FormField label="Location" htmlFor="location">
            <input
              id="location"
              className="Input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Arcade Alley, Downtown"
            />
          </FormField>

          <FormField label="Description (optional)" htmlFor="description">
            <textarea
              id="description"
              className="Textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Dress code: neon. Soundtrack: 80s hits."
            />
          </FormField>

          {createError ? (
            <div className="InlineAlert InlineAlert--error" role="alert">
              {createError}
            </div>
          ) : null}

          <div className="Form__actions">
            <button className="Button Button--primary" type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create event"}
            </button>
            <button className="Button Button--ghost" type="button" onClick={closeCreate} disabled={creating}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
