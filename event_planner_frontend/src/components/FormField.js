import React from "react";

/**
 * PUBLIC_INTERFACE
 * FormField renders a label + input wrapper with consistent retro styling.
 */
export default function FormField({ label, htmlFor, hint, error, children }) {
  return (
    <div className="FormField">
      <label className="Label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <div className="Hint">{hint}</div> : null}
      {error ? (
        <div className="Error" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
