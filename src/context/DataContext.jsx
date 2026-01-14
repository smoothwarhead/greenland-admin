import { createContext, useContext, useEffect, useState } from "react";
import { loadFarmOverview, loadStoreOverview } from "../app/dataApi";
import { LS_ACTIVE_CONTEXT } from "../data/storageKeys";


const DataCtx = createContext(null);
export const useData = () => useContext(DataCtx);

export function DataProvider({ children }) {

  const [activeContext, setActiveContext] = useState(null); // {type,id}
  const [dataHydrated, setDataHydrated] = useState(false);

 

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


  function setActiveContextState(ctx) {
    setActiveContext(ctx);
    if (ctx) localStorage.setItem(LS_ACTIVE_CONTEXT, JSON.stringify(ctx));
    else localStorage.removeItem(LS_ACTIVE_CONTEXT);
  }

  // load overview for the active context
  useEffect(() => {
    if (!activeContext) return;
    // console.log(activeContext);

    if (activeContext.type === "farm") {
      setFarmState((s) => ({ ...s, status: "loading", error: null }));
      loadFarmOverview(activeContext.id)
        .then((res) =>
          setFarmState({
            status: "ready",
            data: res.data,
            error: null,
            fromCache: res.fromCache,
          })
        )
        .catch((e) =>
          setFarmState({
            status: "error",
            data: null,
            error: String(e.message || e),
            fromCache: false,
          })
        );
    }

    if (activeContext.type === "store") {
      setStoreState((s) => ({ ...s, status: "loading", error: null }));
      loadStoreOverview(activeContext.id)
        .then((res) =>
          setStoreState({
            status: "ready",
            data: res.data,
            error: null,
            fromCache: res.fromCache,
          })
        )
        .catch((e) =>
          setStoreState({
            status: "error",
            data: null,
            error: String(e.message || e),
            fromCache: false,
          })
        );
    }
  }, [activeContext?.type, activeContext?.id]);


  
  useEffect(() => {
    const raw = localStorage.getItem(LS_ACTIVE_CONTEXT);
    if (raw) setActiveContextState(JSON.parse(raw));
    setDataHydrated(true);
  }, []);


 



  const value = {
    activeContext,
    setActiveContext,
    farmState,
    setFarmState,
    storeState,
    setStoreState,
    dataHydrated,
    setDataHydrated
  };

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}
