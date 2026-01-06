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

  const now = new Date();
  const base = farmId === "prime-estate" ? 1.0 : farmId === "golden-farm" ? 0.75 : 0.55;

  // --- KPI summary
  const layers = Math.round(20000 * base);
  const broilers = Math.round(10000 * base);
  const eggToday = Math.round(layers * 0.78);
  const mortality7d = +(0.9 * (1.2 - base)).toFixed(2);
  const feedTonsWeek = Math.round((layers * 0.115 + broilers * 0.11) / 1000 * 7);
  const waterM3Day = Math.round((layers * 0.23 + broilers * 0.20) / 1000);

  const revenueMTD = Math.round(42_000_000 * base);
  const cogsMTD = Math.round(26_500_000 * base);
  const opexMTD = Math.round(7_800_000 * base);
  const grossMargin = revenueMTD ? Math.round(((revenueMTD - cogsMTD) / revenueMTD) * 100) : 0;

  // --- Per-house performance (House 1–4)
  const houseBase =
    farmId === "prime-estate" ? { fe: 0.165, mort: 0.22, egg: 61.5 } :
    farmId === "golden-farm" ? { fe: 0.172, mort: 0.32, egg: 60.4 } :
    { fe: 0.178, mort: 0.45, egg: 59.8 };

  const rand = (k) => (Math.random() - 0.5) * k;
  const houses = [1, 2, 3, 4].map((n) => {
    const feedPerEgg = +(houseBase.fe + rand(0.012)).toFixed(3);
    const mort7d = +(houseBase.mort + rand(0.18)).toFixed(2);
    const eggSizeG = +(houseBase.egg + rand(1.6)).toFixed(1);
    const flockAgeWeeks = 32 + n * 3;

    return { houseNo: n, name: `House ${n}`, flockAgeWeeks, feedPerEgg, mort7d, eggSizeG };
  });

  // --- Crop blocks map
  const addDays = (d, days) => {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() + days);
    return x;
  };
  const fmtDate = (d) => d.toISOString(); // keep ISO in API; UI formats it

  const cropBlocks =
    farmId === "prime-estate"
      ? [
          { block: "A1", crop: "Yam", stage: "Vegetative", daysInStage: 74, harvestInDays: 120 },
          { block: "A2", crop: "Maize (intercrop)", stage: "Tasseling", daysInStage: 48, harvestInDays: 25 },
          { block: "B1", crop: "Plantain", stage: "Flowering", daysInStage: 140, harvestInDays: 40 },
          { block: "B2", crop: "Pepper", stage: "Harvesting", daysInStage: 65, harvestInDays: 0 },
          { block: "C1", crop: "Oil Palm", stage: "Maintenance", daysInStage: 540, harvestInDays: 80 },
          { block: "C2", crop: "Tomato (intercrop)", stage: "Fruit set", daysInStage: 52, harvestInDays: 18 }
        ]
      : farmId === "golden-farm"
        ? [
            { block: "A1", crop: "Yam", stage: "Mounding", daysInStage: 22, harvestInDays: 175 },
            { block: "A3", crop: "Soybean (rotation)", stage: "Flowering", daysInStage: 41, harvestInDays: 35 },
            { block: "B1", crop: "Plantain", stage: "Vegetative", daysInStage: 95, harvestInDays: 95 },
            { block: "B2", crop: "Pepper", stage: "Nursery", daysInStage: 12, harvestInDays: 85 },
            { block: "C1", crop: "Oil Palm", stage: "Maintenance", daysInStage: 430, harvestInDays: 120 }
          ]
        : [
            { block: "A2", crop: "Yam", stage: "Vegetative", daysInStage: 58, harvestInDays: 135 },
            { block: "B1", crop: "Plantain", stage: "Vegetative", daysInStage: 70, harvestInDays: 120 },
            { block: "B3", crop: "Pepper", stage: "Flowering", daysInStage: 44, harvestInDays: 25 },
            { block: "C1", crop: "Oil Palm", stage: "Maintenance", daysInStage: 360, harvestInDays: 160 }
          ];

  const cropBlocksWithDates = cropBlocks.map((b) => ({
    ...b,
    expectedHarvestAt: b.harvestInDays === 0 ? null : fmtDate(addDays(now, b.harvestInDays))
  }));

  // --- Transfer pipeline (Farm → Stores)
  const baseStores =
    farmId === "prime-estate"
      ? ["store-abeokuta", "store-odeda", "store-lagos"]
      : farmId === "golden-farm"
        ? ["store-abeokuta", "store-odeda"]
        : ["store-odeda"];

  const transferItems = [
    { sku: "EGG-CRATE-30", name: "Eggs (crate)", uom: "crates", qty: farmId === "prime-estate" ? 120 : 70 },
    { sku: "BRL-WHOLE-1", name: "Broiler (whole)", uom: "birds", qty: farmId === "prime-estate" ? 45 : 25 },
    { sku: "PEP-KG", name: "Pepper", uom: "kg", qty: farmId === "prime-estate" ? 120 : 60 },
    { sku: "PLT-BUNCH", name: "Plantain", uom: "bunches", qty: farmId === "prime-estate" ? 35 : 20 }
  ];

  const transfers = baseStores.slice(0, 3).map((storeId, i) => {
    const createdAt = new Date(now.getTime());
    createdAt.setHours(now.getHours() - (6 + i * 5)); // 6h, 11h, 16h ago
    const slaHours = 18;
    const ageHrs = Math.max(1, Math.round((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)));
    const status = ageHrs > slaHours ? "breach" : ageHrs > Math.round(slaHours * 0.75) ? "risk" : "ontime";

    const lines = transferItems.slice(0, 2 + (i % 2)).map((it, idx) => ({
      ...it,
      qty: Math.max(8, Math.round(it.qty * (0.55 + 0.15 * idx + 0.08 * i)))
    }));

    return {
      transferNo: `TRF-${farmId.toUpperCase().slice(0, 3)}-${String(104 + i).padStart(3, "0")}`,
      toStoreId: storeId,
      createdAt: createdAt.toISOString(),
      ageHrs,
      slaHours,
      status,
      lines
    };
  });

  // --- Compliance widgets
  const complianceBase =
    farmId === "prime-estate" ? { bio: 92, visitors: 3, vaxDue: 2 } :
    farmId === "golden-farm" ? { bio: 85, visitors: 3, vaxDue: 3 } :
    { bio: 78, visitors: 2, vaxDue: 4 };

  const visitorLog = [
    { time: "08:25", name: "Feed supplier", purpose: "Delivery", status: "Checked-in" },
    { time: "11:10", name: "Veterinary officer", purpose: "Routine check", status: "Cleared" },
    { time: "14:40", name: "Maintenance team", purpose: "Generator service", status: "Cleared" }
  ].slice(0, complianceBase.visitors);

  const vaccinationsDue = [
    { unit: "Layers House 2", item: "ND/IB booster", dueInDays: 2 },
    { unit: "Brooder Unit", item: "Gumboro", dueInDays: 5 },
    { unit: "Layers House 4", item: "Fowl pox", dueInDays: 7 },
    { unit: "Breeders Unit", item: "ND LaSota", dueInDays: 3 }
  ].slice(0, complianceBase.vaxDue);

  return {
    farmId,
    kpis: {
      lastSyncAt: now.toISOString(),
      layers,
      broilers,
      eggToday,
      layRate: 78,
      mortality7d,
      feedTonsWeek,
      waterM3Day,
      finance: { revenueMTD, cogsMTD, opexMTD, grossMargin }
    },
    overview: {
      houses,
      crops: cropBlocksWithDates,
      transfers,
      compliance: {
        biosecurityCompletion: complianceBase.bio,
        visitorLog,
        vaccinationsDue
      }
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
