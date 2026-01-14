import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { loginData } from "../../data/others";
import "./login.scss";
import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { FARMS, STORES } from "../../app/orgMap";
import {
  getPendingContext,
  clearPendingContext,
} from "../../app/ContextSession";
import FormInput from "../../components/ui/forms/form-input/FormInput";
import BackButton from "../../components/ui/buttons/back-btn/BackButton";
import { buildTo } from "../../app/routeRegistry";

const Login = () => {
  const { demoUsers, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const ctx = useMemo(() => getPendingContext(), []);
  const [demoUserId, setDemoUserId] = useState(demoUsers[0]?.id || "");
  const [pw, setPw] = useState("");

  const ctxLabel = useMemo(() => {
    if (!ctx) return "No context selected";
    if (ctx.type === "farm")
      return FARMS.find((f) => f.id === ctx.id)?.name || ctx.id;
    if (ctx.type === "store")
      return STORES.find((s) => s.id === ctx.id)?.name || ctx.id;
    return "Unknown";
  }, [ctx]);

  // useEffect(() => {
  //   const raw = localStorage.getItem(LS_KEY);
  //   if (!raw) {
  //     nav("/select-context");
  //     return;
  //   }
  //   const ctx = JSON.parse(raw);
  //   setContext(ctx);
  //   setActiveContext?.(ctx);

  //   (async () => {
  //     setStatus("loading");
  //     setError(null);
  //     try {
  //       const res = await loadOrg();
  //       setUsers(res?.data?.users || []);
  //       setStatus("ready");
  //     } catch (e) {
  //       setError(String(e?.message || e));
  //       setStatus("error");
  //     }
  //   })();
  // }, []);

  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // demo password: 1234
    if (pw !== "1234") return alert("Wrong password. Use 1234 (demo).");

    const user = await login({ demoUserId, context: ctx });
    // clearPendingContext();
    // console.log(user);

    // redirect target:
    // If user tried to visit a deep link, allow that; else go to selected dashboard.
    const from = loc.state?.from;

    if (from) return nav(from, { replace: true });

    if (ctx?.type === "farm")
      return nav(buildTo("FARM_OVERVIEW", { farmId: ctx.id }), {
        replace: true,
      });
    if (ctx?.type === "store")
      return nav(buildTo("STORE_OVERVIEW", { storeId: ctx.id }), {
        replace: true,
      });

    // fallback (no context)
    return nav("/app", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <BackButton action={() => nav(-1)} />
      </div>
      <div className="field">
        <label>Demo user</label>
        <select
          value={demoUserId}
          onChange={(e) => setDemoUserId(e.target.value)}
        >
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

        <form
          action=""
          className="form-container"
          onSubmit={onSubmit}
          style={{ maxWidth: 520 }}
        >
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
            {/* {loginData.map((input, index) => (
              <FormInput
                key={index}
                inputType="text"
                {...input}
                icon={null}
                value={formData[input.name]}
                handleChange={handleChange}
                isPassword={input.isPassword}
                validate={input.validate}
                errorMessage={input.errorMessage}
                error={error}
                cName="login-input"
              />
            ))} */}
          </div>

          <button
            className="login-btn"
            type="submit"
            style={{ fontWeight: 800 }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
