import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
// import { ROLE_PERMISSIONS } from "./rolePermissions";
// import { PERM } from "./perms";

import { FARMS, STORES } from "../app/orgMap";
import { ROLE_PERMISSIONS } from "../app/rolePermissions";
import { PERM } from "../app/perms";
import { USERS } from "../data/others";
import { LS_SESSION } from "../data/storageKeys";

// import { farmSelectData } from "../pages/farm-selection/farm-select-data";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(USERS);

  const [authHydrated, setAuthHydrated] = useState(false);

  // active context
  const [activeFarmId, setActiveFarmId] = useState(null);
  const [activeStoreId, setActiveStoreId] = useState(null);

  // const allStores = farmSelectData.find(d => d.id === "store").stores.map(s => s.name);

  const permissions = useMemo(() => {
    const base = user ? ROLE_PERMISSIONS[user?.role] || [] : [];
    return new Set(base);
  }, [user]);

  const isAuthenticated = !!user;

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

  useEffect(() => {
    const raw = localStorage.getItem(LS_SESSION);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
      } catch {}
    }
    setAuthHydrated(true);
  }, []);

  //login sim
  const login = async ({ demoUserId, context }) => {
    const next = USERS.find((u) => u.id === demoUserId) || USERS[0];
    setUser(next);

    // set selected context into active farm/store if user has scope
    if (context?.type === "farm") {
      const farmId = context.id;
      setActiveStoreId(null);
      setActiveFarmId(
        next.scopes?.farms?.includes(farmId) ||
          (ROLE_PERMISSIONS[next.role] || []).includes(PERM.ADMIN_ALL)
          ? farmId
          : null
      );
    } else if (context?.type === "store") {
      const storeId = context.id;
      setActiveFarmId(null);
      setActiveStoreId(
        next.scopes?.stores?.includes(storeId) ||
          (ROLE_PERMISSIONS[next.role] || []).includes(PERM.ADMIN_ALL)
          ? storeId
          : null
      );
    } else {
      // no context? default to first accessible (optional)
      setActiveFarmId(next.scopes?.farms?.[0] || null);
      setActiveStoreId(next.scopes?.stores?.[0] || null);
    }

    return next;
  };

  const logout = () => {
    setUser(null);
    setActiveFarmId(null);
    setActiveStoreId(null);
  };

  // When switching user, reset selections to something valid
  const switchUser = (userId) => {
    const next = USERS.find((u) => u.id === userId);
    if (!next) return;
    setUser(next);

    // pick first accessible farm/store (or null)
    const farm = (next.scopes?.farms || [])[0];
    const store = (next.scopes?.stores || [])[0];

    setActiveFarmId(farm || null);
    setActiveStoreId(store || null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        can,
        inFarmScope,
        inStoreScope,
        activeFarmId,
        setActiveFarmId,
        activeStoreId,
        setActiveStoreId,
        switchUser,
        demoUsers: USERS,
        isAuthenticated,
        login,
        logout,
        authHydrated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
