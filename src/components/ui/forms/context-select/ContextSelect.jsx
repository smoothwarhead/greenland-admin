import { useEffect, useRef, useState } from "react";
import "./custom-select.scss";
import { IoIosArrowDown } from "react-icons/io";


function cx(...a) {
  return a.filter(Boolean).join(" ");
}

export function ContextSelect({
  label,
  value,
  options,
  placeholder = "Select…",
  onSelect,
  disabled = false
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = options.find((o) => o.value === value);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="ctxSelect" ref={ref}>
      {label ? <div className="ctxLabel">{label}</div> : null}

      <button
        className={cx("ctxTrigger", open && "open")}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="ctxValue">
          {active ? active.label : <span className="ctxPlaceholder">{placeholder}</span>}
        </span>
        <span className={cx("ctxChevron", open && "open")}>
            <IoIosArrowDown />
        </span>
      </button>

      {open ? (
        <div className="ctxMenu" role="listbox">
          {options.length === 0 ? (
            <div className="ctxEmpty">No options</div>
          ) : (
            options.map((o) => (
              <button
                key={o.value}
                className={cx("ctxOption", o.value === value && "active")}
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  setOpen(false);
                  if (o.value !== value) onSelect(o.value);
                }}
              >
                <span className="ctxOptionLabel">{o.label}</span>
                {o.value === value ? <span className="ctxCheck">✓</span> : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
