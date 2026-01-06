// import {
//   W_EggsToday, W_MortalityAlert, W_FeedVariance,
//   W_CropCycles, W_HarvestForecast,
//   W_InventoryLowStock, W_InventoryMovements,
//   W_SalesPipeline, W_PnLMonth, W_ExpenseBreakdown,
//   W_StaffAttendance, W_MaintenanceDue, W_FuelBurn,
//   W_MultiFarmOverview, W_AdminAlerts
// } from "../api/widgets";
// import { PERMS } from "../auth/perms";
// import { ROLES } from "../auth/roles";

import { farmSelectData } from "../pages/farm-selection/farm-select-data";

export const loginData = [
  {
    name: "email",
    placeholder: "Email",
    label: "Email",
    isPassword: false,
    errorMessage: "Please enter a valid Email",
    validate: true,
  },
  {
    name: "password",
    placeholder: "Password",
    label: "Password",
    isPassword: true,
    errorMessage: "Please enter a valid Password",
    validate: true,
  },
];

export const USERS = [
  {
    id: "u-super",
    name: "Super Admin",
    role: "SUPER_ADMIN",
    scopes: {
      farms: farmSelectData.find((d) => d.id === "farm").farms.map((f) => f.id),
      stores: farmSelectData
        .find((d) => d.id === "store")
        .stores.map((s) => s.id),
    },
  },
  {
    id: "u-farm-admin-prime",
    name: "Prime Estate Farm Admin",
    role: "FARM_ADMIN",
    scopes: { farms: ["prime-estate"], stores: [] },
  },
  {
    id: "u-poultry-golden",
    name: "Golden Poultry Manager",
    role: "POULTRY_MANAGER",
    scopes: { farms: ["golden-farm"], stores: [] },
  },
  {
    id: "u-cashier-odeda",
    name: "Oluyole Cashier",
    role: "CASHIER",
    scopes: { farms: [], stores: ["store-oluyole"] },
  },
  {
    id: "u-store-mgr-lagos",
    name: "Ojoo Store Manager",
    role: "STORE_MANAGER",
    scopes: { farms: [], stores: ["store-ojoo"] },
  },
  {
    id: "u-auditor",
    name: "Auditor",
    role: "AUDITOR",
    scopes: {
      farms: farmSelectData.find((d) => d.id === "farm").farms.map((f) => f.id),
      stores: farmSelectData
        .find((d) => d.id === "store")
        .stores.map((s) => s.id),
    },
  },
];

// const DEMO_USERS = [
//   {
//     id: "u-super",
//     name: "Super Admin",
//     role: "SUPER_ADMIN",
//     scopes: {
//       farms: ["prime-estate", "golden-farm", "atlas-farm"],
//       stores: ["store-odeda", "store-abeokuta", "store-lagos"],
//     },
//   },
//   {
//     id: "u-farm-admin-prime",
//     name: "Prime Estate Farm Admin",
//     role: "FARM_ADMIN",
//     scopes: { farms: ["prime-estate"], stores: [] },
//   },
//   {
//     id: "u-poultry-golden",
//     name: "Golden Poultry Manager",
//     role: "POULTRY_MANAGER",
//     scopes: { farms: ["golden-farm"], stores: [] },
//   },
//   {
//     id: "u-cashier-odeda",
//     name: "Odeda Cashier",
//     role: "CASHIER",
//     scopes: { farms: [], stores: ["store-odeda"] },
//   },
//   {
//     id: "u-store-mgr-lagos",
//     name: "Lagos Store Manager",
//     role: "STORE_MANAGER",
//     scopes: { farms: [], stores: ["store-lagos"] },
//   },
//   {
//     id: "u-auditor",
//     name: "Auditor",
//     role: "AUDITOR",
//     scopes: {
//       farms: ["prime-estate", "golden-farm", "atlas-farm"],
//       stores: ["store-odeda", "store-abeokuta", "store-lagos"],
//     },
//   },
// ];

// export const DASHBOARDS = {

//   SUPER_ADMIN: {
//     title: "Super Admin Dashboard",
//     grid: 3,
//     sections: [
//       { key: "overview", title: "Enterprise Overview", widgets: [
//         { component: W_MultiFarmOverview, perms: [PERMS.FARM_READ_ANY]},
//         { component: W_AdminAlerts, perms: [PERMS.ADMIN_MANAGE_ANY] },
//         { component: W_PnLMonth, perms: [PERMS.FINANCE_READ_ANY]}
//       ]},
//       { key: "ops", title: "Operations", widgets: [
//         { component: W_EggsToday, perms: [PERMS.POULTRY_READ_ANY] },
//         { component: W_MortalityAlert, perms: [PERMS.POULTRY_READ_ANY] },
//         { component: W_InventoryLowStock, perms: [PERMS.INVENTORY_READ_ANY]}
//       ]}
//     ]
//   },

//   FARM_MANAGER: {
//     title: "Farm Manager Dashboard",
//     grid: 3,
//     sections: [
//       { key: "today", title: "Today", widgets: [
//         { component: W_EggsToday, perms: [PERMS.POULTRY_READ_OWN ]},
//         { component: W_StaffAttendance, perms: [PERMS.STAFF_READ_OWN] },
//         { component: W_InventoryMovements, perms: [PERMS.INVENTORY_READ_OWN] }
//       ]},
//       { key: "production", title: "Production Control", widgets: [
//         { component: W_MortalityAlert, perms: [PERMS.POULTRY_READ_OWN]},
//         { component: W_FeedVariance, perms: [PERMS.POULTRY_READ_OWN]},
//         { component: W_CropCycles, perms: [PERMS.CROPS_READ_OWN] }
//       ]},
//       { key: "finance", title: "Finance Snapshot", widgets: [
//         { component: W_PnLMonth, perms: [PERMS.FINANCE_READ_OWN] },
//         { component: W_ExpenseBreakdown, perms: [PERMS.FINANCE_READ_OWN]  },
//         { component: W_SalesPipeline, perms: [PERMS.SALES_READ_OWN]   }
//       ]}
//     ]
//   },

//   POULTRY_SUPERVISOR: {
//     title: "Poultry Dashboard",
//     grid: 3,
//     sections: [
//       { key: "production", title: "Egg Production", widgets: [
//         { component: W_EggsToday, perms: [PERMS.POULTRY_READ_OWN ] },
//         { component: W_FeedVariance, perms: [PERMS.POULTRY_READ_OWN ] },
//         { component: W_MortalityAlert, perms: [PERMS.POULTRY_READ_OWN ] }
//       ]},
//       { key: "stock", title: "Feed & Stock Visibility", widgets: [
//         { component: W_InventoryLowStock, perms: [PERMS.INVENTORY_READ_OWN] },
//         { component: W_InventoryMovements, perms: [PERMS.INVENTORY_READ_OWN] }
//       ]}
//     ]
//   },

//   VET_TECH: {
//     title: "Vet & Health Dashboard",
//     grid: 3,
//     sections: [
//       { key: "alerts", title: "Health Alerts", widgets: [
//         { component: W_MortalityAlert, perms: [PERMS.POULTRY_READ_OWN ]},
//         { component: W_EggsToday, perms: [PERMS.POULTRY_READ_OWN ]}
//       ]}
//       // Add vaccination due widget later (from health schedule table)
//     ]
//   },

//   CROP_SUPERVISOR: {
//     title: "Crops Dashboard",
//     grid: 3,
//     sections: [
//       { key: "cycles", title: "Crop Cycles", widgets: [
//         { component: W_CropCycles, perms: [PERMS.CROPS_READ_OWN] },
//         { component: W_HarvestForecast, perms: [PERMS.CROPS_READ_OWN] },
//         { component: W_InventoryLowStock, perms: [PERMS.INVENTORY_READ_OWN] }
//       ]}
//     ]
//   },

//   STOREKEEPER: {
//     title: "Store Dashboard",
//     grid: 3,
//     sections: [
//       { key: "stock", title: "Stock Control", widgets: [
//         { component: W_InventoryLowStock, perms: [PERMS.INVENTORY_READ_OWN] },
//         { component: W_InventoryMovements, perms: [PERMS.INVENTORY_READ_OWN]  }
//       ]}
//     ]
//   },

//   SALES_OFFICER: {
//     title: "Sales Dashboard",
//     grid: 3,
//     sections: [
//       { key: "pipeline", title: "Sales Pipeline", widgets: [
//         { component: W_SalesPipeline, perms: [PERMS.SALES_READ_OWN] },
//         { component: W_InventoryLowStock, perms: [PERMS.INVENTORY_READ_OWN]  }
//       ]}
//     ]
//   },

//   FINANCE: {
//     title: "Finance Dashboard",
//     grid: 3,
//     sections: [
//       { key: "pnl", title: "Performance", widgets: [
//         { component: W_PnLMonth, perms: [PERMS.FINANCE_READ_OWN] },
//         { component: W_ExpenseBreakdown, perms: [PERMS.FINANCE_READ_OWN]  }
//       ]},
//       { key: "sales", title: "Sales Visibility", widgets: [
//         { component: W_SalesPipeline, perms: [PERMS.SALES_READ_OWN] }
//       ]}
//     ]
//   },

//   ASSET_TECH: {
//     title: "Assets Dashboard",
//     grid: 3,
//     sections: [
//       { key: "maintenance", title: "Maintenance", widgets: [
//         { component: W_MaintenanceDue, perms: [PERMS.ASSETS_READ_OWN] },
//         { component: W_FuelBurn, perms: [PERMS.ASSETS_READ_OWN] }
//       ]}
//     ]
//   }

// };

// export function pickDashboardRole(roles = []) {

//   return Object.keys(ROLES).find(r => roles.includes(r)) || "FARM_MANAGER";

// }

// export function setRoleStr(role){
//   if(role === "SUPER_ADMIN"){
//     return "Super Admin"
//   }
//   if(role === "FINANCE"){
//     return "Finance"
//   }
//   if(role === "FARM_MANAGER"){
//     return "Farm Manager"
//   }
//   if(role === "INVENTORY"){
//     return "Inventory"
//   }
//   if(role === "SALES"){
//     return "Sales"
//   }
//   if(role === "HR"){
//     return "HR"
//   }
//   if(role === "POULTRY_SUPERVISOR"){
//     return "Poultry Supervisor"
//   }
//   if(role === "HATCHERY_TECH"){
//     return "Hatchery Tech"
//   }
//   if(role === "VET_TECH"){
//     return "Vet Tech"
//   }
//   if(role === "CROP_SUPERVISOR"){
//     return "Crop supervisor"
//   }
//   if(role === "STOREKEEPER"){
//     return "Storekeeper"
//   }
//   if(role === "SALES_OFFICER"){
//     return "Sales Officer"
//   }
//   if(role === "ASSET_TECH"){
//     return "Asset Tech"
//   }
//   if(role === "DATA_ENTRY"){
//     return "Data Entry"
//   }
//   if(role === "SECURITY"){
//     return "Security"
//   }
//   if(role === "AUDITOR"){
//     return "Auditor"
//   }
// }
