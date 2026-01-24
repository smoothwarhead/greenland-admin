import React from "react";
import { ROUTES } from "./routeRegistry";


const makeLazy = (loader) => React.lazy(loader);

// ✅ Real overview pages
const FarmOverview = makeLazy(() => import("../pages/farms/FarmOverviewPage.jsx"));
const StoreOverview = makeLazy(() => import("../pages/stores/StoreOverviewPage.jsx"));
const LayersFlockPage = makeLazy(() => import("../pages/poultry/LayersFlockPage.jsx"));
const InventoryItemsPage = makeLazy(() => import("../pages/inventory/InventoryItemsPage.jsx"));
const CommissionOverviewPage = makeLazy(() => import("../pages/commission/overview/CommissionOverview.jsx"));
const Payouts = makeLazy(() => import("../pages/commission/payouts/Payouts.jsx"));
const Agents = makeLazy(() => import("../pages/commission/agents/Agents.jsx"));

  // COMMISSION_OVERVIEW: React.lazy(() => import("./pages/commission/CommissionOverview")),
  // COMMISSION_AGENTS: React.lazy(() => import("./pages/commission/AgentsList")),
  // COMMISSION_AGENTS_CREATE: React.lazy(() => import("./pages/commission/AgentCreate")),
  // COMMISSION_AGENTS_EDIT: React.lazy(() => import("./pages/commission/AgentEdit")),

  // COMMISSION_CATALOG_MAP: React.lazy(() => import("./pages/commission/CatalogMapping")),

  // COMMISSION_RULES: React.lazy(() => import("./pages/commission/RulesList")),
  // COMMISSION_RULES_CREATE: React.lazy(() => import("./pages/commission/RuleCreate")),
  // COMMISSION_RULES_EDIT: React.lazy(() => import("./pages/commission/RuleEdit")),

  // COMMISSION_ORDERS: React.lazy(() => import("./pages/commission/OrdersClaims")),
  // COMMISSION_RECONCILE: React.lazy(() => import("./pages/commission/Reconcile")),
  // COMMISSION_APPROVALS: React.lazy(() => import("./pages/commission/Approvals")),

  // COMMISSION_PAYOUTS: React.lazy(() => import("./pages/commission/Payouts")),
  // COMMISSION_PAYOUTS_RUN: React.lazy(() => import("./pages/commission/RunPayout")),

  // COMMISSION_DISPUTES: React.lazy(() => import("./pages/commission/Disputes")),
  // COMMISSION_REPORTS: React.lazy(() => import("./pages/commission/Reports")),
  // COMMISSION_SETTINGS: React.lazy(() => import("./pages/commission/Settings")),


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
    if (r.key === "LAYERS_FLOCKS") return [r.key, LayersFlockPage];
    if (r.key === "FARM_INV_ITEMS") return [r.key, InventoryItemsPage];
    if (r.key === "COMMISSION_OVERVIEW") return [r.key, CommissionOverviewPage];
    if (r.key === "COMMISSION_AGENTS") return [r.key, Agents];
    if (r.key === "COMMISSION_PAYOUTS") return [r.key, Payouts];


    const Comp = () => <Stub title={r.label} />;
    return [r.key, React.lazy(() => Promise.resolve({ default: Comp }))];
  })
);
