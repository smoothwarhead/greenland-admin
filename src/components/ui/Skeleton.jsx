
export default function Skeleton({ lines = 6 }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 10,
            background:
              "linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.14), rgba(255,255,255,.06))",
            backgroundSize: "240px 100%",
            animation: "shimmer 1.1s infinite",
          }}
        />
      ))}
    </div>
  );
}
