import PRIME from "../assets/images/prime-estate.jpg"
import GOLDEN from "../assets/images/golden-farm.jpg"
import ATLAS from "../assets/images/atlas-farm.jpg"


export const blocks = [
  { id: "A", name: "Zone A", acres: 60, primary: "Yam + Maize + Soybeans" },
  { id: "B", name: "Zone B", acres: 50, primary: "Plantain + Pepper" },
  { id: "C", name: "Zone C", acres: 50, primary: "Oil Palm + Tomato" },
  { id: "D", name: "Zone D", acres: 40, primary: "Sugarcane + Maize + Beans" },
];

export const products = [
  {
    sku: "GE-YAM-FOOD-STD-25KG-001",
    name: "Consumption Yam (25kg)",
    category: "Crops > Yam",
    uom: "bag",
    price: 45000,
    status: "active",
  },
  {
    sku: "GE-EGG-TBL-LRG-CRATE-001",
    name: "Table Eggs (Crate)",
    category: "Poultry > Eggs",
    uom: "crate",
    price: 6500,
    status: "active",
  },
  {
    sku: "GE-BRLR-WHL-1.8KG-001",
    name: "Whole Broiler (1.8kg avg)",
    category: "Poultry > Broilers",
    uom: "bird",
    price: 10000,
    status: "active",
  },
];

export const inventory = [
  { id: "inv1", sku: "GE-EGG-TBL-LRG-CRATE-001", onHand: 220, location: "Egg Room" },
  { id: "inv2", sku: "GE-YAM-FOOD-STD-25KG-001", onHand: 48, location: "Dry Store" },
  { id: "inv3", sku: "GE-BRLR-WHL-1.8KG-001", onHand: 35, location: "Cold Room" },
];

export const cashflow = [
  { id: "m1", month: "Jan", revenue: 14500000, cogs: 8200000, opex: 2900000 },
  { id: "m2", month: "Feb", revenue: 16800000, cogs: 9100000, opex: 3100000 },
  { id: "m3", month: "Mar", revenue: 15100000, cogs: 8600000, opex: 2950000 },
];


export const FARMS = [
  {
    id: "prime",
    name: "Prime Estate",
    location: "Odeda, Ogun State, NG",
    sizeAcres: 200,
    image: PRIME
  },
  {
    id: "golden",
    name: "Golden Farm",
    location: "Iware, Oyo State, NG",
    sizeAcres: 22,
    image: GOLDEN

  },
  {
    id: "atlas",
    name: "Atlas Farm",
    location: "Ido, Oyo State, NG",
    sizeAcres: 5,
    image: ATLAS
  },
];


export const mockByFarm = {
  farm_ogun_200: {
    farm: FARMS.find((f) => f.id === "farm_ogun_200"),
    blocks: [
      { id: "A", name: "Zone A", acres: 60, primary: "Yam + Maize + Soybeans" },
      { id: "B", name: "Zone B", acres: 50, primary: "Plantain + Pepper" },
      { id: "C", name: "Zone C", acres: 50, primary: "Oil Palm + Tomato" },
      { id: "D", name: "Zone D", acres: 40, primary: "Sugarcane + Maize + Beans" },
    ],
    products: [
      { sku: "GE-200-YAM-25KG-001", name: "Consumption Yam (25kg)", category: "Crops > Yam", uom: "bag", price: 45000, status: "active" },
      { sku: "GE-200-EGG-CRATE-001", name: "Table Eggs (Crate)", category: "Poultry > Eggs", uom: "crate", price: 6500, status: "active" },
      { sku: "GE-200-PEP-25KG-001", name: "Habanero Pepper (25kg)", category: "Crops > Pepper", uom: "crate", price: 120000, status: "active" },
    ],
    inventory: [
      { id: "inv1", sku: "GE-200-EGG-CRATE-001", onHand: 220, location: "Egg Room" },
      { id: "inv2", sku: "GE-200-YAM-25KG-001", onHand: 48, location: "Dry Store" },
    ],
    cashflow: [
      { id: "m1", month: "Jan", revenue: 14500000, cogs: 8200000, opex: 2900000 },
      { id: "m2", month: "Feb", revenue: 16800000, cogs: 9100000, opex: 3100000 },
      { id: "m3", month: "Mar", revenue: 15100000, cogs: 8600000, opex: 2950000 },
    ],
  },

  farm_ogun_22: {
    farm: FARMS.find((f) => f.id === "farm_ogun_22"),
    blocks: [
      { id: "S1", name: "Starter Block 1", acres: 10, primary: "Activation (Yam + Maize)" },
      { id: "S2", name: "Starter Block 2", acres: 12, primary: "Poultry (Phase 1) + Buffer" },
    ],
    products: [
      { sku: "GE-22-YAM-25KG-001", name: "Consumption Yam (25kg)", category: "Crops > Yam", uom: "bag", price: 45000, status: "active" },
      { sku: "GE-22-MAIZE-50KG-001", name: "Maize (50kg)", category: "Crops > Maize", uom: "bag", price: 42000, status: "active" },
    ],
    inventory: [
      { id: "inv1", sku: "GE-22-MAIZE-50KG-001", onHand: 12, location: "Store" },
    ],
    cashflow: [
      { id: "m1", month: "Jan", revenue: 2400000, cogs: 1400000, opex: 520000 },
      { id: "m2", month: "Feb", revenue: 3100000, cogs: 1700000, opex: 600000 },
    ],
  },

  farm_5ac_borehole: {
    farm: FARMS.find((f) => f.id === "farm_5ac_borehole"),
    blocks: [
      { id: "Z1", name: "Zone 1", acres: 2, primary: "Tomato" },
      { id: "Z2", name: "Zone 2", acres: 3, primary: "Pepper + Nursery" },
    ],
    products: [
      { sku: "GE-5-TOM-CRATE-001", name: "Tomato (Crate)", category: "Crops > Tomato", uom: "crate", price: 25000, status: "active" },
      { sku: "GE-5-PEP-25KG-001", name: "Pepper (25kg)", category: "Crops > Pepper", uom: "crate", price: 120000, status: "active" },
    ],
    inventory: [
      { id: "inv1", sku: "GE-5-TOM-CRATE-001", onHand: 18, location: "Pack Area" },
    ],
    cashflow: [
      { id: "m1", month: "Jan", revenue: 1800000, cogs: 900000, opex: 260000 },
      { id: "m2", month: "Feb", revenue: 2200000, cogs: 1100000, opex: 280000 },
    ],
  },
};

