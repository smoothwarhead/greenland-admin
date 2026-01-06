import { matchPath } from "react-router-dom";
import { ROUTES, buildTo } from "./routeRegistry";
import { FARMS, STORES } from "./orgMap";

function getFarmName(farmId) {
  return FARMS.find((f) => f.id === farmId)?.name || farmId;
}
function getStoreName(storeId) {
  return STORES.find((s) => s.id === storeId)?.name || storeId;
}

/**
 * Find the current routeKey by matching pathname against ROUTES paths.
 */
export function findRouteByPathname(pathname) {
  for (const r of Object.values(ROUTES)) {
    const m = matchPath({ path: r.path, end: true }, pathname);
    if (m) return { route: r, params: m.params };
  }
  return null;
}

/**
 * Breadcrumbs:
 * - Dashboard
 * - Farms/Stores scope node
 * - Module group (Poultry/Crops/Store/POS etc) inferred from path
 * - Current page label
 */
export function getBreadcrumbs({ pathname, activeFarmId, activeStoreId }) {
  const found = findRouteByPathname(pathname);
  const crumbs = [
    { label: "Dashboard", to: ROUTES.APP_HOME.path }
  ];

  if (!found) return crumbs;

  const { route, params } = found;

  if (route.scope === "farm") {
    const farmId = params.farmId || activeFarmId;
    crumbs.push({ label: "Farms", to: farmId ? buildTo("FARM_OVERVIEW", { farmId }) : "/app" });
    if (farmId) crumbs.push({ label: getFarmName(farmId), to: buildTo("FARM_OVERVIEW", { farmId }) });

    // Module inference
    if (route.path.includes("/poultry/")) crumbs.push({ label: "Poultry", to: buildTo("FARM_POULTRY_HOME", { farmId }) });
    if (route.path.includes("/crops/")) crumbs.push({ label: "Crops", to: buildTo("FARM_CROPS_HOME", { farmId }) });
    if (route.path.includes("/irrigation")) crumbs.push({ label: "Irrigation", to: buildTo("IRRIGATION_HOME", { farmId }) });
    if (route.path.includes("/inventory/")) crumbs.push({ label: "Inventory", to: buildTo("FARM_INV_ITEMS", { farmId }) });
    if (route.path.includes("/finance/")) crumbs.push({ label: "Finance", to: buildTo("FARM_FIN_EXPENSES", { farmId }) });
  }

  if (route.scope === "store") {
    const storeId = params.storeId || activeStoreId;
    crumbs.push({ label: "Stores", to: storeId ? buildTo("STORE_OVERVIEW", { storeId }) : "/app" });
    if (storeId) crumbs.push({ label: getStoreName(storeId), to: buildTo("STORE_OVERVIEW", { storeId }) });

    if (route.path.includes("/pos/")) crumbs.push({ label: "POS", to: buildTo("POS_SELL", { storeId }) });
    if (route.path.includes("/inventory/")) crumbs.push({ label: "Inventory", to: buildTo("STORE_INV_RECEIVE", { storeId }) });
    if (route.path.includes("/transfers/")) crumbs.push({ label: "Transfers", to: buildTo("STORE_TRANSFERS_CREATE", { storeId }) });
    if (route.path.includes("/returns/")) crumbs.push({ label: "Returns", to: buildTo("STORE_RETURNS_CREATE", { storeId }) });
    if (route.path.includes("/catalog/")) crumbs.push({ label: "Catalog", to: buildTo("STORE_PRODUCTS", { storeId }) });
    if (route.path.includes("/customers/")) crumbs.push({ label: "Customers", to: buildTo("STORE_CUSTOMERS", { storeId }) });
    if (route.path.includes("/finance/")) crumbs.push({ label: "Finance", to: buildTo("STORE_FIN_CASHBOOK", { storeId }) });
  }

  // Final page
  crumbs.push({ label: route.label, to: route.scope === "farm"
      ? buildTo(route.key, { farmId: params.farmId })
      : route.scope === "store"
        ? buildTo(route.key, { storeId: params.storeId })
        : route.path
  });

  // De-dup consecutive same labels (optional safety)
  return crumbs.filter((c, i) => i === 0 || c.label !== crumbs[i - 1].label);
}

/**
 * Page title string.
 */
export function getPageTitle({ pathname, activeFarmId, activeStoreId }) {
  const found = findRouteByPathname(pathname);
  if (!found) return "Greenland Admin";
  const { route, params } = found;
  if (route.scope === "farm") return `${route.label} • ${getFarmName(params.farmId || activeFarmId)} • Greenland Admin`;
  if (route.scope === "store") return `${route.label} • ${getStoreName(params.storeId || activeStoreId)} • Greenland Admin`;
  return `${route.label} • Greenland Admin`;
}
