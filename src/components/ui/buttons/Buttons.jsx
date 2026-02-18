import "./buttons.scss";



export function ButtonWithLefttIcon({ variant, text, action, icon }) {
  return (
    <div onClick={action} className={`btn ${variant}`}>
      {icon}
      {text}
    </div>
  );
}

export function Button({ variant, text, action }) {
  return (
    <div onClick={action} className={`btn ${variant}`}>
      {text}
    </div>
  );
}
