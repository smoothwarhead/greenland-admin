import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPendingContext } from "../app/ContextSession";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export function RequirePendingContext({ children }) {
  const { isAuthenticated, authHydrated } = useAuth();
  const { activeContext, dataHydrated, setActiveContextState } = useData();
  const loc = useLocation();

  if (!authHydrated || !dataHydrated) return null;

  // If already logged in, don't stay on /login
  if (isAuthenticated) {
    if (!activeContext) return <Navigate to="/select-context" replace />;
    if (activeContext.type === "farm") return <Navigate to={`/app/farms/${activeContext.id}/overview`} replace />;
    if (activeContext.type === "store") return <Navigate to={`/app/stores/${activeContext.id}/overview`} replace />;
    return <Navigate to="/app" replace />;
  }

  const pending = getPendingContext();
  const ctx = pending || activeContext;

  // Optional: promote pending → active to keep state consistent
  if (pending && !activeContext) setActiveContextState(pending);

  if (!ctx?.type || !ctx?.id) {
    return <Navigate to="/select-context" replace state={{ from: loc.pathname }} />;
  }

  return children;
}
