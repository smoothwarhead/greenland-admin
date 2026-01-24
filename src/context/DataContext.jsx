import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadCommission, loadFarmOverview, loadStoreOverview } from "../app/dataApi";
import { LS_ACTIVE_CONTEXT } from "../data/storageKeys";
import SessionManager from "../utils/SessionManager";



const DataCtx = createContext(null);
export const useData = () => useContext(DataCtx);

export function DataProvider({ children }) {
  const [activeContext, setActiveContext] = useState(null); // { type: "farm"|"store", id, name? }
  const [dataHydrated, setDataHydrated] = useState(false);

  const [activeFarmId, setActiveFarmId] = useState(null);
  const [activeStoreId, setActiveStoreId] = useState(null);

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

  
const [commissionState, setCommissionState] = useState({
  status: "idle",
  data: null,
  error: null,
  fromCache: false
});



  // ✅ Single source of truth: ALWAYS use this to set context (persists + derives ids)
  function setActiveContextState(ctx) {
    setActiveContext(ctx || null);

    // ✅ derive activeFarmId/storeId from ctx (NOT from activeContext)
    if (ctx?.type === "farm") {
      setActiveFarmId(ctx.id);
      setActiveStoreId(null);
    } else if (ctx?.type === "store") {
      setActiveStoreId(ctx.id);
      setActiveFarmId(null);
    } else {
      setActiveFarmId(null);
      setActiveStoreId(null);
    }

    // ✅ persist
    if (ctx) SessionManager.setUserContext(LS_ACTIVE_CONTEXT, ctx);
    else SessionManager.removeUserContext(LS_ACTIVE_CONTEXT);
  }

  // ✅ Rehydrate context on first mount
  useEffect(() => {
    try {
      const saved = SessionManager.getUserContext(LS_ACTIVE_CONTEXT);
      if (saved) setActiveContextState(saved);
    } finally {
      setDataHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Load overview for active context
  useEffect(() => {
    if (!activeContext?.type || !activeContext?.id) return;

    if (activeContext.type === "farm") {
      setFarmState((s) => ({ ...s, status: "loading", error: null }));
      // Optional: reset store state so UI doesn't show stale store data
      setStoreState((s) => ({ ...s, status: "idle", data: null, error: null, fromCache: false }));

      loadFarmOverview(activeContext.id)
        .then((res) =>
          setFarmState({
            status: "ready",
            data: res.data,
            error: null,
            fromCache: !!res.fromCache,
          }),
        )
        .catch((e) =>
          setFarmState({
            status: "error",
            data: null,
            error: String(e?.message || e),
            fromCache: false,
          }),
        );
    }

    if (activeContext.type === "store") {
      setStoreState((s) => ({ ...s, status: "loading", error: null }));
      // Optional: reset farm state so UI doesn't show stale farm data
      setFarmState((s) => ({ ...s, status: "idle", data: null, error: null, fromCache: false }));

      loadStoreOverview(activeContext.id)
        .then((res) =>
          setStoreState({
            status: "ready",
            data: res.data,
            error: null,
            fromCache: !!res.fromCache,
          }),
        )
        .catch((e) =>
          setStoreState({
            status: "error",
            data: null,
            error: String(e?.message || e),
            fromCache: false,
          }),
        );
    }
  }, [activeContext?.type, activeContext?.id]);


  useEffect(() => {
  // load once after login, or when app shell mounts
  setCommissionState((s) => ({ ...s, status: "loading", error: null }));
  loadCommission()
    .then((res) => setCommissionState({ status: "ready", data: res.data, error: null, fromCache: res.fromCache }))
    .catch((e) => setCommissionState({ status: "error", data: null, error: String(e.message || e), fromCache: false }));
}, []);

  // ✅ IMPORTANT: do NOT expose raw setActiveContext (it bypasses persistence)
  const value = useMemo(
    () => ({
      activeContext,
      setActiveContextState, // use this everywhere
      dataHydrated,

      activeFarmId,
      activeStoreId,

      farmState,
      setFarmState,
      storeState,
      setStoreState,
      commissionState, setCommissionState
    }),
    [activeContext, dataHydrated, activeFarmId, activeStoreId, farmState, storeState],
  );

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}
