
export default function Card({ title, subtitle, right, children }) {
  return (
    <div className="proCard">
      <div className="proCardHead">
        <div>
          <div className="proCardTitle">{title}</div>
          {subtitle ? <div className="proCardSub">{subtitle}</div> : null}
        </div>
        {right ? <div className="proCardRight">{right}</div> : null}
      </div>
      <div className="proCardBody">{children}</div>
    </div>
  );
}
