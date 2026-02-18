

export default function BasePopover({
  align = "left", // "left" | "right"
  title,
  children,
  className = "",
}) {
  return (
    <div className={`fsPanel is-${align} ${className}`}>
      {title ? <div className="fsPanel__title">{title}</div> : null}
      {children}
    </div>
  );
}
