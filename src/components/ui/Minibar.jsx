
export default function MiniBar({ value, max }) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round(((value ?? 0) / (max || 1)) * 100))
  );
  return (
    <div className="miniBar" title={`${pct}%`}>
      <div className="miniBarFill" style={{ width: `${pct}%` }} />
    </div>
  );
}
