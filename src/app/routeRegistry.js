import { PERM } from "./perms";

export const ROUTES = {
  // APP_HOME: {
  //   key: "APP_HOME",
  //   path: "/app",
  //   label: "Dashboard",
  //   scope: "none",
  //   perm: PERM.DASHBOARD_VIEW,
  // },
  NOT_AUTHORIZED: {
    key: "NOT_AUTHORIZED",
    path: "/not-authorized",
    label: "Not Authorized",
    scope: "none",
    perm: null,
  },

  // Farms
  FARM_OVERVIEW: {
    key: "FARM_OVERVIEW",
    path: "/app/farms/:farmId/overview",
    label: "Farm Overview",
    scope: "farm",
    perm: PERM.FARM_VIEW,
  },

  FARM_POULTRY_HOME: {
    key: "FARM_POULTRY_HOME",
    path: "/app/farms/:farmId/poultry",
    label: "Poultry",
    scope: "farm",
    perm: PERM.POULTRY_VIEW,
  },

  // Layers
  LAYERS_FLOCKS: {
    key: "LAYERS_FLOCKS",
    path: "/app/farms/:farmId/poultry/layers/flocks",
    label: "Flocks",
    scope: "farm",
    perm: PERM.LAYERS_VIEW,
  },
  LAYERS_DAILY_PRODUCTION: {
    key: "LAYERS_DAILY_PRODUCTION",
    path: "/app/farms/:farmId/poultry/layers/daily-production",
    label: "Daily Production",
    scope: "farm",
    perm: PERM.LAYERS_RECORD_PRODUCTION,
  },
  LAYERS_MORTALITY: {
    key: "LAYERS_MORTALITY",
    path: "/app/farms/:farmId/poultry/layers/mortality",
    label: "Mortality",
    scope: "farm",
    perm: PERM.LAYERS_RECORD_PRODUCTION,
  },
  LAYERS_FEED_USAGE: {
    key: "LAYERS_FEED_USAGE",
    path: "/app/farms/:farmId/poultry/layers/feed-usage",
    label: "Feed Usage",
    scope: "farm",
    perm: PERM.FEED_ISSUE,
  },
  LAYERS_HEALTH: {
    key: "LAYERS_HEALTH",
    path: "/app/farms/:farmId/poultry/layers/vaccination-health",
    label: "Vaccination & Health",
    scope: "farm",
    perm: PERM.HEALTH_RECORD,
  },
  LAYERS_CULLS_DISPOSAL: {
    key: "LAYERS_CULLS_DISPOSAL",
    path: "/app/farms/:farmId/poultry/layers/culls-disposal",
    label: "Culls & Disposal",
    scope: "farm",
    perm: PERM.LAYERS_RECORD_PRODUCTION,
  },

  // Broilers
  BROILERS_BATCHES: {
    key: "BROILERS_BATCHES",
    path: "/app/farms/:farmId/poultry/broilers/batches",
    label: "Batches",
    scope: "farm",
    perm: PERM.BROILERS_VIEW,
    constraints: { allowedFarmIds: ["prime-estate"] },
  },
  BROILERS_DAILY_PRODUCTION: {
    key: "BROILERS_DAILY_PRODUCTION",
    path: "/app/farms/:farmId/poultry/broilers/daily-production",
    label: "Daily Production",
    scope: "farm",
    perm: PERM.BROILERS_RECORD_PRODUCTION,
  },
  BROILERS_MORTALITY: {
    key: "BROILERS_MORTALITY",
    path: "/app/farms/:farmId/poultry/broilers/mortality",
    label: "Mortality",
    scope: "farm",
    perm: PERM.BROILERS_RECORD_PRODUCTION,
  },
  BROILERS_FEED_USAGE: {
    key: "BROILERS_FEED_USAGE",
    path: "/app/farms/:farmId/poultry/broilers/feed-usage",
    label: "Feed Usage",
    scope: "farm",
    perm: PERM.FEED_ISSUE,
  },
  BROILERS_HEALTH: {
    key: "BROILERS_HEALTH",
    path: "/app/farms/:farmId/poultry/broilers/vaccination-health",
    label: "Vaccination & Health",
    scope: "farm",
    perm: PERM.HEALTH_RECORD,
  },

  // Breeders

  BREEDERS_HOME: {
    key: "BREEDERS_HOME",
    path: "/app/farms/:farmId/poultry/breeders",
    perm: PERM.BREEDERS_VIEW,
    scope: "farm",
    constraints: { allowedFarmIds: ["prime-estate"] },
  },

  BREEDERS_FLOCKS: {
    key: "BREEDERS_FLOCKS",
    path: "/app/farms/:farmId/poultry/breeders/flocks",
    label: "Flocks",
    scope: "farm",
    perm: PERM.BREEDERS_VIEW,
  },
  BREEDERS_EGG_COLLECTION: {
    key: "BREEDERS_EGG_COLLECTION",
    path: "/app/farms/:farmId/poultry/breeders/egg-collection",
    label: "Egg Collection",
    scope: "farm",
    perm: PERM.BREEDERS_RECORD,
  },
  BREEDERS_FERTILITY: {
    key: "BREEDERS_FERTILITY",
    path: "/app/farms/:farmId/poultry/breeders/fertility-hatchability",
    label: "Fertility & Hatchability",
    scope: "farm",
    perm: PERM.BREEDERS_RECORD,
  },

  // Hatchery (Prime Estate only)
  HATCHERY_HOME: {
    key: "HATCHERY_HOME",
    path: "/app/farms/:farmId/poultry/hatchery",
    perms: PERM.HATCHERY_VIEW,
    scope: "farm",
    constraints: { allowedFarmIds: ["prime-estate"] },
  },
  HATCHERY_EQUIPMENT: {
    key: "HATCHERY_EQUIPMENT",
    path: "/app/farms/:farmId/poultry/hatchery/setters-incubators",
    label: "Setters & Incubators",
    scope: "farm",
    perm: PERM.HATCHERY_VIEW,
    constraints: { allowedFarmIds: ["prime-estate"] },
  },
  HATCHERY_SETTING_CANDLING: {
    key: "HATCHERY_SETTING_CANDLING",
    path: "/app/farms/:farmId/poultry/hatchery/setting-candling",
    label: "Setting & Candling",
    scope: "farm",
    perm: PERM.HATCHERY_RECORD,
    constraints: { allowedFarmIds: ["prime-estate"] },
  },
  HATCHERY_HATCH_RESULTS: {
    key: "HATCHERY_HATCH_RESULTS",
    path: "/app/farms/:farmId/poultry/hatchery/hatch-results",
    label: "Hatch Results",
    scope: "farm",
    perm: PERM.HATCHERY_RECORD,
    constraints: { allowedFarmIds: ["prime-estate"] },
  },
  HATCHERY_CHICK_DISPATCH: {
    key: "HATCHERY_CHICK_DISPATCH",
    path: "/app/farms/:farmId/poultry/hatchery/chick-grading-dispatch",
    label: "Chick Grading & Dispatch",
    scope: "farm",
    perm: PERM.HATCHERY_RECORD,
    constraints: { allowedFarmIds: ["prime-estate"] },
  },

  // Feed mill
  FEED_FORMULAS: {
    key: "FEED_FORMULAS",
    path: "/app/farms/:farmId/poultry/feed-mill/formulas",
    label: "Formulas",
    scope: "farm",
    perm: PERM.FEED_MANAGE,
  },
  FEED_PRODUCTION_BATCHES: {
    key: "FEED_PRODUCTION_BATCHES",
    path: "/app/farms/:farmId/poultry/feed-mill/production-batches",
    label: "Production Batches",
    scope: "farm",
    perm: PERM.FEED_PRODUCE,
  },
  FEED_RAW_MATERIALS: {
    key: "FEED_RAW_MATERIALS",
    path: "/app/farms/:farmId/poultry/feed-mill/raw-materials",
    label: "Raw Materials",
    scope: "farm",
    perm: PERM.FEED_VIEW,
  },
  FEED_ISSUES_TO_HOUSES: {
    key: "FEED_ISSUES_TO_HOUSES",
    path: "/app/farms/:farmId/poultry/feed-mill/issues-to-houses",
    label: "Issues to Houses",
    scope: "farm",
    perm: PERM.FEED_ISSUE,
  },

  // Egg room
  EGGROOM_COLLECTION: {
    key: "EGGROOM_COLLECTION",
    path: "/app/farms/:farmId/poultry/egg-room/collection",
    label: "Collection",
    scope: "farm",
    perm: PERM.EGGROOM_RECORD,
  },
  EGGROOM_GRADING_PACKING: {
    key: "EGGROOM_GRADING_PACKING",
    path: "/app/farms/:farmId/poultry/egg-room/grading-packing",
    label: "Grading & Packing",
    scope: "farm",
    perm: PERM.EGGROOM_RECORD,
  },
  EGGROOM_LOSSES: {
    key: "EGGROOM_LOSSES",
    path: "/app/farms/:farmId/poultry/egg-room/losses-breakages",
    label: "Losses & Breakages",
    scope: "farm",
    perm: PERM.EGGROOM_RECORD,
  },

  // Processing
  PROCESSING_MEAT: {
    key: "PROCESSING_MEAT",
    path: "/app/farms/:farmId/poultry/processing/meat-processing",
    label: "Meat Processing",
    scope: "farm",
    perm: PERM.PROCESSING_RECORD,
  },
  PROCESSING_MANURE: {
    key: "PROCESSING_MANURE",
    path: "/app/farms/:farmId/poultry/processing/manure-fertilizer",
    label: "Manure/Fertilizer",
    scope: "farm",
    perm: PERM.PROCESSING_RECORD,
  },

  // Biosecurity
  BIO_VISITORS: {
    key: "BIO_VISITORS",
    path: "/app/farms/:farmId/poultry/biosecurity/visitors-log",
    label: "Visitors Log",
    scope: "farm",
    perm: PERM.BIOSECURITY_RECORD,
  },
  BIO_VEHICLES: {
    key: "BIO_VEHICLES",
    path: "/app/farms/:farmId/poultry/biosecurity/vehicle-disinfection",
    label: "Vehicle Disinfection",
    scope: "farm",
    perm: PERM.BIOSECURITY_RECORD,
  },

  // Crops
  FARM_CROPS_HOME: {
    key: "FARM_CROPS_HOME",
    path: "/app/farms/:farmId/crops",
    label: "Crops",
    scope: "farm",
    perm: PERM.CROPS_VIEW,
  },

  // Yam
  YAM_CYCLES: {
    key: "YAM_CYCLES",
    path: "/app/farms/:farmId/crops/yam/cycles",
    label: "Cycles",
    scope: "farm",
    perm: PERM.YAM_VIEW,
  },
  YAM_PLANTING: {
    key: "YAM_PLANTING",
    path: "/app/farms/:farmId/crops/yam/planting",
    label: "Planting",
    scope: "farm",
    perm: PERM.YAM_RECORD,
  },
  YAM_FIELD_OPS: {
    key: "YAM_FIELD_OPS",
    path: "/app/farms/:farmId/crops/yam/field-operations",
    label: "Field Operations",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },
  YAM_HARVEST: {
    key: "YAM_HARVEST",
    path: "/app/farms/:farmId/crops/yam/harvest",
    label: "Harvest",
    scope: "farm",
    perm: PERM.YAM_RECORD,
  },
  YAM_STORAGE_ISSUES: {
    key: "YAM_STORAGE_ISSUES",
    path: "/app/farms/:farmId/crops/yam/storage-issues",
    label: "Storage Issues",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },

  // Plantain
  PLANTAIN_BLOCKS: {
    key: "PLANTAIN_BLOCKS",
    path: "/app/farms/:farmId/crops/plantain/blocks",
    label: "Blocks",
    scope: "farm",
    perm: PERM.PLANTAIN_VIEW,
  },
  PLANTAIN_SUCKERS: {
    key: "PLANTAIN_SUCKERS",
    path: "/app/farms/:farmId/crops/plantain/suckers-pruning-log",
    label: "Suckers/Pruning Log",
    scope: "farm",
    perm: PERM.PLANTAIN_RECORD,
  },
  PLANTAIN_HARVEST: {
    key: "PLANTAIN_HARVEST",
    path: "/app/farms/:farmId/crops/plantain/harvest-log",
    label: "Harvest Log",
    scope: "farm",
    perm: PERM.PLANTAIN_RECORD,
  },
  PLANTAIN_PEPPER_INTERCROP: {
    key: "PLANTAIN_PEPPER_INTERCROP",
    path: "/app/farms/:farmId/crops/plantain/pepper-intercrop",
    label: "Pepper Intercrop",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },

  // Oil palm
  OILPALM_BLOCKS: {
    key: "OILPALM_BLOCKS",
    path: "/app/farms/:farmId/crops/oil-palm/blocks",
    label: "Blocks",
    scope: "farm",
    perm: PERM.OILPALM_VIEW,
  },
  OILPALM_INTERCROP_TOMATO: {
    key: "OILPALM_INTERCROP_TOMATO",
    path: "/app/farms/:farmId/crops/oil-palm/intercrop-tomato-cycles",
    label: "Intercrop Tomato Cycles",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },
  OILPALM_HARVEST_BUNCHES: {
    key: "OILPALM_HARVEST_BUNCHES",
    path: "/app/farms/:farmId/crops/oil-palm/harvest-bunches",
    label: "Harvest Bunches",
    scope: "farm",
    perm: PERM.OILPALM_RECORD,
  },
  OILPALM_NURSERY: {
    key: "OILPALM_NURSERY",
    path: "/app/farms/:farmId/crops/oil-palm/nursery",
    label: "Nursery",
    scope: "farm",
    perm: PERM.OILPALM_RECORD,
  },

  // Blocks & field ops
  BLOCKS_HOME: {
    key: "BLOCKS_HOME",
    path: "/app/farms/:farmId/crops/blocks",
    label: "Blocks",
    scope: "farm",
    perm: PERM.BLOCKS_VIEW,
  },
  FIELDOPS_HOME: {
    key: "FIELDOPS_HOME",
    path: "/app/farms/:farmId/crops/field-ops",
    label: "Field Operations",
    scope: "farm",
    perm: PERM.FIELDOPS_VIEW,
  },
  FIELDOPS_SPRAYING: {
    key: "FIELDOPS_SPRAYING",
    path: "/app/farms/:farmId/crops/field-ops/spraying",
    label: "Spraying",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },
  FIELDOPS_FERTIGATION: {
    key: "FIELDOPS_FERTIGATION",
    path: "/app/farms/:farmId/crops/field-ops/fertilizer-fertigation",
    label: "Fertilizer/Fertigation",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },
  FIELDOPS_LABOR: {
    key: "FIELDOPS_LABOR",
    path: "/app/farms/:farmId/crops/field-ops/labor-timesheets",
    label: "Labor Timesheets",
    scope: "farm",
    perm: PERM.FIELDOPS_RECORD,
  },

  // Irrigation
  IRRIGATION_HOME: {
    key: "IRRIGATION_HOME",
    path: "/app/farms/:farmId/irrigation",
    label: "Irrigation",
    scope: "farm",
    perm: PERM.IRRIGATION_VIEW,
  },
  IRRIGATION_ASSETS: {
    key: "IRRIGATION_ASSETS",
    path: "/app/farms/:farmId/irrigation/assets-boreholes",
    label: "Assets & Boreholes",
    scope: "farm",
    perm: PERM.IRRIGATION_MANAGE,
  },
  IRRIGATION_SCHEDULES: {
    key: "IRRIGATION_SCHEDULES",
    path: "/app/farms/:farmId/irrigation/zones-schedules",
    label: "Zones & Schedules",
    scope: "farm",
    perm: PERM.IRRIGATION_MANAGE,
  },
  IRRIGATION_RUNLOGS: {
    key: "IRRIGATION_RUNLOGS",
    path: "/app/farms/:farmId/irrigation/run-logs",
    label: "Run Logs",
    scope: "farm",
    perm: PERM.IRRIGATION_RUN_LOG,
  },
  IRRIGATION_MAINTENANCE: {
    key: "IRRIGATION_MAINTENANCE",
    path: "/app/farms/:farmId/irrigation/maintenance",
    label: "Maintenance",
    scope: "farm",
    perm: PERM.IRRIGATION_MANAGE,
  },

  // Farm inventory
  FARM_INV_ITEMS: {
    key: "FARM_INV_ITEMS",
    path: "/app/farms/:farmId/inventory/items",
    label: "Items",
    scope: "farm",
    perm: PERM.FARM_INV_VIEW,
  },
  FARM_INV_RECEIPTS: {
    key: "FARM_INV_RECEIPTS",
    path: "/app/farms/:farmId/inventory/receipts",
    label: "Receipts",
    scope: "farm",
    perm: PERM.FARM_INV_MANAGE,
  },
  FARM_INV_ISSUES: {
    key: "FARM_INV_ISSUES",
    path: "/app/farms/:farmId/inventory/issues",
    label: "Issues",
    scope: "farm",
    perm: PERM.FARM_INV_MANAGE,
  },
  FARM_INV_COUNTS: {
    key: "FARM_INV_COUNTS",
    path: "/app/farms/:farmId/inventory/stock-counts",
    label: "Stock Counts",
    scope: "farm",
    perm: PERM.FARM_INV_MANAGE,
  },

  // Farm finance
  FARM_FIN_EXPENSES: {
    key: "FARM_FIN_EXPENSES",
    path: "/app/farms/:farmId/finance/expenses",
    label: "Expenses",
    scope: "farm",
    perm: PERM.FIN_POST,
  },
  FARM_FIN_PAYABLES: {
    key: "FARM_FIN_PAYABLES",
    path: "/app/farms/:farmId/finance/payables",
    label: "Payables",
    scope: "farm",
    perm: PERM.FIN_POST,
  },
  FARM_FIN_RECEIVABLES: {
    key: "FARM_FIN_RECEIVABLES",
    path: "/app/farms/:farmId/finance/receivables",
    label: "Receivables",
    scope: "farm",
    perm: PERM.FIN_POST,
  },
  FARM_FIN_CASHBOOK: {
    key: "FARM_FIN_CASHBOOK",
    path: "/app/farms/:farmId/finance/cashbook",
    label: "Cashbook",
    scope: "farm",
    perm: PERM.FIN_POST,
  },
  FARM_FIN_APPROVALS: {
    key: "FARM_FIN_APPROVALS",
    path: "/app/farms/:farmId/finance/approvals",
    label: "Approvals",
    scope: "farm",
    perm: PERM.FIN_APPROVE,
  },
  FARM_FIN_REPORTS: {
    key: "FARM_FIN_REPORTS",
    path: "/app/farms/:farmId/finance/reports",
    label: "Reports",
    scope: "farm",
    perm: PERM.REPORTS_VIEW,
  },

  // Stores
  STORE_OVERVIEW: {
    key: "STORE_OVERVIEW",
    path: "/app/stores/:storeId/overview",
    label: "Store Overview",
    scope: "store",
    perm: PERM.STORE_VIEW,
  },

  POS_SELL: {
    key: "POS_SELL",
    path: "/app/stores/:storeId/pos/sell",
    label: "Sell",
    scope: "store",
    perm: PERM.POS_SALE,
  },
  POS_REFUNDS: {
    key: "POS_REFUNDS",
    path: "/app/stores/:storeId/pos/refunds",
    label: "Refunds",
    scope: "store",
    perm: PERM.POS_REFUND,
  },
  POS_DISCOUNTS: {
    key: "POS_DISCOUNTS",
    path: "/app/stores/:storeId/pos/discounts",
    label: "Discounts",
    scope: "store",
    perm: PERM.POS_DISCOUNT,
  },
  POS_CASHUP: {
    key: "POS_CASHUP",
    path: "/app/stores/:storeId/pos/cash-up",
    label: "Cash-up",
    scope: "store",
    perm: PERM.POS_CASHUP,
  },

  STORE_INV_RECEIVE: {
    key: "STORE_INV_RECEIVE",
    path: "/app/stores/:storeId/inventory/receive",
    label: "Receive",
    scope: "store",
    perm: PERM.STORE_INV_RECEIVE,
  },
  STORE_INV_ADJUSTMENTS: {
    key: "STORE_INV_ADJUSTMENTS",
    path: "/app/stores/:storeId/inventory/adjustments",
    label: "Adjustments",
    scope: "store",
    perm: PERM.STORE_INV_ADJUST,
  },
  STORE_INV_COUNTS: {
    key: "STORE_INV_COUNTS",
    path: "/app/stores/:storeId/inventory/stock-counts",
    label: "Stock Counts",
    scope: "store",
    perm: PERM.STORE_INV_COUNT,
  },

  STORE_TRANSFERS_CREATE: {
    key: "STORE_TRANSFERS_CREATE",
    path: "/app/stores/:storeId/transfers/create",
    label: "Create Transfer",
    scope: "store",
    perm: PERM.TRANSFERS_CREATE,
  },
  STORE_TRANSFERS_INBOUND: {
    key: "STORE_TRANSFERS_INBOUND",
    path: "/app/stores/:storeId/transfers/inbound",
    label: "Inbound Transfers",
    scope: "store",
    perm: PERM.TRANSFERS_VIEW,
  },
  STORE_TRANSFERS_APPROVE: {
    key: "STORE_TRANSFERS_APPROVE",
    path: "/app/stores/:storeId/transfers/approve",
    label: "Approve Transfers",
    scope: "store",
    perm: PERM.TRANSFERS_APPROVE,
  },

  STORE_RETURNS_CREATE: {
    key: "STORE_RETURNS_CREATE",
    path: "/app/stores/:storeId/returns/create",
    label: "Create Return",
    scope: "store",
    perm: PERM.RETURNS_CREATE,
  },
  STORE_RETURNS_APPROVE: {
    key: "STORE_RETURNS_APPROVE",
    path: "/app/stores/:storeId/returns/approve",
    label: "Approve Returns",
    scope: "store",
    perm: PERM.RETURNS_APPROVE,
  },

  STORE_PRODUCTS: {
    key: "STORE_PRODUCTS",
    path: "/app/stores/:storeId/catalog/products",
    label: "Products",
    scope: "store",
    perm: PERM.CATALOG_VIEW,
  },
  STORE_PRICING: {
    key: "STORE_PRICING",
    path: "/app/stores/:storeId/catalog/pricing",
    label: "Pricing",
    scope: "store",
    perm: PERM.PRICING_SET,
  },

  STORE_CUSTOMERS: {
    key: "STORE_CUSTOMERS",
    path: "/app/stores/:storeId/customers/list",
    label: "Customers",
    scope: "store",
    perm: PERM.CUSTOMERS_VIEW,
  },
  STORE_CUSTOMER_ACCOUNTS: {
    key: "STORE_CUSTOMER_ACCOUNTS",
    path: "/app/stores/:storeId/customers/accounts",
    label: "Customer Accounts",
    scope: "store",
    perm: PERM.CUSTOMERS_MANAGE,
  },

  STORE_FIN_CASHBOOK: {
    key: "STORE_FIN_CASHBOOK",
    path: "/app/stores/:storeId/finance/cashbook",
    label: "Cashbook",
    scope: "store",
    perm: PERM.FIN_POST,
  },
  STORE_FIN_REPORTS: {
    key: "STORE_FIN_REPORTS",
    path: "/app/stores/:storeId/finance/reports",
    label: "Reports",
    scope: "store",
    perm: PERM.REPORTS_VIEW,
  },

  // Logistics
  LOGISTICS_DISPATCHES: {
    key: "LOGISTICS_DISPATCHES",
    path: "/app/logistics/dispatches",
    label: "Dispatches",
    scope: "none",
    perm: PERM.DISPATCH_VIEW,
  },
  LOGISTICS_DISPATCH_CREATE: {
    key: "LOGISTICS_DISPATCH_CREATE",
    path: "/app/logistics/dispatches/create",
    label: "Create Dispatch",
    scope: "none",
    perm: PERM.DISPATCH_CREATE,
  },
  LOGISTICS_TRIPS: {
    key: "LOGISTICS_TRIPS",
    path: "/app/logistics/trips",
    label: "Trips",
    scope: "none",
    perm: PERM.LOGISTICS_MANAGE,
  },
  LOGISTICS_POD: {
    key: "LOGISTICS_POD",
    path: "/app/logistics/proof-of-delivery",
    label: "Proof of Delivery",
    scope: "none",
    perm: PERM.POD_CONFIRM,
  },

  // HR
  HR_STAFF: {
    key: "HR_STAFF",
    path: "/app/hr/staff",
    label: "Staff",
    scope: "none",
    perm: PERM.HR_VIEW,
  },
  HR_ROLES_PERMS: {
    key: "HR_ROLES_PERMS",
    path: "/app/hr/roles-permissions",
    label: "Roles & Permissions",
    scope: "none",
    perm: PERM.HR_MANAGE,
  },
  HR_PAYROLL_INPUTS: {
    key: "HR_PAYROLL_INPUTS",
    path: "/app/hr/payroll-inputs",
    label: "Payroll Inputs",
    scope: "none",
    perm: PERM.PAYROLL_INPUT,
  },

  // Group finance (optional)
  GROUP_FIN_APPROVALS: {
    key: "GROUP_FIN_APPROVALS",
    path: "/app/finance/approvals",
    label: "Approvals",
    scope: "none",
    perm: PERM.FIN_APPROVE,
  },
  GROUP_FIN_PERIOD_CLOSE: {
    key: "GROUP_FIN_PERIOD_CLOSE",
    path: "/app/finance/period-close",
    label: "Period Close",
    scope: "none",
    perm: PERM.FIN_LOCK_PERIOD,
  },
  GROUP_FIN_REPORTS: {
    key: "GROUP_FIN_REPORTS",
    path: "/app/finance/reports",
    label: "Reports",
    scope: "none",
    perm: PERM.REPORTS_VIEW,
  },

  // Audit
  AUDIT_ACTIVITY: {
    key: "AUDIT_ACTIVITY",
    path: "/app/audit/activity-log",
    label: "Activity Log",
    scope: "none",
    perm: PERM.AUDIT_READ,
  },
  AUDIT_EXPORTS: {
    key: "AUDIT_EXPORTS",
    path: "/app/audit/data-exports",
    label: "Data Exports",
    scope: "none",
    perm: PERM.AUDIT_READ,
  },

  COMMISSION_OVERVIEW: {
    key: "COMMISSION_OVERVIEW",
    path: "/app/commission/overview",
    label: "Commission Overview",
    scope: "none",
    perm: PERM.COMMISSION_VIEW,
  },

  COMMISSION_AGENTS: {
    key: "COMMISSION_AGENTS",
    path: "/app/commission/agents",
    label: "Agents",
    scope: "none",
    perm: PERM.COMMISSION_AGENTS_VIEW,
  },
  COMMISSION_AGENTS_CREATE: {
    key: "COMMISSION_AGENTS_CREATE",
    path: "/app/commission/agents/create",
    label: "Create Agent",
    scope: "none",
    perm: PERM.COMMISSION_AGENTS_MANAGE,
  },
  COMMISSION_AGENTS_EDIT: {
    key: "COMMISSION_AGENTS_EDIT",
    path: "/app/commission/agents/:agentId/edit",
    label: "Edit Agent",
    scope: "none",
    perm: PERM.COMMISSION_AGENTS_MANAGE,
  },

  COMMISSION_CATALOG_MAP: {
    key: "COMMISSION_CATALOG_MAP",
    path: "/app/commission/catalog-mapping",
    label: "Catalog Mapping",
    scope: "none",
    perm: PERM.COMMISSION_MANAGE,
  },

  COMMISSION_RULES: {
    key: "COMMISSION_RULES",
    path: "/app/commission/rules",
    label: "Commission Rules",
    scope: "none",
    perm: PERM.COMMISSION_RULES_VIEW,
  },
  COMMISSION_RULES_CREATE: {
    key: "COMMISSION_RULES_CREATE",
    path: "/app/commission/rules/create",
    label: "Create Rule",
    scope: "none",
    perm: PERM.COMMISSION_RULES_MANAGE,
  },
  COMMISSION_RULES_EDIT: {
    key: "COMMISSION_RULES_EDIT",
    path: "/app/commission/rules/:ruleId/edit",
    label: "Edit Rule",
    scope: "none",
    perm: PERM.COMMISSION_RULES_MANAGE,
  },

  COMMISSION_ORDERS: {
    key: "COMMISSION_ORDERS",
    path: "/app/commission/orders",
    label: "Orders & Claims",
    scope: "none",
    perm: PERM.COMMISSION_ORDERS_VIEW,
  },
  COMMISSION_RECONCILE: {
    key: "COMMISSION_RECONCILE",
    path: "/app/commission/reconcile",
    label: "Reconcile",
    scope: "none",
    perm: PERM.COMMISSION_ORDERS_RECONCILE,
  },
  COMMISSION_APPROVALS: {
    key: "COMMISSION_APPROVALS",
    path: "/app/commission/approvals",
    label: "Approvals",
    scope: "none",
    perm: PERM.COMMISSION_APPROVE,
  },

  COMMISSION_PAYOUTS: {
    key: "COMMISSION_PAYOUTS",
    path: "/app/commission/payouts",
    label: "Payouts",
    scope: "none",
    perm: PERM.COMMISSION_PAYOUTS_VIEW,
  },
  COMMISSION_PAYOUTS_RUN: {
    key: "COMMISSION_PAYOUTS_RUN",
    path: "/app/commission/payouts/run",
    label: "Run Payout",
    scope: "none",
    perm: PERM.COMMISSION_PAYOUTS_RUN,
  },

  COMMISSION_DISPUTES: {
    key: "COMMISSION_DISPUTES",
    path: "/app/commission/disputes",
    label: "Disputes",
    scope: "none",
    perm: PERM.COMMISSION_DISPUTES_VIEW,
  },
  COMMISSION_REPORTS: {
    key: "COMMISSION_REPORTS",
    path: "/app/commission/reports",
    label: "Commission Reports",
    scope: "none",
    perm: PERM.COMMISSION_REPORTS_VIEW,
  },

  COMMISSION_SETTINGS: {
    key: "COMMISSION_SETTINGS",
    path: "/app/commission/settings",
    label: "Commission Settings",
    scope: "none",
    perm: PERM.COMMISSION_SETTINGS_MANAGE,
  },

  //  COMMISSION_PRODUCTS_EDIT: {
  //   key: "COMMISSION_PRODUCTS",
  //   path: "/app/commission/products",
  //   label: "Commission products",
  //   scope: "none",
  //   perm: PERM.COMMISSION_VIEW,
  // },
};

// Sidebar config (uses routeKeys)
export const SIDEBAR = [
  // { group: "Overview", items: [{ routeKey: "APP_HOME" }] },

{
  group: "Sales Commission",
  items: [
    { routeKey: "COMMISSION_OVERVIEW" },
    { routeKey: "COMMISSION_AGENTS" },
    { routeKey: "COMMISSION_CATALOG_MAP" },
    { routeKey: "COMMISSION_RULES" },
    { routeKey: "COMMISSION_ORDERS" },
    { routeKey: "COMMISSION_RECONCILE" },
    { routeKey: "COMMISSION_APPROVALS" },
    { routeKey: "COMMISSION_PAYOUTS" },
    { routeKey: "COMMISSION_REPORTS" },
    { routeKey: "COMMISSION_SETTINGS" },
  ],
},

  {
    group: "Farms",
    items: [
      { routeKey: "FARM_OVERVIEW" },
      {
        label: "Poultry",
        children: [
          {
            label: "Layers",
            children: [
              { routeKey: "LAYERS_FLOCKS" },
              { routeKey: "LAYERS_DAILY_PRODUCTION" },
              { routeKey: "LAYERS_MORTALITY" },
              { routeKey: "LAYERS_FEED_USAGE" },
              { routeKey: "LAYERS_HEALTH" },
              { routeKey: "LAYERS_CULLS_DISPOSAL" },
            ],
          },
          {
            label: "Broilers",
            when: ({ activeFarmId }) => activeFarmId === "prime-estate",
            children: [
              { routeKey: "BROILERS_BATCHES" },
              { routeKey: "BROILERS_DAILY_PRODUCTION" },
              { routeKey: "BROILERS_MORTALITY" },
              { routeKey: "BROILERS_FEED_USAGE" },
              { routeKey: "BROILERS_HEALTH" },
            ],
          },
          {
            label: "Breeders",
            when: ({ activeFarmId }) => activeFarmId === "prime-estate",
            children: [
              { routeKey: "BREEDERS_FLOCKS" },
              { routeKey: "BREEDERS_EGG_COLLECTION" },
              { routeKey: "BREEDERS_FERTILITY" },
            ],
          },
          {
            label: "Hatchery (Prime Estate)",
            when: ({ activeFarmId }) => activeFarmId === "prime-estate",
            children: [
              { routeKey: "HATCHERY_EQUIPMENT" },
              { routeKey: "HATCHERY_SETTING_CANDLING" },
              { routeKey: "HATCHERY_HATCH_RESULTS" },
              { routeKey: "HATCHERY_CHICK_DISPATCH" },
            ],
          },
          {
            label: "Feed Mill",
            when: ({ activeFarmId }) => activeFarmId === "prime-estate",
            children: [
              { routeKey: "FEED_FORMULAS" },
              { routeKey: "FEED_PRODUCTION_BATCHES" },
              { routeKey: "FEED_RAW_MATERIALS" },
              { routeKey: "FEED_ISSUES_TO_HOUSES" },
            ],
          },
          {
            label: "Egg Room",
            children: [
              { routeKey: "EGGROOM_COLLECTION" },
              { routeKey: "EGGROOM_GRADING_PACKING" },
              { routeKey: "EGGROOM_LOSSES" },
            ],
          },
          {
            label: "Processing",
            when: ({ activeFarmId }) => activeFarmId === "prime-estate",
            children: [
              { routeKey: "PROCESSING_MEAT" },
              { routeKey: "PROCESSING_MANURE" },
            ],
          },
          {
            label: "Biosecurity",
            children: [
              { routeKey: "BIO_VISITORS" },
              { routeKey: "BIO_VEHICLES" },
            ],
          },
        ],
      },
      {
        label: "Crops",
        children: [
          {
            label: "Yam",
            children: [
              { routeKey: "YAM_CYCLES" },
              { routeKey: "YAM_PLANTING" },
              { routeKey: "YAM_FIELD_OPS" },
              { routeKey: "YAM_HARVEST" },
              { routeKey: "YAM_STORAGE_ISSUES" },
            ],
          },
          {
            label: "Plantain",
            children: [
              { routeKey: "PLANTAIN_BLOCKS" },
              { routeKey: "PLANTAIN_SUCKERS" },
              { routeKey: "PLANTAIN_HARVEST" },
              { routeKey: "PLANTAIN_PEPPER_INTERCROP" },
            ],
          },
          {
            label: "Oil Palm",
            children: [
              { routeKey: "OILPALM_BLOCKS" },
              { routeKey: "OILPALM_INTERCROP_TOMATO" },
              { routeKey: "OILPALM_HARVEST_BUNCHES" },
              { routeKey: "OILPALM_NURSERY" },
            ],
          },
          {
            label: "Blocks & Field Ops",
            children: [
              { routeKey: "BLOCKS_HOME" },
              { routeKey: "FIELDOPS_HOME" },
              { routeKey: "FIELDOPS_SPRAYING" },
              { routeKey: "FIELDOPS_FERTIGATION" },
              { routeKey: "FIELDOPS_LABOR" },
            ],
          },
        ],
      },
      {
        label: "Irrigation",
        children: [
          { routeKey: "IRRIGATION_ASSETS" },
          { routeKey: "IRRIGATION_SCHEDULES" },
          { routeKey: "IRRIGATION_RUNLOGS" },
          { routeKey: "IRRIGATION_MAINTENANCE" },
        ],
      },
      {
        label: "Farm Inventory",
        children: [
          { routeKey: "FARM_INV_ITEMS" },
          { routeKey: "FARM_INV_RECEIPTS" },
          { routeKey: "FARM_INV_ISSUES" },
          { routeKey: "FARM_INV_COUNTS" },
        ],
      },
      {
        label: "Farm Finance",
        children: [
          { routeKey: "FARM_FIN_EXPENSES" },
          { routeKey: "FARM_FIN_PAYABLES" },
          { routeKey: "FARM_FIN_RECEIVABLES" },
          { routeKey: "FARM_FIN_CASHBOOK" },
          { routeKey: "FARM_FIN_APPROVALS" },
          { routeKey: "FARM_FIN_REPORTS" },
        ],
      },
    ],
  },

  {
    group: "Stores",
    items: [
      { routeKey: "STORE_OVERVIEW" },
      {
        label: "POS",
        children: [
          { routeKey: "POS_SELL" },
          { routeKey: "POS_REFUNDS" },
          { routeKey: "POS_DISCOUNTS" },
          { routeKey: "POS_CASHUP" },
        ],
      },
      {
        label: "Inventory",
        children: [
          { routeKey: "STORE_INV_RECEIVE" },
          { routeKey: "STORE_INV_ADJUSTMENTS" },
          { routeKey: "STORE_INV_COUNTS" },
        ],
      },
      {
        label: "Transfers",
        children: [
          { routeKey: "STORE_TRANSFERS_CREATE" },
          { routeKey: "STORE_TRANSFERS_INBOUND" },
          { routeKey: "STORE_TRANSFERS_APPROVE" },
        ],
      },
      {
        label: "Returns",
        children: [
          { routeKey: "STORE_RETURNS_CREATE" },
          { routeKey: "STORE_RETURNS_APPROVE" },
        ],
      },
      {
        label: "Catalog",
        children: [
          { routeKey: "STORE_PRODUCTS" },
          { routeKey: "STORE_PRICING" },
        ],
      },
      {
        label: "Customers",
        children: [
          { routeKey: "STORE_CUSTOMERS" },
          { routeKey: "STORE_CUSTOMER_ACCOUNTS" },
        ],
      },
      {
        label: "Store Finance",
        children: [
          { routeKey: "STORE_FIN_CASHBOOK" },
          { routeKey: "STORE_FIN_REPORTS" },
        ],
      },
    ],
  },

  {
    group: "Operations",
    items: [
      { routeKey: "LOGISTICS_DISPATCHES" },
      { routeKey: "LOGISTICS_DISPATCH_CREATE" },
      { routeKey: "LOGISTICS_TRIPS" },
      { routeKey: "LOGISTICS_POD" },
    ],
  },
  {
    group: "HR",
    items: [
      { routeKey: "HR_STAFF" },
      { routeKey: "HR_ROLES_PERMS" },
      { routeKey: "HR_PAYROLL_INPUTS" },
    ],
  },
  {
    group: "Finance (Group)",
    items: [
      { routeKey: "GROUP_FIN_APPROVALS" },
      { routeKey: "GROUP_FIN_PERIOD_CLOSE" },
      { routeKey: "GROUP_FIN_REPORTS" },
    ],
  },
  {
    group: "Audit",
    items: [{ routeKey: "AUDIT_ACTIVITY" }, { routeKey: "AUDIT_EXPORTS" }],
  },

  // {
  //   group: "People",
  //   items: [
  //     { routeKey: "USERS" },
  //     { routeKey: "USERS_CREATE" },
  //     { routeKey: "USERS_EDIT" },
  //     { routeKey: "USERS_SUSPEND" },
  //     { routeKey: "USERS_WALLET_ADJUST" },

  //     { routeKey: "ROLES" },
  //     { routeKey: "ROLES_CREATE" },
  //     { routeKey: "ROLES_EDIT" },
  //     { routeKey: "ROLES_CLONE" },
  //   ],
  // },
];

export function buildTo(routeKey, params = {}) {
  const r = ROUTES[routeKey];
  if (!r) throw new Error(`Unknown routeKey: ${routeKey}`);
  let p = r.path;
  Object.entries(params).forEach(([k, v]) => {
    p = p.replaceAll(`:${k}`, encodeURIComponent(String(v)));
  });
  return p;
}

export function passesRouteConstraints(routeKey, { farmId, storeId } = {}) {
  const r = ROUTES[routeKey];
  const c = r?.constraints;
  if (!c) return true;
  if (c.allowedFarmIds && farmId && !c.allowedFarmIds.includes(farmId))
    return false;
  if (c.allowedStoreIds && storeId && !c.allowedStoreIds.includes(storeId))
    return false;
  return true;
}

function canSeeRoute(routeKey, { can, activeFarmId, activeStoreId }) {
  const r = ROUTES[routeKey];
  if (!r) return false;

  // scope check is usually handled elsewhere, but safe:
  if (r.scope === "farm" && !activeFarmId) return false;
  if (r.scope === "store" && !activeStoreId) return false;

  // permission check
  if (r.perm && can && !can(r.perm)) return false;

  // constraints check
  if (
    !passesRouteConstraints(routeKey, {
      farmId: activeFarmId,
      storeId: activeStoreId,
    })
  )
    return false;

  return true;
}

export function filterSidebarForUser(SIDEBAR, ctx) {
  const { can, activeFarmId, activeStoreId } = ctx;

  function walk(node) {
    // If node has a `when`, it must pass
    if (
      typeof node.when === "function" &&
      !node.when({ activeFarmId, activeStoreId })
    ) {
      return null;
    }

    // Route leaf
    if (node.routeKey) {
      return canSeeRoute(node.routeKey, { can, activeFarmId, activeStoreId })
        ? node
        : null;
    }

    // Group with children
    if (node.children) {
      const kids = node.children.map(walk).filter(Boolean);

      // remove empty nodes
      if (kids.length === 0) return null;
      return { ...node, children: kids };
    }

    // Group with items (top-level SIDEBAR uses items)
    if (node.items) {
      const items = node.items.map(walk).filter(Boolean);

      if (items.length === 0) return null;
      return { ...node, items };
    }

    // Plain label nodes
    return node;
  }

  return SIDEBAR.map(walk).filter(Boolean);
}
