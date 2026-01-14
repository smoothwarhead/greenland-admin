import seed from "./data.json";

/**
 * Read-only helpers to slice seed data per route/context.
 * Think of this as your in-memory "database".
 */
export const SeedDB = {
  meta: seed.meta,
  org: seed.org,
  users: seed.users,
  catalog: seed.catalog,
  transfers: seed.seed.transfers,

  // ---- context payloads (overview)
  getFarmOverview(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);

    const orgFarm = seed.org.farms.find((f) => f.id === farmId);
    const capabilities = orgFarm?.capabilities || {};

    return {
      farmId,
      capabilities, 
      kpis: farm.kpis,
      overview: farm.overview,
    };
  },

  getStoreOverview(storeId) {
    const store = seed.seed.stores[storeId];
    if (!store) throw new Error(`Store not found: ${storeId}`);
    return { storeId, kpis: store.kpis, overview: store.overview };
  },

  // ---- module payloads (farm)
  getFarmLayers(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return {
      farmId,
      layers: farm.poultry?.layers || {
        flocks: [],
        dailyEggs: [],
        mortalityLog: [],
        eggGrading: [],
      },
    };
  },

  getFarmBroilers(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return {
      farmId,
      broilers: farm.poultry?.broilers || { batches: [], dispatches: [] },
    };
  },

  getFarmBreeders(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return {
      farmId,
      breeders: farm.poultry?.breeders || { flocks: [], eggCollection: [] },
    };
  },

  getFarmHatchery(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return {
      farmId,
      hatchery: farm.poultry?.hatchery || { incubations: [], hatches: [] },
    };
  },

  getFarmCrops(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return {
      farmId,
      crops: farm.crops || { blocks: [], fieldOps: [], harvests: [] },
    };
  },

  getFarmInventory(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return {
      farmId,
      inventory: farm.inventory || { items: [], receipts: [], issues: [] },
    };
  },

  getFarmFinance(farmId) {
    const farm = seed.seed.farms[farmId];
    if (!farm) throw new Error(`Farm not found: ${farmId}`);
    return { farmId, finance: farm.finance || { expenses: [] } };
  },

  // ---- module payloads (store)
  getStoreInventory(storeId) {
    const store = seed.seed.stores[storeId];
    if (!store) throw new Error(`Store not found: ${storeId}`);
    return {
      storeId,
      inventory: store.inventory || {
        items: [],
        receipts: [],
        adjustments: [],
      },
    };
  },

  getStorePOS(storeId) {
    const store = seed.seed.stores[storeId];
    if (!store) throw new Error(`Store not found: ${storeId}`);
    return {
      storeId,
      pos: store.pos || {
        shift: null,
        transactions: [],
        returns: [],
        cashbook: [],
      },
    };
  },

  getStoreTransfersIn(storeId) {
    const store = seed.seed.stores[storeId];
    if (!store) throw new Error(`Store not found: ${storeId}`);
    return { storeId, transfersIn: store.transfersIn || [] };
  },

  // ---- transfers detail
  getTransfer(transferNo) {
    const t = seed.seed.transfers[transferNo];
    if (!t) throw new Error(`Transfer not found: ${transferNo}`);
    return t;
  },
};
