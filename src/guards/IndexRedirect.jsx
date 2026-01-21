import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";



export function IndexRedirect() {
  const { isAuthenticated, authHydrated } = useAuth();
  const { activeContext, dataHydrated } = useData();

  // Wait for rehydration (important to prevent false redirects)
  if (!authHydrated|| !dataHydrated) return <p>Loading</p>;

  if (!activeContext) return <Navigate to="/select-context" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (activeContext.type === "farm") {
    return <Navigate to={`/app/farms/${activeContext.id}/overview`} replace />;
  }
  return <Navigate to={`/app/stores/${activeContext.id}/overview`} replace />;
}
