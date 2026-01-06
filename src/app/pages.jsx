import React from "react";
import { ROUTES } from "./routeRegistry";


const makeLazy = (loader) => React.lazy(loader);

// ✅ Real overview pages
const FarmOverview = makeLazy(() => import("../pages/farms/FarmOverviewPage.jsx"));
const StoreOverview = makeLazy(() => import("../pages/stores/StoreOverviewPage.jsx"));

// fallback stub for all other pages (keep your current stub)
function Stub({ title }) {
  return (
    <div className="page">
      <div className="pageTitle">{title}</div>
      <div className="proCard"><div className="muted">This is a placeholder page.</div></div>
    </div>
  );
}

export const PAGE_COMPONENTS = Object.fromEntries(
  Object.values(ROUTES).map((r) => {
    if (r.key === "FARM_OVERVIEW") return [r.key, FarmOverview];
    if (r.key === "STORE_OVERVIEW") return [r.key, StoreOverview];

    const Comp = () => <Stub title={r.label} />;
    return [r.key, React.lazy(() => Promise.resolve({ default: Comp }))];
  })
);
