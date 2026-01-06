import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { FARMS, STORES } from "../../app/orgMap";
import { buildTo, ROUTES } from "../../app/routeRegistry";
import { PERM } from "../../app/perms";
import "../../styles/pages.scss";

function cx(...a) {
  return a.filter(Boolean).join(" ");
}
function fmtInt(n) {
  return new Intl.NumberFormat().format(n ?? 0);
}
function fmt1(n) {
  return (n ?? 0).toFixed(1);
}
function fmt2(n) {
  return (n ?? 0).toFixed(2);
}
function fmtNaira(n) {
  return "₦" + new Intl.NumberFormat().format(n ?? 0);
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="proCard">
      <div className="proCardHead">
        <div>
          <div className="proCardTitle">{title}</div>
          {subtitle ? <div className="proCardSub">{subtitle}</div> : null}
        </div>
        {right ? <div className="proCardRight">{right}</div> : null}
      </div>
      <div className="proCardBody">{children}</div>
    </div>
  );
}

function KPI({ label, value, hint, trend }) {
  return (
    <div className="kpi">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      <div className="kpiFoot">
        {hint ? (
          <span className="muted">{hint}</span>
        ) : (
          <span className="muted"> </span>
        )}
        {trend ? (
          <span className={cx("trend", trend.type)}>{trend.text}</span>
        ) : null}
      </div>
    </div>
  );
}

function Pill({ tone = "neutral", children }) {
  return <span className={cx("pill", tone)}>{children}</span>;
}

function Table({ columns, rows, grid = "1.2fr 0.9fr 1fr" }) {
  return (
    <div className="proTable" style={{ ["--grid"]: grid }}>
      <div
        className="proTableHead"
        style={{ gridTemplateColumns: "var(--grid)" }}
      >
        {columns.map((c) => (
          <div key={c} className="proTh">
            {c}
          </div>
        ))}
      </div>
      {rows.map((r, idx) => (
        <div
          key={idx}
          className="proTr"
          style={{ gridTemplateColumns: "var(--grid)" }}
        >
          {r.map((cell, j) => (
            <div key={j} className="proTd">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniBar({ value, max }) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round(((value ?? 0) / (max || 1)) * 100))
  );
  return (
    <div className="miniBar" title={`${pct}%`}>
      <div className="miniBarFill" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ---------- Domain rules / capabilities ----------
function farmCapabilities(farmId) {
  if (farmId === "prime-estate")
    return { hatchery: true, breeders: true, feedMill: true, fertilizer: true };
  return {
    hatchery: false,
    breeders: false,
    feedMill: false,
    fertilizer: false,
  };
}

// function makeFarmSnapshot(farmId) {
//   const base = farmId === "prime-estate" ? 1.0 : farmId === "golden-farm" ? 0.75 : 0.55;
//   const layers = Math.round(20000 * base);
//   const broilers = Math.round(10000 * base);
//   const mortality = +(0.9 * (1.2 - base)).toFixed(2);
//   const eggToday = Math.round(layers * 0.78);
//   const feedTonsWeek = Math.round((layers * 0.115 + broilers * 0.11) / 1000 * 7);
//   const waterM3Day = Math.round((layers * 0.23 + broilers * 0.20) / 1000);
//   const activeCycles = farmId === "prime-estate" ? 7 : farmId === "golden-farm" ? 5 : 4;

//   const lowStock = farmId === "prime-estate" ? 4 : farmId === "golden-farm" ? 6 : 5;
//   const openTasks = farmId === "prime-estate" ? 11 : farmId === "golden-farm" ? 9 : 7;

//   const revenueMTD = Math.round(42_000_000 * base);
//   const cogsMTD = Math.round(26_500_000 * base);
//   const opexMTD = Math.round(7_800_000 * base);
//   const grossMargin = revenueMTD ? Math.round(((revenueMTD - cogsMTD) / revenueMTD) * 100) : 0;

//   return {
//     kpis: { layers, broilers, eggToday, layRate: 78, mortality, feedTonsWeek, waterM3Day, activeCycles },
//     ops: {
//       lowStock,
//       openTasks,
//       alerts: [
//         ...(lowStock > 5 ? [{ type: "warn", text: "Low stock items exceed threshold (review feed additives & packaging)." }] : []),
//         ...(mortality > 0.6 ? [{ type: "risk", text: "Mortality trending high (audit brooding temp / biosecurity checks)." }] : []),
//         ...(farmId !== "prime-estate" ? [{ type: "info", text: "Hatchery is not enabled on this farm (Prime Estate only)." }] : [])
//       ].slice(0, 3)
//     },
//     finance: { revenueMTD, cogsMTD, opexMTD, grossMargin }
//   };
// }

// ---------- NEW: Per-house layer performance ----------
// function makeHousePerformance(farmId) {
//   // Slightly different performance per farm for realism
//   const base =
//     farmId === "prime-estate" ? { fe: 0.165, mort: 0.22, egg: 61.5 } :
//     farmId === "golden-farm" ? { fe: 0.172, mort: 0.32, egg: 60.4 } :
//     { fe: 0.178, mort: 0.45, egg: 59.8 };

//   const houses = [1, 2, 3, 4].map((n) => {
//     const jitter = (k) => (Math.random() - 0.5) * k;
//     const feedEgg = +(base.fe + jitter(0.012)).toFixed(3);     // kg feed per egg (smaller is better)
//     const mort7d = +(base.mort + jitter(0.18)).toFixed(2);     // %
//     const eggSize = +(base.egg + jitter(1.6)).toFixed(1);      // grams

//     // rating rules
//     const feTone = feedEgg <= 0.170 ? "ok" : feedEgg <= 0.176 ? "warn" : "risk";
//     const mTone = mort7d <= 0.35 ? "ok" : mort7d <= 0.55 ? "warn" : "risk";
//     const eTone = eggSize >= 61 ? "ok" : eggSize >= 59.5 ? "warn" : "risk";

//     const overall =
//       (feTone === "risk" || mTone === "risk") ? "risk" :
//       (feTone === "warn" || mTone === "warn" || eTone === "warn") ? "warn" : "ok";

//     return {
//       house: `House ${n}`,
//       flockAgeWeeks: 32 + n * 3,
//       feedEgg, mort7d, eggSize,
//       overall
//     };
//   });

//   return houses;
// }

// ---------- NEW: Crop block map ----------
function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}
function fmtDate(d) {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// function makeCropBlocks(farmId) {
//   const today = new Date();
//   // realistic blocks per farm
//   const blocks =
//     farmId === "prime-estate"
//       ? [
//           { block: "A1", crop: "Yam", stage: "Vegetative", days: 74, harvestIn: 120 },
//           { block: "A2", crop: "Maize (intercrop)", stage: "Tasseling", days: 48, harvestIn: 25 },
//           { block: "B1", crop: "Plantain", stage: "Flowering", days: 140, harvestIn: 40 },
//           { block: "B2", crop: "Pepper", stage: "Harvesting", days: 65, harvestIn: 0 },
//           { block: "C1", crop: "Oil Palm", stage: "Maintenance", days: 540, harvestIn: 80 },
//           { block: "C2", crop: "Tomato (intercrop)", stage: "Fruit set", days: 52, harvestIn: 18 }
//         ]
//       : farmId === "golden-farm"
//         ? [
//             { block: "A1", crop: "Yam", stage: "Mounding", days: 22, harvestIn: 175 },
//             { block: "A3", crop: "Soybean (rotation)", stage: "Flowering", days: 41, harvestIn: 35 },
//             { block: "B1", crop: "Plantain", stage: "Vegetative", days: 95, harvestIn: 95 },
//             { block: "B2", crop: "Pepper", stage: "Nursery", days: 12, harvestIn: 85 },
//             { block: "C1", crop: "Oil Palm", stage: "Maintenance", days: 430, harvestIn: 120 }
//           ]
//         : [
//             { block: "A2", crop: "Yam", stage: "Vegetative", days: 58, harvestIn: 135 },
//             { block: "B1", crop: "Plantain", stage: "Vegetative", days: 70, harvestIn: 120 },
//             { block: "B3", crop: "Pepper", stage: "Flowering", days: 44, harvestIn: 25 },
//             { block: "C1", crop: "Oil Palm", stage: "Maintenance", days: 360, harvestIn: 160 }
//           ];

//   return blocks.map((b) => ({
//     ...b,
//     expectedHarvest: b.harvestIn === 0 ? "Now" : fmtDate(addDays(today, b.harvestIn))
//   }));
// }

// ---------- NEW: Transfer pipeline ----------
function hoursBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60));
}
// function makeTransferPipeline(farmId) {
//   const now = new Date();
//   const baseStores =
//     farmId === "prime-estate"
//       ? ["store-abeokuta", "store-odeda", "store-lagos"]
//       : farmId === "golden-farm"
//         ? ["store-abeokuta", "store-odeda"]
//         : ["store-odeda"];

//   const items = [
//     { sku: "EGG-CRATE-30", name: "Eggs (crate)", uom: "crates", qty: farmId === "prime-estate" ? 120 : 70 },
//     { sku: "BRL-WHOLE-1", name: "Broiler (whole)", uom: "birds", qty: farmId === "prime-estate" ? 45 : 25 },
//     { sku: "PEP-KG", name: "Pepper", uom: "kg", qty: farmId === "prime-estate" ? 120 : 60 },
//     { sku: "PLT-BUNCH", name: "Plantain", uom: "bunches", qty: farmId === "prime-estate" ? 35 : 20 }
//   ];

//   // create 3–5 transfers with SLA timers (hrs)
//   const transfers = baseStores.slice(0, 3).map((storeId, i) => {
//     const createdAt = addDays(now, 0);
//     createdAt.setHours(now.getHours() - (6 + i * 5)); // created 6h, 11h, 16h ago
//     const slaHours = 18; // target delivery SLA
//     const ageHrs = Math.max(1, hoursBetween(createdAt, now));

//     const status =
//       ageHrs > slaHours ? "breach" :
//       ageHrs > Math.round(slaHours * 0.75) ? "risk" :
//       "ontime";

//     const lines = items.slice(0, 2 + (i % 2)).map((it, idx) => ({
//       ...it,
//       qty: Math.max(8, Math.round(it.qty * (0.55 + 0.15 * idx + 0.08 * i)))
//     }));

//     const totalUnits = lines.reduce((s, x) => s + x.qty, 0);

//     return {
//       transferNo: `TRF-${farmId.toUpperCase().slice(0, 3)}-${String(104 + i).padStart(3, "0")}`,
//       toStoreId: storeId,
//       createdAt,
//       ageHrs,
//       slaHours,
//       status,
//       totalUnits,
//       lines
//     };
//   });

//   return transfers;
// }

function storeName(id) {
  return STORES.find((s) => s.id === id)?.name || id;
}
function slaBadge(status) {
  if (status === "ontime") return <Pill tone="ok">On-time</Pill>;
  if (status === "risk") return <Pill tone="warn">At risk</Pill>;
  return <Pill tone="risk">SLA breach</Pill>;
}

// ---------- NEW: Compliance widgets ----------
// function makeCompliance(farmId) {
//   const base =
//     farmId === "prime-estate" ? { bio: 92, visitors: 6, vaxDue: 2 } :
//     farmId === "golden-farm" ? { bio: 85, visitors: 4, vaxDue: 3 } :
//     { bio: 78, visitors: 3, vaxDue: 4 };

//   const visitorLog = [
//     { time: "08:25", name: "Feed supplier", purpose: "Delivery", status: "Checked-in" },
//     { time: "11:10", name: "Veterinary officer", purpose: "Routine check", status: "Cleared" },
//     { time: "14:40", name: "Maintenance team", purpose: "Generator service", status: "Cleared" }
//   ].slice(0, base.visitors);

//   const vaccinationsDue = [
//     { unit: "Layers House 2", item: "ND/IB booster", dueInDays: 2 },
//     { unit: "Brooder Unit", item: "Gumboro", dueInDays: 5 },
//     { unit: "Layers House 4", item: "Fowl pox", dueInDays: 7 },
//     { unit: "Breeders Unit", item: "ND LaSota", dueInDays: 3 }
//   ].slice(0, base.vaxDue);

//   return {
//     biosecurityCompletion: base.bio, // %
//     visitorLog,
//     vaccinationsDue
//   };
// }

// ---------- Page ----------
export default function FarmOverviewPage() {
  const { farmId } = useParams();
  const { can, inFarmScope } = useAuth();
  const { farmState } = useData();

  const farm = FARMS.find((f) => f.id === farmId);

  const payload = farmState.data; // cached API payload
  const isThisFarm = payload?.farmId === farmId;

  const k = isThisFarm ? payload.kpis : null;
  const ov = isThisFarm ? payload.overview : null;

  const loading = farmState.status === "loading";
  const error = farmState.status === "error";

  const caps = useMemo(() => farmCapabilities(farmId), [farmId]);
  //   const snapshot = useMemo(() => makeFarmSnapshot(farmId), [farmId]);

  //   const houses = useMemo(() => makeHousePerformance(farmId), [farmId]);
  //   const crops = useMemo(() => makeCropBlocks(farmId), [farmId]);
  //   const transfers = useMemo(() => makeTransferPipeline(farmId), [farmId]);
  //   const compliance = useMemo(() => makeCompliance(farmId), [farmId]);

  if (!farm) {
    return (
      <div className="page">
        <div className="pageTitle">Farm not found</div>
        <div className="proCard">
          <div className="muted">Unknown farm id: {farmId}</div>
        </div>
      </div>
    );
  }

  if (!inFarmScope(farmId)) {
    return (
      <div className="page">
        <div className="pageTitle">Not authorized</div>
        <div className="proCard">
          <div className="muted">You don’t have access to {farm.name}.</div>
        </div>
      </div>
    );
  }

  const synced =
    farmState.status === "ready"
      ? `Last sync: ${new Date(
          farmState.data?.kpis?.lastSyncAt || Date.now()
        ).toLocaleString()}`
      : farmState.status === "loading"
      ? "Syncing…"
      : farmState.status === "error"
      ? "Sync error"
      : "Idle";

  const quickLinks = [
    {
      label: "Poultry Overview",
      key: "FARM_POULTRY_HOME",
      perm: PERM.POULTRY_VIEW,
    },
    { label: "Layers Flocks", key: "LAYERS_FLOCKS", perm: PERM.LAYERS_VIEW },
    {
      label: "Egg Collection",
      key: "LAYERS_EGG_COLLECTION",
      perm: PERM.LAYERS_VIEW,
    },
    {
      label: "Broilers Batches",
      key: "BROILERS_BATCHES",
      perm: PERM.BROILERS_VIEW,
    },
    {
      label: "Breeders",
      key: "BREEDERS_HOME",
      perm: PERM.BREEDERS_VIEW,
      requires: caps.breeders,
    },
    {
      label: "Hatchery",
      key: "HATCHERY_HOME",
      perm: PERM.HATCHERY_VIEW,
      requires: caps.hatchery,
    },
    { label: "Crops Overview", key: "FARM_CROPS_HOME", perm: PERM.CROPS_VIEW },
    { label: "Inventory", key: "FARM_INV_ITEMS", perm: PERM.INVENTORY_VIEW },
    {
      label: "Transfers",
      key: "FARM_TRANSFERS_OUT",
      perm: PERM.TRANSFERS_VIEW,
    },
    { label: "Expenses", key: "FARM_FIN_EXPENSES", perm: PERM.FINANCE_VIEW },
  ]
    .filter((x) => (x.requires === undefined ? true : !!x.requires))
    .filter((x) => !x.perm || can(x.perm))
    .filter((x) => ROUTES[x.key]);

  const productionRows = [
    [
      "Eggs (today)",
      fmtInt(k.eggToday),
      <MiniBar key="e" value={k.eggToday} max={16000} />,
    ],
    [
      "Lay rate",
      `${k.layRate}%`,
      <MiniBar key="lr" value={k.layRate} max={100} />,
    ],
    [
      "Feed use (t/week)",
      fmtInt(k.feedTonsWeek),
      <MiniBar key="f" value={k.feedTonsWeek} max={40} />,
    ],
    [
      "Water use (m³/day)",
      fmtInt(k.waterM3Day),
      <MiniBar key="w" value={k.waterM3Day} max={10} />,
    ],
    [
      "Active crop cycles",
      fmtInt(k.activeCycles),
      <MiniBar key="c" value={k.activeCycles} max={10} />,
    ],
  ];

  const inventoryRows = [
    [
      "Layer mash (bags)",
      "1,240",
      <Pill key="p1" tone="ok">
        OK
      </Pill>,
    ],
    [
      "Broiler finisher (bags)",
      "310",
      <Pill key="p2" tone="warn">
        Reorder
      </Pill>,
    ],
    [
      "Vaccines & meds",
      "18 items",
      <Pill key="p3" tone="ok">
        OK
      </Pill>,
    ],
    [
      "Egg trays / crates",
      "72 bundles",
      <Pill key="p4" tone="warn">
        Low
      </Pill>,
    ],
    [
      "Diesel (litres)",
      "1,480",
      <Pill key="p5" tone="ok">
        OK
      </Pill>,
    ],
  ];

  const activity = [
    {
      time: "09:10",
      who: "Poultry Supervisor",
      what: "Recorded mortality and culls for Layers House 2.",
    },
    {
      time: "10:30",
      who: "Storekeeper",
      what: "Issued 120 bags of layer mash (Batch #LM-1042).",
    },
    {
      time: "12:05",
      who: "Farm Admin",
      what: "Approved expense: diesel refill for generator.",
    },
    {
      time: "14:20",
      who: "Crop Lead",
      what: "Updated yam cycle: weeding completed Block A3.",
    },
  ];

  // NEW rows
  const houseRows = (ov?.houses || []).map((h) => {
    const feTone =
      h.feedEgg <= 0.17 ? "ok" : h.feedEgg <= 0.176 ? "warn" : "risk";
    const mTone = h.mort7d <= 0.35 ? "ok" : h.mort7d <= 0.55 ? "warn" : "risk";
    const eTone = h.eggSize >= 61 ? "ok" : h.eggSize >= 59.5 ? "warn" : "risk";

    return [
      <div key="h">
        <div style={{ fontWeight: 900, color: "#0f172a" }}>{h.house}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          Flock age: {h.flockAgeWeeks}w
        </div>
      </div>,
      <div key="fe">
        <div style={{ fontWeight: 900 }}>{fmt3(h.feedEgg)} kg/egg</div>
        <div className="muted" style={{ fontSize: 12 }}>
          Target ≤ 0.170
        </div>
      </div>,
      <div key="m">
        <div style={{ fontWeight: 900 }}>{fmt2(h.mort7d)}%</div>
        <div className="muted" style={{ fontSize: 12 }}>
          7-day
        </div>
      </div>,
      <div key="es">
        <div style={{ fontWeight: 900 }}>{fmt1(h.eggSize)} g</div>
        <div className="muted" style={{ fontSize: 12 }}>
          Avg size
        </div>
      </div>,
      <div key="s">
        {/* status */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill tone={h.overall}>
            {h.overall === "ok"
              ? "Healthy"
              : h.overall === "warn"
              ? "Watch"
              : "Action"}
          </Pill>
          <Pill tone={feTone}>FE</Pill>
          <Pill tone={mTone}>Mort</Pill>
          <Pill tone={eTone}>Egg</Pill>
        </div>
      </div>,
    ];
  });

  const cropRows = (ov?.crops || []).map((b) => {
    const stageTone = b.stage.toLowerCase().includes("harvest")
      ? "ok"
      : b.stage.toLowerCase().includes("fruit") ||
        b.stage.toLowerCase().includes("flower")
      ? "warn"
      : "neutral";

    const expected = b.expectedHarvestAt
      ? new Date(b.expectedHarvestAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "Now";

    return [
      <span key="blk" style={{ fontWeight: 900 }}>
        {b.block}
      </span>,
      b.crop,
      <Pill key="st" tone={stageTone}>
        {b.stage}
      </Pill>,
      `${b.daysInStage} days`,
      <span key="eh" style={{ fontWeight: 800 }}>
        {b.expected}
      </span>,
    ];
  });

  const totalUnits = (lines) =>
    (lines || []).reduce((s, x) => s + (x.qty || 0), 0);

  const transferRows = (ov?.transfers || []).map((t) => {
    const qty = totalUnits(t.lines);
    const badge =
      t.status === "ontime" ? (
        <Pill tone="ok">On-time</Pill>
      ) : t.status === "risk" ? (
        <Pill tone="warn">At risk</Pill>
      ) : (
        <Pill tone="risk">SLA breach</Pill>
      );

    const top =
      (t.lines || [])
        .slice(0, 2)
        .map((x) => `${x.name}: ${fmtInt(x.qty)} ${x.uom}`)
        .join(" • ") + ((t.lines || []).length > 2 ? " • …" : "");

    return [
      <div key="no">
        <div style={{ fontWeight: 900, color: "#0f172a" }}>{t.transferNo}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          Created {t.ageHrs}h ago • SLA {t.slaHours}h
        </div>
      </div>,
      t.toStoreId,
      <div key="qty">
        <div style={{ fontWeight: 900 }}>{fmtInt(qty)}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          line items: {(t.lines || []).length}
        </div>
      </div>,
      badge,
      <div key="lines" className="muted" style={{ fontSize: 12 }}>
        {top}
      </div>,
    ];
  });

  const bio = ov?.compliance?.biosecurityCompletion ?? 0;
  const bioTone = bio >= 90 ? "ok" : bio >= 80 ? "warn" : "risk";

  {
    loading ? (
      <div className="proCard">
        <div className="muted">Loading farm overview…</div>
      </div>
    ) : null;
  }

  {
    error ? (
      <div className="proCard">
        <div style={{ color: "#b91c1c" }}>{farmState.error}</div>
      </div>
    ) : null;
  }

  {
    !loading && !error && !isThisFarm ? (
      <div className="proCard">
        <div className="muted">
          No data loaded for this farm yet. Switch to this farm to load.
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="page">
      <div className="pageTop">
        <div>
          <div className="pageTitle">{farm.name} — Overview</div>
          <div className="pageMeta">
            <span className="muted">
              {farm.location || "Ogun State, Nigeria"}
            </span>
            <span className="dotSep">•</span>
            <span className="muted">{synced}</span>
          </div>
        </div>

        <div className="pageActions">
          <button className="btn">Create Task</button>
          <button className="btn">Log Issue</button>
          <button className="btn primary">New Expense</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid4">
        <div className="proCard kpiCard">
          <KPI
            label="Layers (active)"
            value={fmtInt(k.layers)}
            hint="Live birds"
            trend={{ type: "ok", text: "+2.1% wk" }}
          />
        </div>
        <div className="proCard kpiCard">
          <KPI
            label="Broilers (active)"
            value={fmtInt(k.broilers)}
            hint="Live birds"
            trend={{ type: "ok", text: "+1 batch" }}
          />
        </div>
        <div className="proCard kpiCard">
          <KPI
            label="Eggs today"
            value={fmtInt(k.eggToday)}
            hint="Estimated from lay rate"
            trend={{ type: "ok", text: "+3.4% vs yday" }}
          />
        </div>
        <div className="proCard kpiCard">
          <KPI
            label="Mortality (7d)"
            value={`${k.mortality}%`}
            hint="Target < 0.5%"
            trend={{
              type: k.mortality > 0.6 ? "warn" : "ok",
              text: k.mortality > 0.6 ? "Investigate" : "Stable",
            }}
          />
        </div>
      </div>

      {/* Existing snapshot row */}
      <div className="grid2">
        <Card
          title="Operations snapshot"
          subtitle="Production & resource utilization"
          right={
            <Pill tone={caps.hatchery ? "ok" : "neutral"}>
              {caps.hatchery ? "Hatchery Enabled" : "No Hatchery"}
            </Pill>
          }
        >
          <Table
            columns={["Metric", "Value", "Indicator"]}
            rows={productionRows}
          />
        </Card>

        <Card
          title="Finance snapshot (MTD)"
          subtitle="Revenue, cost, margin"
          right={
            <Pill tone={k.finance.grossMargin >= 35 ? "ok" : "warn"}>
              {k.finance.grossMargin}% GM
            </Pill>
          }
        >
          <div className="financeGrid">
            <div className="finBox">
              <div className="finLabel">Revenue</div>
              <div className="finValue">
                {fmtNaira(k.finance.revenueMTD)}
              </div>
              <div className="muted">Eggs, birds, crops, transfers</div>
            </div>
            <div className="finBox">
              <div className="finLabel">COGS</div>
              <div className="finValue">
                {fmtNaira(k.finance.cogsMTD)}
              </div>
              <div className="muted">Feed, chicks, meds, packaging</div>
            </div>
            <div className="finBox">
              <div className="finLabel">OPEX</div>
              <div className="finValue">
                {fmtNaira(k.finance.opexMTD)}
              </div>
              <div className="muted">Diesel, payroll allocation</div>
            </div>
          </div>
          <div className="muted" style={{ marginTop: 10 }}>
            Next: review expense approvals & cost variance (feed).
          </div>
        </Card>
      </div>

      {/* NEW: Layer house performance */}
      <Card
        title="Layers performance (House 1–4)"
        subtitle="Feed/egg ratio, mortality, egg size — identify underperforming houses fast"
        right={<Pill tone="neutral">Daily ops</Pill>}
      >
        <Table
          grid="1.2fr 0.9fr 0.7fr 0.7fr 1.2fr"
          columns={["House", "Feed/Egg", "Mortality", "Egg size", "Status"]}
          rows={houseRows}
        />
        <div className="muted" style={{ marginTop: 10 }}>
          Notes: FE = kg feed per egg (lower is better). Egg size in grams.
          Mortality is 7-day %.
        </div>
      </Card>

      {/* NEW: Crop block map + Transfers */}
      <div className="grid2">
        <Card
          title="Crop block map"
          subtitle="Blocks, crop stage, days-in-stage, expected harvest"
          right={<Pill tone="neutral">Field ops</Pill>}
        >
          <Table
            grid="0.55fr 1.2fr 0.9fr 0.8fr 1fr"
            columns={["Block", "Crop", "Stage", "Days", "Expected harvest"]}
            rows={cropRows}
          />
        </Card>

        <Card
          title="Transfer pipeline"
          subtitle="Farm → Stores pending quantities and SLA timers"
          right={<Pill tone="neutral">Logistics</Pill>}
        >
          <Table
            grid="1.1fr 1fr 0.8fr 0.8fr 1.4fr"
            columns={["Transfer", "Destination", "Qty", "SLA", "Top items"]}
            rows={transferRows}
          />
          <div className="muted" style={{ marginTop: 10 }}>
            SLA: On-time (&lt; 75%), At risk (75–100%), Breach (&gt; 100%).
          </div>
        </Card>
      </div>

      {/* NEW: Compliance widgets */}
      <div className="grid3">
        <Card
          title="Compliance"
          subtitle="Biosecurity checklist completion"
          right={
            <Pill tone={bioTone}>{compliance.biosecurityCompletion}%</Pill>
          }
        >
          <div className="complianceBar">
            <div
              className="complianceBarFill"
              style={{ width: `${compliance.biosecurityCompletion}%` }}
            />
          </div>
          <div className="muted" style={{ marginTop: 10 }}>
            Target: ≥ 90% daily completion (visitor control, footbaths, house
            entry log, PPE).
          </div>
          <div className="listRows" style={{ marginTop: 10 }}>
            <div className="listRow">
              <div>
                <div className="listTitle">Visitor control</div>
                <div className="muted">Sign-in, PPE, disinfect</div>
              </div>
              <Pill tone={bioTone}>Monitored</Pill>
            </div>
            <div className="listRow">
              <div>
                <div className="listTitle">House entry logs</div>
                <div className="muted">Per-house sign-in</div>
              </div>
              <Pill tone={bioTone === "ok" ? "ok" : "warn"}>
                {bioTone === "ok" ? "OK" : "Review"}
              </Pill>
            </div>
          </div>
        </Card>

        <Card
          title="Visitor log"
          subtitle="Today’s external access"
          right={
            <Pill tone="neutral">{compliance.visitorLog.length} visits</Pill>
          }
        >
          <div className="activityList">
            {compliance.visitorLog.length === 0 ? (
              <div className="muted">No visitors recorded.</div>
            ) : (
              compliance.visitorLog.map((v, i) => (
                <div
                  key={i}
                  className="activityRow"
                  style={{ gridTemplateColumns: "70px 1fr 120px" }}
                >
                  <div className="activityTime">{v.time}</div>
                  <div className="activityBody">
                    <div className="activityWho">{v.name}</div>
                    <div className="muted">{v.purpose}</div>
                  </div>
                  <div className="activityTag">
                    <Pill tone="neutral">{v.status}</Pill>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card
          title="Vaccinations due"
          subtitle="Upcoming schedules (next 7 days)"
          right={
            <Pill tone={compliance.vaccinationsDue.length ? "warn" : "ok"}>
              {compliance.vaccinationsDue.length} due
            </Pill>
          }
        >
          {compliance.vaccinationsDue.length === 0 ? (
            <div className="muted">No vaccinations due in the next 7 days.</div>
          ) : (
            <div className="listRows">
              {compliance.vaccinationsDue.map((v, i) => (
                <div key={i} className="listRow">
                  <div>
                    <div className="listTitle">{v.unit}</div>
                    <div className="muted">{v.item}</div>
                  </div>
                  <Pill
                    tone={
                      v.dueInDays <= 2
                        ? "risk"
                        : v.dueInDays <= 4
                        ? "warn"
                        : "neutral"
                    }
                  >
                    Due in {v.dueInDays}d
                  </Pill>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Existing bottom row */}
      <div className="grid3">
        <Card title="Alerts & risks" subtitle="Focus items for today">
          {k.ops.alerts.length === 0 ? (
            <div className="muted">No critical alerts.</div>
          ) : (
            <div className="alertList">
              {snapshot.ops.alerts.map((a, i) => (
                <div key={i} className={cx("alertRow", a.type)}>
                  <span className="alertDot" />
                  <div className="alertText">{a.text}</div>
                </div>
              ))}
            </div>
          )}
          <div className="muted" style={{ marginTop: 10 }}>
            Open tasks: <b>{snapshot.ops.openTasks}</b> • Low stock:{" "}
            <b>{snapshot.ops.lowStock}</b>
          </div>
        </Card>

        <Card
          title="Inventory highlights"
          subtitle="Farm store / feed / consumables"
        >
          <Table columns={["Item", "Balance", "Status"]} rows={inventoryRows} />
          <div className="muted" style={{ marginTop: 10 }}>
            Tip: track feed variance per house weekly.
          </div>
        </Card>

        <Card title="Quick actions" subtitle="Jump into modules">
          <div className="quickGrid">
            {quickLinks.map((q) => (
              <Link
                key={q.key}
                to={buildTo(q.key, { farmId })}
                className="quickLink"
              >
                <div className="quickTitle">{q.label}</div>
                <div className="quickSub">Open</div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Recent activity"
        subtitle="Last actions recorded on this farm"
      >
        <div className="activityList">
          {activity.map((a, i) => (
            <div key={i} className="activityRow">
              <div className="activityTime">{a.time}</div>
              <div className="activityBody">
                <div className="activityWho">{a.who}</div>
                <div className="muted">{a.what}</div>
              </div>
              <div className="activityTag">
                <Pill tone="neutral">Logged</Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// helper for 3 decimals
function fmt3(n) {
  return (n ?? 0).toFixed(3);
}
