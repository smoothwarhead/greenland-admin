import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import "./form-select.scss";

function normalizeOptions(options = []) {
  return options.map((opt) => {
    if (opt && typeof opt === "object") {
      return {
        label: String(opt.label ?? opt.value ?? ""),
        value: String(opt.value ?? opt.label ?? ""),
      };
    }
    return { label: String(opt), value: String(opt) };
  });
}

const FormSelect = ({
  options = [],
  label,
  placeholder = "Select…",
  cName = "",
  value,              // controlled value
  onChange,           // controlled setter: (nextValue) => void
  name,
  disabled = false,
  error,
  hint,
}) => {
  const id = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  const opts = useMemo(() => normalizeOptions(options), [options]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const selectedValue = isControlled ? String(value ?? "") : internalValue;

  const selectedLabel = useMemo(() => {
    const found = opts.find((o) => o.value === selectedValue);
    return found?.label ?? "";
  }, [opts, selectedValue]);

  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  function setNextValue(next) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  const toggleDropdown = () => {
    if (disabled) return;

    // compute drop direction BEFORE opening
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 220 && spaceAbove > spaceBelow);
    }

    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      // set active index to current selection
      const idx = opts.findIndex((o) => o.value === selectedValue);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleSelect = (opt) => {
    setNextValue(opt.value);
    closeDropdown();
    // return focus to button for keyboard users
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  // Close on outside click
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) closeDropdown();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  
  // Close on resize always
useEffect(() => {
  if (!open) return;

  const onResize = () => closeDropdown();
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, [open]);

// Close on page scroll (but NOT when scrolling inside the dropdown list)
useEffect(() => {
  if (!open) return;

  const onScrollCapture = (e) => {
    // If the scroll originated inside this select component, ignore it
    if (rootRef.current && rootRef.current.contains(e.target)) return;

    closeDropdown();
  };

  // capture phase so we catch window/body scroll early,
  // but we guard with contains() so options scrolling won't close it
  window.addEventListener("scroll", onScrollCapture, true);

  return () => {
    window.removeEventListener("scroll", onScrollCapture, true);
  };
}, [open]);


  // Keyboard controls
  const onKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleDropdown();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, opts.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const opt = opts[activeIndex];
      if (opt) handleSelect(opt);
      return;
    }
  };

  return (
    <div className={`custom-select`} ref={rootRef}>
      {label ? (
        <label className={`select-label ${error ? "lbl-error" : ""}`} htmlFor={`${id}-btn`}>
          {label}
          {hint ? <span className="select-hint">{hint}</span> : null}
        </label>
      ) : null}

      {/* Button acts as the control */}
      <button
        id={`${id}-btn`}
        ref={buttonRef}
        type="button"
        className={`select-header ${cName} ${open ? "open" : ""} ${error ? "inp-error" : ""}`}
        onClick={toggleDropdown}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        name={name}
      >
        {selectedLabel ? (
          <span className="selected">{selectedLabel}</span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}

        <svg
          className={`arrow ${open ? "rotate" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={`${id}-listbox`}
          className={`options ${dropUp ? "drop-up" : "drop-down"}`}
          role="listbox"
          aria-label={label || "Select options"}
        >
          {opts.length ? (
            opts.map((opt, idx) => {
              const isActive = idx === activeIndex;
              const isSelected = opt.value === selectedValue;

              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`option ${isActive ? "active" : ""} ${isSelected ? "selected" : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </div>
              );
            })
          ) : (
            <div className="option disabled">No options</div>
          )}
        </div>
      ) : null}

      {error ? <div className="inp-error-msg">{error}</div> : null}
    </div>
  );
};

export default FormSelect;
