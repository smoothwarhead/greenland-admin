import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";



export function RequireAuth({ children }) {
  const { isAuthenticated, authHydrated } = useAuth();
  const { activeContext, dataHydrated } = useData();
  const loc = useLocation();

  if (!authHydrated || !dataHydrated) return null;

  if (!activeContext) return <Navigate to="/select-context" replace state={{ from: loc.pathname }}/>;


    // ✅ if user is in store context, block farm URLs (and vice versa)
  const isFarmPath = loc.pathname.startsWith("/app/farms/");
  const isStorePath = loc.pathname.startsWith("/app/stores/");
  if (activeContext.type === "farm" && isStorePath) {
    return <Navigate to={`/app/farms/${activeContext.id}/overview`} replace />;
  }
  if (activeContext.type === "store" && isFarmPath) {
    return <Navigate to={`/app/stores/${activeContext.id}/overview`} replace />;
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return children;
}
