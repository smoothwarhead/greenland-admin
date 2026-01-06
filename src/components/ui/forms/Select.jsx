

export default function Select({ label, options = [], ...props }) {
  return (
    <label className="field">
      {label && <span className="label">{label}</span>}
      <select className="input" {...props}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
