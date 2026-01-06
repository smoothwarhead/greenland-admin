const FARM_KEY = "greenland_cache_farms_v1";
const STORE_KEY = "greenland_cache_stores_v1";

const farmCache = new Map();  // farmId -> { data, loadedAt }
const storeCache = new Map(); // storeId -> { data, loadedAt }

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function nowIso() { return new Date().toISOString(); }

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

function persistMaps() {
  const farmsObj = Object.fromEntries(farmCache.entries());
  const storesObj = Object.fromEntries(storeCache.entries());
  localStorage.setItem(FARM_KEY, JSON.stringify(farmsObj));
  localStorage.setItem(STORE_KEY, JSON.stringify(storesObj));
}

export function hydrateCachesFromStorage() {
  const farmsRaw = localStorage.getItem(FARM_KEY);
  const storesRaw = localStorage.getItem(STORE_KEY);
  const farmsObj = farmsRaw ? safeParse(farmsRaw) : null;
  const storesObj = storesRaw ? safeParse(storesRaw) : null;

  if (farmsObj && typeof farmsObj === "object") {
    Object.entries(farmsObj).forEach(([k, v]) => farmCache.set(k, v));
  }
  if (storesObj && typeof storesObj === "object") {
    Object.entries(storesObj).forEach(([k, v]) => storeCache.set(k, v));
  }
}

export function getFarmCacheEntry(farmId) { return farmCache.get(farmId) || null; }
export function getStoreCacheEntry(storeId) { return storeCache.get(storeId) || null; }

export function clearCaches() {
  farmCache.clear();
  storeCache.clear();
  localStorage.removeItem(FARM_KEY);
  localStorage.removeItem(STORE_KEY);
}

// ---- fake fetchers
async function fakeFetchFarm(farmId) {
  await sleep(650);
  if (Math.random() < 0.03) throw new Error("Network error loading farm data.");
  return {
    farmId,
    kpis: {
      lastSyncAt: nowIso(),
      poultry: { eggToday: Math.floor(500 + Math.random() * 1500) },
      crops: { activeCycles: Math.floor(2 + Math.random() * 6) }
    }
  };
}

async function fakeFetchStore(storeId) {
  await sleep(550);
  if (Math.random() < 0.03) throw new Error("Network error loading store data.");
  return {
    storeId,
    kpis: {
      lastSyncAt: nowIso(),
      pos: { salesToday: Math.floor(50 + Math.random() * 200) },
      inventory: { lowStock: Math.floor(Math.random() * 12) }
    }
  };
}

// ---- API-like loaders w/ cache + persistence
export async function loadFarmData(farmId, { force = false } = {}) {
  const cached = farmCache.get(farmId);
  if (cached && !force) return { fromCache: true, ...cached };

  const data = await fakeFetchFarm(farmId);
  const entry = { data, loadedAt: Date.now() };
  farmCache.set(farmId, entry);
  persistMaps();
  return { fromCache: false, ...entry };
}

export async function loadStoreData(storeId, { force = false } = {}) {
  const cached = storeCache.get(storeId);
  if (cached && !force) return { fromCache: true, ...cached };

  const data = await fakeFetchStore(storeId);
  const entry = { data, loadedAt: Date.now() };
  storeCache.set(storeId, entry);
  persistMaps();
  return { fromCache: false, ...entry };
}
