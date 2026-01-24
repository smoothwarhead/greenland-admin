import { cx } from "../../utils/methods";


export default function Stat({ label, value, hint, tone="neutral" }) {
  return (
     <div className="stat">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      <div className="statFoot">
        <span className="muted">{hint}</span>
        <span className={cx("statDot", tone)} />
      </div>
    </div>
  );
}
