import { useData } from "../../context/DataContext";




function SkeletonLine({ w = 120 }) {
  return <div style={{
    width: w, height: 10, borderRadius: 999,
    background: "#e5e7eb", overflow: "hidden"
  }} />;
}

export function TopbarStatus() {
  const { farmState, storeState } = useData();

  const badge = (label, st) => {
    if (st.status === "idle") return null;
    if (st.status === "loading") return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="muted">{label}</span>
        <SkeletonLine w={90} />
      </div>
    );
    if (st.status === "error") return <span style={{ color: "#b91c1c" }}>{label}: {st.error}</span>;
    return <span className="muted">{label}: synced</span>;
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      {badge("Farm", farmState)}
      {badge("Store", storeState)}
    </div>
  );
}
