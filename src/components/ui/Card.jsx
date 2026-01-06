
export default function Card({ title, children, right }) {
  return (
    <section className="card">
      {(title || right) && (
        <div className="cardHead">
          <h3>{title}</h3>
          <div>{right}</div>
        </div>
      )}
      <div className="cardBody">{children}</div>
    </section>
  );
}
