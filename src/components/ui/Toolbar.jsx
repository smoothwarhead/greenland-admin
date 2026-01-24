export function Toolbar({ left, right }) {
  return (
    <div className="toolbar">
      <div className="toolbarLeft">{left}</div>
      <div className="toolbarRight">{right}</div>
    </div>
  );
}