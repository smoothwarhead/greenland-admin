import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FARMS, STORES } from "./orgMap";
import { ROUTES, buildTo } from "./routeRegistry";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useContextSwitch } from "./SwitcherGuard";
import { TopbarStatus } from "../components/topbar/TopbarStatus";
import { Breadcrumbs } from "./Breadcrumbs";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Topbar } from "../components/topbar/Topbar";

export function AppShell() {
  const {
    user,
    demoUsers,
    switchUser,
    activeFarmId,
    setActiveFarmId,
    activeStoreId,
    setActiveStoreId,
    inFarmScope,
    inStoreScope,
  } = useAuth();

  const nav = useNavigate();

  const loc = useLocation();
  useDocumentTitle({ pathname: loc.pathname, activeFarmId, activeStoreId });


  const { requestSwitch, ReAuthModal } = useContextSwitch({
    onSwitched: ({ type, id }) => {
      if (type === "farm") nav(buildTo("FARM_OVERVIEW", { farmId: id }));
      if (type === "store") nav(buildTo("STORE_OVERVIEW", { storeId: id }));
    },
  });

  //   const res = requestSwitch({ type: "farm", activeFarmId });
  //   if (res.blocked) {
  //     alert("You don't have access to that farm.");
  //     return;
  //   }

  

  const goFarmHome = (farmId) => nav(buildTo("FARM_OVERVIEW", { farmId }));
  const goStoreHome = (storeId) => nav(buildTo("STORE_OVERVIEW", { storeId }));


  const accessibleFarms = FARMS.filter((f) => inFarmScope(f.id));
  const accessibleStores = STORES.filter((s) => inStoreScope(s.id));



  const hasAnyStoreScope = accessibleStores.length > 0;



  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Topbar />

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
