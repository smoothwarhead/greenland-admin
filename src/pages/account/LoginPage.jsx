import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPendingContext, clearPendingContext } from "../../app/ContextSession";
import { buildTo } from "../../app/routeRegistry";
import { FARMS, STORES } from "../../app/orgMap";
import { useAuth } from "../../context/AuthContext";








export function LoginPage() {


  const { demoUsers, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const ctx = useMemo(() => getPendingContext(), []);
  const [demoUserId, setDemoUserId] = useState(demoUsers[0]?.id || "");
  const [pw, setPw] = useState("");

  
  const ctxLabel = useMemo(() => {
    if (!ctx) return "No context selected";
    if (ctx.type === "farm") return FARMS.find(f => f.id === ctx.id)?.name || ctx.id;
    if (ctx.type === "store") return STORES.find(s => s.id === ctx.id)?.name || ctx.id;
    return "Unknown";
  }, [ctx]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // demo password: 1234
    if (pw !== "1234") return alert("Wrong password. Use 1234 (demo).");

    const user = await login({ demoUserId, context: ctx });
    clearPendingContext();

    // redirect target:
    // If user tried to visit a deep link, allow that; else go to selected dashboard.
    const from = loc.state?.from;

    if (from) return nav(from, { replace: true });

    if (ctx?.type === "farm") return nav(buildTo("FARM_OVERVIEW", { farmId: ctx.id }), { replace: true });
    if (ctx?.type === "store") return nav(buildTo("STORE_OVERVIEW", { storeId: ctx.id }), { replace: true });

    // fallback (no context)
    return nav("/app", { replace: true });
  };

  return (
    <div className="page">
      <div className="pageTitle">Login</div>
      <div className="pageMeta">Context: <b>{ctxLabel}</b></div>

      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <div className="field">
          <label>Demo user</label>
          <select value={demoUserId} onChange={(e) => setDemoUserId(e.target.value)}>
            {demoUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Password</label>
          <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="1234" />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" type="button" onClick={() => nav("/select-context")}>Back</button>
          <button className="btn" type="submit" style={{ fontWeight: 800 }}>Login</button>
        </div>

        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>Demo password: <b>1234</b></div>
      </form>
    </div>
  );
}
