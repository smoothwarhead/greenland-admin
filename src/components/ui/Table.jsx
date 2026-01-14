export default function Table({ columns, rows, grid = "1.2fr 0.9fr 1fr" }) {
  return (
    <div className="proTable" style={{ ["--grid"]: grid }}>
      <div
        className="proTableHead"
        style={{ gridTemplateColumns: "var(--grid)" }}
      >
        {columns.map((c) => (
          <div key={c} className="proTh">
            {c}
          </div>
        ))}
      </div>
      {rows.map((r, idx) => (
        <div
          key={idx}
          className="proTr"
          style={{ gridTemplateColumns: "var(--grid)" }}
        >
          {r.map((cell, j) => (
            <div key={j} className="proTd">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}