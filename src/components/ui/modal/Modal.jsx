import React, { useEffect, useRef } from "react";
import "./modal.scss";

export default function Modal({
  isOpen,
  title,
  subtitle,
  onClose,
  size = "md", // sm | md | lg | xl
  headerActions,
  footer,
  children,
  closeOnOverlay = true,
  closeOnEsc = true,
}) {
  const panelRef = useRef(null);

  // lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // close on ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeOnEsc, onClose]);

  // focus the panel (basic focus management)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => panelRef.current?.focus?.(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onOverlayMouseDown = (e) => {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="geModalOverlay" onMouseDown={onOverlayMouseDown}>
      <div
        className={`geModalPanel geModalPanel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Modal"}
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="geModalHeader">
          <div className="geModalHeader__left">
            {title ? <div className="geModalTitle">{title}</div> : null}
            {subtitle ? <div className="geModalSubtitle">{subtitle}</div> : null}
          </div>

          <div className="geModalHeader__right">
            {headerActions ? <div className="geModalHeaderActions">{headerActions}</div> : null}
            <button type="button" className="geModalClose" onClick={onClose} aria-label="Close dialog">
              ✕
            </button>
          </div>
        </div>

        <div className="geModalBody">{children}</div>

        {footer ? <div className="geModalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}
