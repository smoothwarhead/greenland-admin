

export default function Button({ variant = "primary", ...props }) {
  return <button className={`btn ${variant}`} {...props} />;
}
