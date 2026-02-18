import { MdOutlineFilterList, MdOutlineCategory } from "react-icons/md";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { BiAtom } from "react-icons/bi";
import { TbMoneybag } from "react-icons/tb";
import { HiStatusOnline } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { TbCrown } from "react-icons/tb";


import { farmSelectData } from "../pages/farm-selection/farm-select-data";


const CATEGORIES = [
  { value: "CROPS", label: "Crops" },
  { value: "PROCESSED", label: "Processed" },
  { value: "POULTRY_INPUTS", label: "Poultry Inputs" },
  { value: "POULTRY_OUTPUTS", label: "Poultry Outputs" },
  { value: "INPUTS", label: "Inputs" },
];

const UNITS = [
  "KG",
  "TUBER",
  "BUNCH",
  "LITER",
  "STICK",
  "BIRD",
  "CRATE",
  "BAG",
];





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

export const AGENT_FILTER_GROUPS = [

  { id: 1, label: "Search", icon: IoSearch,
    tag: "search" },
  { id: 2, label: "Status", icon: HiStatusOnline, 
    tag: "status" },
  { id: 3, label: "Tier", icon: TbCrown, tag: "tier" },
  

];

export const agentFilterOptions = {

  statuses: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ],
  tiers: [
    { value: "BRONZE", label: "Bronze" },
    { value: "SILVER", label: "Silver" },
    { value: "GOLD", label: "Gold" },
  ],
};

export const filtersAndSort = [
  {
    id: 1,
    label: "Search",
    icon: IoSearch,
    tag: "search"
  },
  {
    id: 2,
    label: "Status",
    icon: HiStatusOnline,
    tag: "status"
  },
  {
    id: 3,
    label: "Category",
    icon: MdOutlineCategory,
    tag: "category"
  },
  {
    id: 4,
    label: "Commission Type",
    icon: TbMoneybag,
    tag: "commissionType"
  },
  {
    id: 5,
    label: "A to Z",
    icon: FaSortAlphaDown,
    tag: "aToZ"
  },
  {
    id: 6,
    label: "Z to A",
    icon: FaSortAlphaDownAlt,
    tag: "zToA"
  },

]

export const filterOptions = {
  categories: [
    { value: "CROPS", label: "Crops" },
    { value: "PROCESSED", label: "Processed" },
    { value: "POULTRY_INPUTS", label: "Poultry Inputs" },
    { value: "POULTRY_OUTPUTS", label: "Poultry Outputs" },
    { value: "INPUTS", label: "Inputs" },
  ],
  statuses: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ],
  commissionTypes: [
    { value: "FLAT", label: "Flat" },
    { value: "PERCENT", label: "Percent" }, // will match PERCENT_BANDED via normalization
  ],
};


export const createProductData = [
  {
    name: "productName",
    placeholder: "e.g., Tomatoes",
    label: "Product Name *",
    isPassword: false,
    errorMessage: "Product name is required",
    validate: true,
    hint: "Used for display and sorting."
  },
  {
    name: "sku",
    placeholder: "COMM-TOMATOES",
    label: "SKU *",
    isPassword: false,
    errorMessage: "SKU is required",
    validate: true,
    hint: "Format: COMM-XXXXX. Keep it unique."
  },
  {
    name: "category",
    placeholder: "Crops",
    label: "Category *",
    isPassword: false,
    errorMessage: "Category is required",
    validate: true,
    hint: "",
    options: CATEGORIES
  },
  {
    name: "unit",
    placeholder: "Crops",
    label: "Unit *",
    isPassword: false,
    errorMessage: "Unit is required",
    validate: true,
    hint: "",
    options: UNITS
  },
  {
    name: "flatAmout",
    placeholder: "e.g., 50",
    label: "Flat Amount (NGN) *",
    isPassword: false,
    errorMessage: "Flat amount is required",
    validate: true,
    hint: "Commission paid per unit sold.",
    
  },
]