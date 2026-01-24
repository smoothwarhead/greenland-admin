import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export function IndexRedirect() {
  const { isAuthenticated, authHydrated } = useAuth();
  const { activeContext, dataHydrated } = useData();

  // ✅ wait for boot
  if (!authHydrated || !dataHydrated) return null;

  // ✅ no context → pick one
  if (!activeContext) return <Navigate to="/select-context" replace />;

  // ✅ context but not logged in → login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ✅ logged in + context → go to correct overview
  if (activeContext.type === "farm") {
    return <Navigate to={`/app/farms/${activeContext.id}/overview`} replace />;
  }
  if (activeContext.type === "store") {
    return <Navigate to={`/app/stores/${activeContext.id}/overview`} replace />;
  }

  return <Navigate to="/app" replace />;
}
