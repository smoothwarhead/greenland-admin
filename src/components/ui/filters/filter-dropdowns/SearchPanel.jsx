import BasePopover from "./BasePopover";

export default function SearchPanel({
  align,
  value,
  onChange,
  placeholder = "Search by name or SKU…",
  hint = "Tip: try “tomato” or “COMM-”",
}) {
  return (
    <BasePopover align={align} title="Search">
      <input
        className="fsInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint ? <div className="fsPanel__hint">{hint}</div> : null}
    </BasePopover>
  );
}
