import { SeedDB } from "../data/seedDb";


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cacheKey(kind, id) {
  return `cache:${kind}:${id}`;
}
function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeCache(key, payload) {
  localStorage.setItem(key, JSON.stringify(payload));
}

function withCache(key, data, ttlSeconds = 900) {
  const wrapped = { savedAt: new Date().toISOString(), ttlSeconds, data };
  writeCache(key, wrapped);
  return wrapped;
}

function isFresh(cached) {
  if (!cached?.savedAt || !cached?.ttlSeconds) return false;
  const ageMs = Date.now() - new Date(cached.savedAt).getTime();
  return ageMs < cached.ttlSeconds * 1000;
}

// -------- Public (no auth): org + users for login demo
export async function loadOrg() {
  await sleep(250);
  return { data: { org: SeedDB.org, users: SeedDB.users } };
}

// -------- Farm loaders
export async function loadFarmOverview(farmId, { preferCache = true } = {}) {
  const key = cacheKey("farmOverview", farmId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) {
    return { data: cached.data, fromCache: true };
  }

  await sleep(500);
  const data = SeedDB.getFarmOverview(farmId);
  // console.log(data)
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadFarmLayers(farmId, { preferCache = true } = {}) {
  const key = cacheKey("farmLayers", farmId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getFarmLayers(farmId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadFarmCrops(farmId, { preferCache = true } = {}) {
  const key = cacheKey("farmCrops", farmId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getFarmCrops(farmId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadFarmInventory(farmId, { preferCache = true } = {}) {
  const key = cacheKey("farmInventory", farmId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getFarmInventory(farmId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadFarmFinance(farmId, { preferCache = true } = {}) {
  const key = cacheKey("farmFinance", farmId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getFarmFinance(farmId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

// Hatchery is Prime Estate only (enforced in routes too)
export async function loadFarmHatchery(farmId, { preferCache = true } = {}) {
  const key = cacheKey("farmHatchery", farmId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getFarmHatchery(farmId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

// -------- Store loaders
export async function loadStoreOverview(storeId, { preferCache = true } = {}) {
  const key = cacheKey("storeOverview", storeId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(500);

  const data = SeedDB.getStoreOverview(storeId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadStorePOS(storeId, { preferCache = true } = {}) {
  const key = cacheKey("storePOS", storeId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getStorePOS(storeId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadStoreInventory(storeId, { preferCache = true } = {}) {
  const key = cacheKey("storeInventory", storeId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getStoreInventory(storeId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}

export async function loadStoreTransfersIn(storeId, { preferCache = true } = {}) {
  const key = cacheKey("storeTransfersIn", storeId);
  const cached = readCache(key);

  if (preferCache && isFresh(cached)) return { data: cached.data, fromCache: true };
  await sleep(450);

  const data = SeedDB.getStoreTransfersIn(storeId);
  withCache(key, data, 900);
  return { data, fromCache: false };
}
