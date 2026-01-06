
export default function Stat({ label, value, hint }) {
  return (
    <div className="stat">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      {hint && <div className="statHint">{hint}</div>}
    </div>
  );
}
