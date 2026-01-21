import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPendingContext } from "./ContextSession";
import { useAuth } from "../context/AuthContext";

// export function RequireAuth({ children }) {
//   const { isAuthenticated } = useAuth();
//   const loc = useLocation();
//   if (!isAuthenticated) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
//   return children;
// }

// Ensures user selected farm/store BEFORE login
export function RequirePendingContext({ children }) {
  const ctx = getPendingContext();
  if (!ctx?.type || !ctx?.id) return <Navigate to="/select-context" replace />;
  return children;
}
