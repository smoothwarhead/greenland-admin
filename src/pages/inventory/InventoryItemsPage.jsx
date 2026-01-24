import React, { useMemo, useState } from "react";
import "./inventory.scss";

/**
 * Inventory Items Page (Admin UI) — Clean & Professional
 * - Search + filters + sort
 * - Table with status badges and low-stock indicators
 * - Row actions (View, Adjust, Receive, Issue)
 * - No external UI libs (wire to SCSS classNames)
 */

const n = (v) => Number(v || 0);
const fmtInt = (v) => n(v).toLocaleString();
const fmtMoney = (v, currency = "₦") => `${currency}${n(v).toLocaleString()}`;
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
};

function Pill({ tone = "neutral", children }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

function Button({ tone = "primary", className = "", ...props }) {
  return <button className={`btn btn--${tone} ${className}`.trim()} {...props} />;
}

function Card({ title, action, children }) {
  return (
    <section className="card">
      {(title || action) && (
        <header className="card__hd">
          <div className="card__title">{title}</div>
          {action ? <div className="card__action">{action}</div> : null}
        </header>
      )}
      <div className="card__bd">{children}</div>
    </section>
  );
}

function Table({ columns, rows, empty = "No items found." }) {
  return (
    <div className="table">
      <div className="table__wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={{ width: c.width || "auto" }}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.length ? (
              rows.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => (
                    <td key={c.key}>{typeof c.render === "function" ? c.render(r) : r[c.key]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="table__empty">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="control control--select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      className="control control--input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check__box" />
      <span className="check__label">{label}</span>
    </label>
  );
}

function SortButton({ label, active, dir, onClick }) {
  return (
    <button type="button" className={`sortBtn ${active ? "is-active" : ""}`} onClick={onClick}>
      {label}
      {active ? <span className="sortBtn__dir">{dir === "asc" ? "▲" : "▼"}</span> : null}
    </button>
  );
}

export default function InventoryItemsPage() {
  // Replace with API data
  const items = useMemo(
    () => [
      {
        id: "itm-egg-tray-30",
        sku: "INV-EGG-TRAY-30",
        name: "Egg Tray (30 holes)",
        category: "Packaging",
        unit: "pcs",
        location: "Prime Estate • Main Store",
        qtyOnHand: 5200,
        reorderLevel: 1500,
        unitCost: 120,
        status: "Active",
        lastMovementAt: "2026-01-19T10:15:00.000Z",
      },
      {
        id: "itm-layer-mash-25kg",
        sku: "FD-LAYER-MASH-25KG",
        name: "Layer Mash (25kg)",
        category: "Feed",
        unit: "bags",
        location: "Prime Estate • Feed Store",
        qtyOnHand: 85,
        reorderLevel: 120,
        unitCost: 14800,
        status: "Active",
        lastMovementAt: "2026-01-20T08:45:00.000Z",
      },
      {
        id: "itm-calcium-carbonate",
        sku: "MED-CALC-CARB",
        name: "Calcium Carbonate",
        category: "Medication & Supplements",
        unit: "kg",
        location: "Golden Farm • Vet Store",
        qtyOnHand: 44,
        reorderLevel: 50,
        unitCost: 1800,
        status: "Active",
        lastMovementAt: "2026-01-18T12:02:00.000Z",
      },
      {
        id: "itm-iodine-disinfectant",
        sku: "BIO-IODINE-5L",
        name: "Iodine Disinfectant (5L)",
        category: "Biosecurity",
        unit: "jerrycan",
        location: "Prime Estate • Biosecurity Store",
        qtyOnHand: 8,
        reorderLevel: 12,
        unitCost: 9500,
        status: "Active",
        lastMovementAt: "2026-01-17T16:30:00.000Z",
      },
      {
        id: "itm-egg-crate",
        sku: "INV-EGG-CRATE",
        name: "Plastic Egg Crate",
        category: "Packaging",
        unit: "pcs",
        location: "Atlas Farm • Main Store",
        qtyOnHand: 0,
        reorderLevel: 50,
        unitCost: 3500,
        status: "Inactive",
        lastMovementAt: null,
      },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((x) => x.category))).sort();
    return [{ label: "All categories", value: "all" }, ...unique.map((v) => ({ label: v, value: v }))];
  }, [items]);

  const statuses = useMemo(
    () => [
      { label: "All statuses", value: "all" },
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    []
  );

  const locations = useMemo(() => {
    const unique = Array.from(new Set(items.map((x) => x.location))).sort();
    return [{ label: "All locations", value: "all" }, ...unique.map((v) => ({ label: v, value: v }))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = items.filter((x) => {
      const matchesQuery =
        !q ||
        x.name.toLowerCase().includes(q) ||
        x.sku.toLowerCase().includes(q) ||
        x.category.toLowerCase().includes(q);

      const matchesCat = category === "all" || x.category === category;
      const matchesStatus = status === "all" || x.status === status;
      const matchesLocation = location === "all" || x.location === location;

      const isLow = n(x.qtyOnHand) <= n(x.reorderLevel);
      const matchesLow = !onlyLowStock || isLow;

      return matchesQuery && matchesCat && matchesStatus && matchesLocation && matchesLow;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      // numeric keys
      if (["qtyOnHand", "reorderLevel", "unitCost"].includes(sortKey)) return (n(av) - n(bv)) * dir;

      // date key
      if (sortKey === "lastMovementAt") return ((av ? new Date(av).getTime() : 0) - (bv ? new Date(bv).getTime() : 0)) * dir;

      // string
      return String(av || "").localeCompare(String(bv || "")) * dir;
    });

    return list;
  }, [items, query, category, status, location, onlyLowStock, sortKey, sortDir]);

  const totals = useMemo(() => {
    const activeCount = filtered.filter((x) => x.status === "Active").length;
    const lowCount = filtered.filter((x) => n(x.qtyOnHand) <= n(x.reorderLevel)).length;
    const stockValue = filtered.reduce((sum, x) => sum + n(x.qtyOnHand) * n(x.unitCost), 0);
    return { activeCount, lowCount, stockValue };
  }, [filtered]);

  const setSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  const onAction = (type, item) => {
    // Replace with modals/routes:
    // - View: /inventory/items/:id
    // - Receive: open receive modal
    // - Issue: open issue/consumption modal
    // - Adjust: open stock adjustment modal (audit-logged)
    // eslint-disable-next-line no-alert
    alert(`${type}: ${item.sku} — ${item.name}`);
  };

  const onExport = (type) => {
    // Replace with export endpoint
    // eslint-disable-next-line no-alert
    alert(`Export: ${type}`);
  };

  const statusPill = (x) => {
    if (x.status === "Inactive") return <Pill tone="neutral">Inactive</Pill>;
    const low = n(x.qtyOnHand) <= n(x.reorderLevel);
    if (low && n(x.qtyOnHand) === 0) return <Pill tone="danger">Out of stock</Pill>;
    if (low) return <Pill tone="warning">Low stock</Pill>;
    return <Pill tone="success">In stock</Pill>;
  };

  const columns = useMemo(
    () => [
      {
        key: "item",
        header: "Item",
        width: "34%",
        render: (x) => (
          <div className="itemCell">
            <div className="itemCell__name">{x.name}</div>
            <div className="itemCell__meta">
              <span className="muted">{x.sku}</span>
              <span className="dot">•</span>
              <span className="muted">{x.category}</span>
            </div>
          </div>
        ),
      },
      { key: "unit", header: "Unit", width: "10%" },
      {
        key: "qty",
        header: (
          <div className="thSort">
            <SortButton label="Qty" active={sortKey === "qtyOnHand"} dir={sortDir} onClick={() => setSort("qtyOnHand")} />
          </div>
        ),
        width: "12%",
        render: (x) => (
          <div className="qtyCell">
            <div className="qtyCell__qty">{fmtInt(x.qtyOnHand)}</div>
            <div className="qtyCell__sub muted">Reorder: {fmtInt(x.reorderLevel)}</div>
          </div>
        ),
      },
      {
        key: "unitCost",
        header: (
          <div className="thSort">
            <SortButton label="Unit Cost" active={sortKey === "unitCost"} dir={sortDir} onClick={() => setSort("unitCost")} />
          </div>
        ),
        width: "14%",
        render: (x) => fmtMoney(x.unitCost),
      },
      {
        key: "location",
        header: "Location",
        width: "18%",
        render: (x) => <span className="muted">{x.location}</span>,
      },
      {
        key: "status",
        header: "Status",
        width: "12%",
        render: (x) => statusPill(x),
      },
      {
        key: "lastMovementAt",
        header: (
          <div className="thSort">
            <SortButton
              label="Last movement"
              active={sortKey === "lastMovementAt"}
              dir={sortDir}
              onClick={() => setSort("lastMovementAt")}
            />
          </div>
        ),
        width: "16%",
        render: (x) => <span className="muted">{fmtDate(x.lastMovementAt)}</span>,
      },
      {
        key: "actions",
        header: "",
        width: "18%",
        render: (x) => (
          <div className="rowActions">
            <Button tone="ghost" type="button" onClick={() => onAction("View", x)}>
              View
            </Button>
            <Button tone="ghost" type="button" onClick={() => onAction("Receive", x)}>
              Receive
            </Button>
            <Button tone="ghost" type="button" onClick={() => onAction("Issue", x)}>
              Issue
            </Button>
            <Button tone="ghost" type="button" onClick={() => onAction("Adjust", x)}>
              Adjust
            </Button>
          </div>
        ),
      },
    ],
    [sortKey, sortDir]
  );

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__crumbs">
          <span>Inventory</span>
          <span className="sep">/</span>
          <span className="active">Items</span>
        </div>

        <div className="page__titleRow">
          <div className="page__titleBlock">
            <h1 className="page__title">Inventory Items</h1>
            <div className="page__sub">Central view of stock items across farms, stores, and warehouses.</div>
          </div>

          <div className="page__actions">
            <Button tone="ghost" type="button" onClick={() => onExport("CSV")}>
              Export CSV
            </Button>
            <Button tone="ghost" type="button" onClick={() => onExport("Excel")}>
              Export Excel
            </Button>
            <Button tone="primary" type="button" onClick={() => onAction("Create item", { sku: "NEW", name: "New Item" })}>
              + New Item
            </Button>
          </div>
        </div>
      </header>

      {/* Summary strip */}
      <section className="kpiStrip">
        <KPI label="Items" value={fmtInt(filtered.length)} meta="Current filtered list" />
        <KPI label="Active items" value={fmtInt(totals.activeCount)} meta="Status: Active" />
        <KPI label="Low stock" value={fmtInt(totals.lowCount)} meta="Qty ≤ Reorder level" />
        <KPI label="Stock value" value={fmtMoney(totals.stockValue)} meta="Qty × unit cost" />
      </section>

      {/* Filters */}
      <div className="filters">
        <div className="filters__left">
          <TextInput value={query} onChange={setQuery} placeholder="Search by name, SKU, category..." />
          <Select value={category} onChange={setCategory} options={categories} />
          <Select value={status} onChange={setStatus} options={statuses} />
          <Select value={location} onChange={setLocation} options={locations} />
        </div>

        <div className="filters__right">
          <Checkbox checked={onlyLowStock} onChange={setOnlyLowStock} label="Only low stock" />
          <div className="sortInline">
            <span className="muted">Sort:</span>
            <SortButton label="Name" active={sortKey === "name"} dir={sortDir} onClick={() => setSort("name")} />
            <SortButton label="SKU" active={sortKey === "sku"} dir={sortDir} onClick={() => setSort("sku")} />
          </div>
        </div>
      </div>

      <div className="grid grid--1">
        <Card
          title="Items"
          action={
            <div className="inlineActions">
              <Button tone="ghost" type="button" onClick={() => onAction("Bulk import", { sku: "CSV", name: "Bulk Import" })}>
                Bulk Import
              </Button>
              <Button tone="ghost" type="button" onClick={() => onAction("Reorder report", { sku: "RPT", name: "Reorder Report" })}>
                Reorder Report
              </Button>
            </div>
          }
        >
          <Table columns={columns} rows={filtered} />
          <div className="hint">
            Stock adjustments should be audit-logged. Receipts and issues should create inventory movements tied to documents
            (GRN, Issue Note, Transfer Note).
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Local KPI component (reused above) */
function KPI({ label, value, meta }) {
  return (
    <div className="kpi">
      <div className="kpi__label">{label}</div>
      <div className="kpi__value">{value}</div>
      {meta ? <div className="kpi__meta">{meta}</div> : null}
    </div>
  );
}
