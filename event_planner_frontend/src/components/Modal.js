import React, { useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * Modal is an accessible dialog with backdrop and escape-to-close.
 */
export default function Modal({ title, isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    // Focus first focusable element in dialog for accessibility.
    const dialog = dialogRef.current;
    if (dialog) {
      const focusable = dialog.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="Modal" role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
      <div className="Modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="Modal__panel" ref={dialogRef}>
        <div className="Modal__header">
          <h2 className="H2 Modal__title">{title}</h2>
          <button type="button" className="IconButton" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <div className="Modal__body">{children}</div>
      </div>
    </div>
  );
}
