import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  hydrateCachesFromStorage,
  loadFarmData,
  loadStoreData,
  getFarmCacheEntry,
  getStoreCacheEntry,
} from "../app/dataApi";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { activeFarmId, activeStoreId, user, can } = useAuth();

  const userHasAnyStoreScope =
    can("ADMIN_ALL") || (user?.scopes?.stores || []).length > 0;

  const [farmState, setFarmState] = useState({
    status: "idle",
    data: null,
    error: null,
    fromCache: false,
  });

  const [storeState, setStoreState] = useState({
    status: "idle",
    data: null,
    error: null,
    fromCache: false,
  });

  useEffect(() => {
    hydrateCachesFromStorage();
  }, []);

  // FARM auto-load
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!activeFarmId) {
        setFarmState({
          status: "idle",
          data: null,
          error: null,
          fromCache: false,
        });
        return;
      }

      const cached = getFarmCacheEntry(activeFarmId);
      if (cached) {
        setFarmState({
          status: "ready",
          data: cached.data,
          error: null,
          fromCache: true,
        });
        return;
      }

      setFarmState({
        status: "loading",
        data: null,
        error: null,
        fromCache: false,
      });
      try {
        const res = await loadFarmData(activeFarmId);
        if (cancelled) return;
        setFarmState({
          status: "ready",
          data: res.data,
          error: null,
          fromCache: res.fromCache,
        });
      } catch (e) {
        if (cancelled) return;
        setFarmState({
          status: "error",
          data: null,
          error: e?.message || "Failed loading farm.",
          fromCache: false,
        });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [activeFarmId]);

  // STORE auto-load
  useEffect(() => {
    let cancelled = false;

    async function run() {
      // NEW: if user is not store staff, disable store data entirely
      if (!userHasAnyStoreScope) {
        setStoreState({
          status: "idle",
          data: null,
          error: null,
          fromCache: false,
        });
        return;
      }
      if (!activeStoreId) {
        setStoreState({
          status: "idle",
          data: null,
          error: null,
          fromCache: false,
        });
        return;
      }

      const cached = getStoreCacheEntry(activeStoreId);
      if (cached) {
        setStoreState({
          status: "ready",
          data: cached.data,
          error: null,
          fromCache: true,
        });
        return;
      }

      setStoreState({
        status: "loading",
        data: null,
        error: null,
        fromCache: false,
      });
      try {
        const res = await loadStoreData(activeStoreId);
        if (cancelled) return;
        setStoreState({
          status: "ready",
          data: res.data,
          error: null,
          fromCache: res.fromCache,
        });
      } catch (e) {
        if (cancelled) return;
        setStoreState({
          status: "error",
          data: null,
          error: e?.message || "Failed loading store.",
          fromCache: false,
        });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [activeStoreId, userHasAnyStoreScope]);

  const value = useMemo(
    () => ({
      farmState,
      storeState,
      reloadFarm: async () =>
        activeFarmId ? loadFarmData(activeFarmId, { force: true }) : null,
      reloadStore: async () =>
        activeStoreId ? loadStoreData(activeStoreId, { force: true }) : null,
    }),
    [farmState, storeState, activeFarmId, activeStoreId]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
