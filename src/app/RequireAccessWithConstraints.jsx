import { Navigate, useLocation, useParams } from "react-router-dom";
import { passesRouteConstraints, ROUTES } from "./routeRegistry";
import { useAuth } from "../context/AuthContext";

export function RequireAccessWithConstraints({ routeKey, children }) {
  const { can, inFarmScope, inStoreScope, user } = useAuth();
  const loc = useLocation();
  const params = useParams();
  const route = ROUTES[routeKey];

  if (!user) return <Navigate to="/not-authorized" replace />; // demo app
  if (!route) return <Navigate to="/not-authorized" replace />;

  // permission
  if (route.perm && !can(route.perm))
    return <Navigate to="/not-authorized" replace />;

  // scope membership + constraints
  if (route.scope === "farm") {
    const farmId = params.farmId;
    if (farmId && !inFarmScope(farmId))
      return <Navigate to="/not-authorized" replace />;
    if (!passesRouteConstraints(routeKey, { farmId }))
      return <Navigate to="/not-authorized" replace />;
  }

  if (route.scope === "store") {
    const storeId = params.storeId;

    // ✅ NEW: must have store scope at all
    const userHasAnyStoreScope =
      (user?.scopes?.stores || []).length > 0 || can("ADMIN_ALL");
    if (!userHasAnyStoreScope) return <Navigate to="/not-authorized" replace />;

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
