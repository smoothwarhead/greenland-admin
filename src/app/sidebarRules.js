import { FARMS, STORES } from "./orgMap";
import { ROUTES, SIDEBAR, buildTo, passesRouteConstraints } from "./routeRegistry";
import { PERM } from "./perms";



const STORES_ANY = (inStoreScope) => STORES.some((s) => inStoreScope(s.id));
const FARMS_ANY = (inFarmScope) => FARMS.some((f) => inFarmScope(f.id));

function getFarmById(farmId) {
  return FARMS.find((f) => f.id === farmId) || null;
}

function featureAllows(routeKey, { activeFarmId } = {}) {
  const farm = getFarmById(activeFarmId);
  const path = ROUTES[routeKey]?.path || "";
  if (!farm) return true;

  if (path.includes("/poultry/hatchery")) return !!farm.features.hatchery;
  if (path.includes("/poultry/feed-mill")) return !!farm.features.feedMill;
  if (path.includes("/poultry/egg-room")) return !!farm.features.eggRoom;
  if (path.includes("/poultry/processing")) return !!farm.features.processing;
  if (path.includes("/irrigation")) return !!farm.features.irrigation;
  return true;
}

export function buildSidebarTreeExact({
  can,
  inFarmScope,
  inStoreScope,
  activeFarmId,
  activeStoreId
}) {


  const ctx = { activeFarmId, activeStoreId };
  const isAdmin = can(PERM.ADMIN_ALL);

  function permOk(routeKey) {
    const r = ROUTES[routeKey];
    if (!r) return false;
    if (!r.perm) return true;
    return isAdmin || can(r.perm);
  }

  function scopeOk(routeKey) {
    const r = ROUTES[routeKey];
    if (!r) return false;

    if (r.scope === "farm") {
      if (!activeFarmId) return false;
      if (!isAdmin && !inFarmScope(activeFarmId)) return false;
      return passesRouteConstraints(routeKey, { farmId: activeFarmId });
    }

    if (r.scope === "store") {
      if (!activeStoreId) return false;
      if (!isAdmin && !inStoreScope(activeStoreId)) return false;
      return passesRouteConstraints(routeKey, { storeId: activeStoreId });
    }

    return passesRouteConstraints(routeKey, {});
  }

  function toFor(routeKey) {
    const r = ROUTES[routeKey];
    if (!r) return "#";
    if (r.scope === "farm") return buildTo(routeKey, { farmId: activeFarmId });
    if (r.scope === "store") return buildTo(routeKey, { storeId: activeStoreId });
    return buildTo(routeKey, {});
  }

  function nodeVisible(node) {
    if (typeof node.when === "function" && !node.when(ctx)) return false;

    if (node.routeKey) {
      if (!permOk(node.routeKey)) return false;
      if (!scopeOk(node.routeKey)) return false;
      if (!featureAllows(node.routeKey, { activeFarmId })) return false;
      return true;
    }

    const children = node.children || [];
    return children.some((c) => nodeVisible(c));
  }

  function mapNode(node) {
    if (!nodeVisible(node)) return null;

    if (node.routeKey) {
      const r = ROUTES[node.routeKey];
      return {
        type: "route",
        routeKey: node.routeKey,
        label: r?.label || node.label || node.routeKey,
        to: toFor(node.routeKey)
      };
    }

    const kids = (node.children || []).map(mapNode).filter(Boolean);
    if (kids.length === 0) return null;

    return { type: "section", label: node.label, children: kids };
  }

  return SIDEBAR.map((group) => {
   const hasAnyStoreScope = isAdmin || (typeof inStoreScope === "function" && STORES_ANY(inStoreScope));
    const hasAnyFarmScope = isAdmin || (typeof inFarmScope === "function" && FARMS_ANY(inFarmScope));

  if (group.group === "Farms" && !activeFarmId) return null;

  // ✅ NEW: Stores group only exists for store staff (has at least 1 store in scope)
  if (group.group === "Stores" && !hasAnyStoreScope) return null;

  // Optional: also hide store groups if no activeStoreId selected
  if (group.group === "Stores" && !activeStoreId) return null;

    const items = (group.items || []).map(mapNode).filter(Boolean);
    if (items.length === 0) return null;

    return { group: group.group, items };
  }).filter(Boolean);


  
}
