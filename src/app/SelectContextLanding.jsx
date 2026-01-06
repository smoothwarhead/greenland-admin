import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FARMS, STORES } from "./orgMap";
import { buildTo } from "./routeRegistry";
import { useContextSwitch } from "./SwitcherGuard";
import { useAuth } from "../context/AuthContext";

export function SelectContextLanding() {
  const nav = useNavigate();
  const loc = useLocation();
  const { inFarmScope, inStoreScope, activeFarmId, activeStoreId } = useAuth();

  const accessibleFarms = FARMS.filter((f) => inFarmScope(f.id));
  const accessibleStores = STORES.filter((s) => inStoreScope(s.id));

  const from = loc.state?.from;

  const { requestSwitch, ReAuthModal } = useContextSwitch({
    onSwitched: ({ type, id }) => {
      // After selecting, go where they wanted, or to overview
      if (from) return nav(from);
      if (type === "farm") return nav(buildTo("FARM_OVERVIEW", { farmId: id }));
      if (type === "store")
        return nav(buildTo("STORE_OVERVIEW", { storeId: id }));
      return nav("/app");
    },
  });

  const res = requestSwitch({ type: "farm", id: f.id });
  if (res.blocked) alert("You don't have access to that farm.");

  return (
    <div className="page">
      <div className="pageTitle">Select context</div>
      <div className="pageMeta">
        Choose a farm and/or store you want to work in. (Scoped menus will
        appear after selection.)
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 800 }}>Farms</div>
        {accessibleFarms.length === 0 ? (
          <div className="muted">No farm access assigned.</div>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {accessibleFarms.map((f) => (
              <button
                key={f.id}
                className="btn"
                onClick={() => requestSwitch({ type: "farm", id: f.id })}
                style={{ fontWeight: activeFarmId === f.id ? 800 : 600 }}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {accessibleStores.length > 0 ? (
        <div className="card" style={{ display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 800 }}>Stores</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {accessibleStores.map((s) => (
              <button
                key={s.id}
                className="btn"
                onClick={() => requestSwitch({ type: "store", id: s.id })}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {ReAuthModal}
    </div>
  );
}
