import { Link } from "react-router-dom";



export function BigLink({ to, title, desc, meta }) {
  return (
    <Link to={to} className="bigLink">
      <div className="bigLinkTop">
        <div className="bigLinkTitle">{title}</div>
        <div className="bigLinkMeta">{meta}</div>
      </div>
      <div className="bigLinkDesc">{desc}</div>
      <div className="bigLinkCta">Open →</div>
    </Link>
  );
}