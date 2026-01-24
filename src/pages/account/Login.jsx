import { useLocation, useNavigate } from "react-router-dom";
import "./login.scss";
import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { FARMS, STORES } from "../../app/orgMap";
import { getPendingContext, clearPendingContext, popPendingContext } from "../../app/ContextSession";
import BackButton from "../../components/ui/buttons/back-btn/BackButton";
import { buildTo } from "../../app/routeRegistry";

const Login = () => {
  const { demoUsers, login } = useAuth();
  const { setActiveContextState } = useData(); // ✅ promote ctx to activeContext (persistent)
  const nav = useNavigate();
  const loc = useLocation();

  const ctx = useMemo(() => popPendingContext(), []);
  const [demoUserId, setDemoUserId] = useState(demoUsers?.[0]?.id || "");
  const [pw, setPw] = useState("");

  const ctxLabel = useMemo(() => {
    if (!ctx) return "No context selected";
    if (ctx.type === "farm") return FARMS.find((f) => f.id === ctx.id)?.name || ctx.id;
    if (ctx.type === "store") return STORES.find((s) => f.id === ctx.id)?.name || ctx.id;
    return "Unknown";
  }, [ctx]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (pw !== "1234") {
      alert("Wrong password. Use 1234 (demo).");
      return;
    }

    try {
      // ✅ 1) persist session
      await login({ demoUserId, context: ctx });

      // ✅ 2) persist active context (so refresh stays in app)
      if (ctx) setActiveContextState(ctx);

      // ✅ optional: clear pending
      // clearPendingContext?.();

      // ✅ redirect:
      const from = loc.state?.from;
      if (from) return nav(from, { replace: true });

      if (ctx?.type === "farm") {
        return nav(buildTo("FARM_OVERVIEW", { farmId: ctx.id }), { replace: true });
      }
      if (ctx?.type === "store") {
        return nav(buildTo("STORE_OVERVIEW", { storeId: ctx.id }), { replace: true });
      }

      return nav("/app", { replace: true });
    } catch (err) {
      alert(err?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        {/* ✅ go back to select-context explicitly, not "/" */}
        <BackButton action={() => nav("/select-context")} />
      </div>

      <div className="field">
        <label>Demo user</label>
        <select value={demoUserId} onChange={(e) => setDemoUserId(e.target.value)}>
          {demoUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      </div>

      <div className="login-con">
        <div className="page-meta">
          <b>You are signing into {ctxLabel}</b>
        </div>

        <form className="form-container" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
          <div className="form-header">
            <h2>Login to your account</h2>
          </div>

          <div className="form-elements">
            <div className="field">
              <label>Password</label>
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type="password"
                placeholder="1234"
              />
            </div>
          </div>

          <button className="login-btn" type="submit" style={{ fontWeight: 800 }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
