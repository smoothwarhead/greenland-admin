
export default function Card({ title, subtitle, right, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">{title}</div>
          {subtitle ? <div className="card-sub">{subtitle}</div> : null}
        </div>
        {right ? <div className="card-right">{right}</div> : null}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
