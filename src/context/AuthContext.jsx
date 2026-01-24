import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ROLE_PERMISSIONS } from "../app/rolePermissions";
import { PERM } from "../app/perms";
import { USERS } from "../data/others";
import { LS_SESSION } from "../data/storageKeys";
import SessionManager from "../utils/SessionManager";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function hasAdminAll(role) {
  return (ROLE_PERMISSIONS[role] || []).includes(PERM.ADMIN_ALL);
}

function userHasContextScope(user, context) {
  if (!user) return false;
  if (!context?.type || !context?.id) return true; // allow login without context (optional)
  if (hasAdminAll(user.role)) return true;

  if (context.type === "farm") return (user.scopes?.farms || []).includes(context.id);
  if (context.type === "store") return (user.scopes?.stores || []).includes(context.id);
  return false;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionContext, setSessionContext] = useState(null); // {type,id,name?}
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authHydrated, setAuthHydrated] = useState(false);

  // ✅ Permissions Set is derived from current user
  const permissions = useMemo(() => {
    const base = user ? ROLE_PERMISSIONS[user.role] || [] : [];
    return new Set(base);
  }, [user]);

  const can = (perm) => {
    if (!user) return false;
    if (permissions.has(PERM.ADMIN_ALL)) return true;
    return permissions.has(perm);
  };

  const inFarmScope = (farmId) => {
    if (!user) return false;
    if (permissions.has(PERM.ADMIN_ALL)) return true;
    return (user.scopes?.farms || []).includes(farmId);
  };

  const inStoreScope = (storeId) => {
    if (!user) return false;
    if (permissions.has(PERM.ADMIN_ALL)) return true;
    return (user.scopes?.stores || []).includes(storeId);
  };

  // ✅ Restore session from storage on boot
  useEffect(() => {
    try {
      const saved = SessionManager.getUserSession(LS_SESSION);
      if (saved?.user?.id) {
        setUser(saved.user);
        setSessionContext(saved.context || null);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setSessionContext(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setSessionContext(null);
      setIsAuthenticated(false);
    } finally {
      setAuthHydrated(true);
    }
  }, []);

  // ✅ Login (demo) + persist
  const login = async ({ demoUserId, context }) => {
    const next = USERS.find((u) => u.id === demoUserId) || null;
    if (!next) throw new Error("Invalid demo user");

    // validate context scope (store staff cannot log into farm context, etc.)
    if (context && !userHasContextScope(next, context)) {
      throw new Error("User does not have access to this farm/store context.");
    }

    setUser(next);
    setSessionContext(context || null);
    setIsAuthenticated(true);

    SessionManager.setUserSession(LS_SESSION, {
      user: next,
      context: context || null,
      issuedAt: new Date().toISOString(),
    });

    return next;
  };

  const logout = () => {
    setUser(null);
    setSessionContext(null);
    setIsAuthenticated(false);
    SessionManager.removeUserSession(LS_SESSION);
  };

  // Optional: switchUser for demo (also persists)
  const switchUser = (userId) => {
    const next = USERS.find((u) => u.id === userId) || null;
    if (!next) return;

    // keep context only if still valid for new user
    const ctxOk = userHasContextScope(next, sessionContext);
    const nextCtx = ctxOk ? sessionContext : null;

    setUser(next);
    setSessionContext(nextCtx);
    setIsAuthenticated(true);

    SessionManager.setUserSession(LS_SESSION, {
      user: next,
      context: nextCtx,
      issuedAt: new Date().toISOString(),
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      authHydrated,

      // session context (useful for redirects + guards)
      sessionContext,

      can,
      inFarmScope,
      inStoreScope,

      login,
      logout,
      switchUser,
      demoUsers: USERS,
    }),
    [user, isAuthenticated, authHydrated, sessionContext, permissions],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
