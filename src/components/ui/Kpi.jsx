import { cx } from "../../methods";



export default function KPI({ label, value, hint, tone = "neutral" }) {
  return (
    <div className="kpi">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      <div className="kpiFoot">
        {hint ? (
          <span className="muted">{hint}</span>
        ) : (
          <span className="muted"> </span>
        )}
        <span className={cx("kpiTone", tone)} />
      </div>
    </div>
  );
}