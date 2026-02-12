import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEvent, rsvpToEvent } from "../api/events";
import { useAuth } from "../hooks/useAuth";

function normalizeEventResponse(res) {
  if (!res) return null;
  if (res.event) return res.event;
  if (res.data) return res.data;
  return res;
}

/**
 * PUBLIC_INTERFACE
 * EventDetailsPage shows a single event and lets authenticated users RSVP.
 */
export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [rsvping, setRsvping] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState("");

  const formattedDate = useMemo(() => {
    if (!event?.dateTime) return "TBA";
    try {
      return new Date(event.dateTime).toLocaleString();
    } catch (e) {
      return String(event.dateTime);
    }
  }, [event?.dateTime]);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getEvent(id);
      setEvent(normalizeEventResponse(res));
    } catch (err) {
      setLoadError(err?.message || "Failed to load event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const doRsvp = async (status) => {
    setRsvpError("");
    setRsvpSuccess("");

    if (!isAuthenticated) {
      navigate(`/login?next=/events/${encodeURIComponent(id)}`);
      return;
    }

    setRsvping(true);
    try {
      await rsvpToEvent(id, status);
      setRsvpSuccess(`RSVP saved: ${status}`);
      await load();
    } catch (err) {
      setRsvpError(err?.message || "RSVP failed.");
    } finally {
      setRsvping(false);
    }
  };

  return (
    <main className="Page">
      <div className="Container Container--wide">
        <div className="Breadcrumbs">
          <Link to="/events" className="Link">
            ← Back to events
          </Link>
        </div>

        {loading ? <div className="Loader">Loading event…</div> : null}

        {loadError ? (
          <div className="InlineAlert InlineAlert--error" role="alert">
            {loadError}{" "}
            <button type="button" className="Button Button--ghost" onClick={load}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !loadError && event ? (
          <div className="Card Card--details">
            <div className="DetailsHeader">
              <div>
                <h1 className="H1">{event.title || "Untitled Event"}</h1>
                <div className="DetailsMeta">
                  <div className="MetaRow">
                    <span className="MetaLabel">When</span>
                    <span className="MetaValue">{formattedDate}</span>
                  </div>
                  <div className="MetaRow">
                    <span className="MetaLabel">Where</span>
                    <span className="MetaValue">{event.location || "TBA"}</span>
                  </div>
                </div>
              </div>
              <div className="DetailsPills">
                <span className="Pill Pill--glow">Retro</span>
                <span className="Pill">RSVP</span>
              </div>
            </div>

            {event.description ? (
              <div className="DetailsBody">
                <h2 className="H2">About</h2>
                <p className="Prose">{event.description}</p>
              </div>
            ) : null}

            <div className="Divider" />

            <div className="RsvpSection">
              <h2 className="H2">RSVP</h2>
              <p className="Subtle">Lock in your status. You can update it later.</p>

              {rsvpError ? (
                <div className="InlineAlert InlineAlert--error" role="alert">
                  {rsvpError}
                </div>
              ) : null}
              {rsvpSuccess ? (
                <div className="InlineAlert InlineAlert--success" role="status">
                  {rsvpSuccess}
                </div>
              ) : null}

              <div className="ButtonRow">
                <button
                  type="button"
                  className="Button Button--primary"
                  onClick={() => doRsvp("yes")}
                  disabled={rsvping}
                >
                  {rsvping ? "Saving…" : "Going"}
                </button>
                <button
                  type="button"
                  className="Button Button--ghost"
                  onClick={() => doRsvp("maybe")}
                  disabled={rsvping}
                >
                  Maybe
                </button>
                <button
                  type="button"
                  className="Button Button--danger"
                  onClick={() => doRsvp("no")}
                  disabled={rsvping}
                >
                  Can’t make it
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
