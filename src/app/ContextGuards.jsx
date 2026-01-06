import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * mode:
 * - "farm": must have activeFarmId
 * - "store": must have activeStoreId
 * - "either": must have at least one of them
 */
export function RequireContextSelection({ mode = "either", children }) {
  const { activeFarmId, activeStoreId } = useAuth();
  const loc = useLocation();

  const ok =
    mode === "farm" ? !!activeFarmId :
    mode === "store" ? !!activeStoreId :
    !!activeFarmId || !!activeStoreId;

  if (!ok) return <Navigate to="/app/select" state={{ from: loc.pathname }} replace />;
  return children;
}
