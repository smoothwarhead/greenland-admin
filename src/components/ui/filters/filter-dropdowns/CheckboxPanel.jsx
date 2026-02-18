import BasePopover from "./BasePopover";

export default function CheckboxPanel({
  align,
  title,
  options = [],          // now can be strings OR {value,label}
  selectedSet,           // Set<string> of values
  onToggle,              // (value) => void
  emptyText = "No values found.",
}) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <BasePopover align={align} title={title}>
      <div className="fsList">
        {normalized.map((opt) => (
          <label key={opt.value} className="fsCheck">
            <input
              type="checkbox"
              checked={selectedSet.has(opt.value)}
              onChange={() => onToggle(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}

        {!normalized.length && <div className="fsEmpty">{emptyText}</div>}
      </div>
    </BasePopover>
  );
}
