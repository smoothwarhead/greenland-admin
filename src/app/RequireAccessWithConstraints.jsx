import { Navigate, useLocation, useParams } from "react-router-dom";
import { passesRouteConstraints, ROUTES } from "./routeRegistry";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export function RequireAccessWithConstraints({ routeKey, children }) {
  const { can, inFarmScope, inStoreScope, user, authHydrated } = useAuth();
  const { dataHydrated, activeContext } = useData();
  const loc = useLocation();
  const params = useParams();
  const route = ROUTES[routeKey];

  if(!authHydrated || !authHydrated){
    return <div style={{ padding: 18}}>Loading...</div>; // or skeleton
  }

  if (!activeContext) return <Navigate to="/select-context" replace state={{ from: loc.pathname }} />; // demo app

  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  if (!route) return <Navigate to="/not-authorized" replace />;

  // permission
  if (route.perm && !can(route.perm))
    return <Navigate to="/not-authorized" replace />;

  // scope membership + constraints
  if (route.scope === "farm") {
    const farmId = params.farmId || (activeContext.type === "farm" ? ctx.id : null);
    if (!farmId || activeContext.type !== "farm")
      return <Navigate to="/select-context" replace />;

    if (farmId && !inFarmScope(farmId))
      return <Navigate to="/not-authorized" replace />;

    if (!passesRouteConstraints(routeKey, { farmId }))
      return <Navigate to="/not-authorized" replace />;
  }

  if (route.scope === "store") {
    const storeId = params.storeId || (activeContext.type === "store" ? activeContext.id : null);

    // ✅ NEW: must have store scope at all
    const userHasAnyStoreScope =
      (user?.scopes?.stores || []).length > 0 || can("ADMIN_ALL");
    if (!userHasAnyStoreScope) return <Navigate to="/not-authorized" replace />;

    if (!storeId || activeContext.type !== "store") return <Navigate to="/select-context" replace />;

    if (storeId && !inStoreScope(storeId))
      return <Navigate to="/not-authorized" replace />;
    if (!passesRouteConstraints(routeKey, { storeId }))
      return <Navigate to="/not-authorized" replace />;
  }

  if (route.scope === "none") {
    if (!passesRouteConstraints(routeKey, {}))
      return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
