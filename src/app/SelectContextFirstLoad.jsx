import React from "react";
import { useNavigate } from "react-router-dom";
import { FARMS, STORES } from "./orgMap";
import { setPendingContext } from "./ContextSession";

export function SelectContextFirstLoad() {
  const nav = useNavigate();
  

  const choose = (type, id) => {
    setPendingContext({ type, id });
    nav("/login", { replace: true }); //go to login after selecting
  };

  return (
    <div className="page">
      <div className="pageTitle">Choose where you want to work</div>
      <div className="pageMeta">Select a farm or a store. You’ll log in next.</div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 800 }}>Farms</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {FARMS.map((f) => (
            <button key={f.id} className="btn" onClick={() => choose("farm", f.id)}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 800 }}>Stores</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {STORES.map((s) => (
            <button key={s.id} className="btn" onClick={() => choose("store", s.id)}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
