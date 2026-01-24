

import "./commission-overview.scss";

import { useMemo, useState } from "react";


const money = (n, c = "NGN") =>
  `${c} ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const pct = (n) => `${(Number(n || 0) * 100).toFixed(1)}%`;

const STATUS_META = {
  pending: { label: "Pending", pill: "pill--warning" },
  approved: { label: "Approved", pill: "pill--info" },
  paid: { label: "Paid", pill: "pill--success" },
  reversed: { label: "Reversed", pill: "pill--danger" },
};

const seedRows = [
  {
    id: "COM-000231",
    date: "2026-01-20",
    scope: "Oluyole Store",
    agent: "A. Ogunleye",
    channel: "POS",
    orderRef: "SO-98122",
    baseAmount: 154000,
    rate: 0.03,
    commission: 4620,
    status: "pending",
  },
  {
    id: "COM-000230",
    date: "2026-01-20",
    scope: "Prime Estate",
    agent: "S. Adewale",
    channel: "Transfer",
    orderRef: "TR-44102",
    baseAmount: 820000,
    rate: 0.01,
    commission: 8200,
    status: "approved",
  },
  {
    id: "COM-000229",
    date: "2026-01-19",
    scope: "Dugbe Store",
    agent: "T. Balogun",
    channel: "POS",
    orderRef: "SO-98014",
    baseAmount: 269500,
    rate: 0.025,
    commission: 6737.5,
    status: "paid",
  },
  {
    id: "COM-000228",
    date: "2026-01-18",
    scope: "Bodija Store",
    agent: "K. Okon",
    channel: "Marketplace",
    orderRef: "MK-22001",
    baseAmount: 98000,
    rate: 0.04,
    commission: 3920,
    status: "reversed",
  },
];

export default function CommissionOverview() {
    
  const [rows] = useState(seedRows);

  // Filters
  const [range, setRange] = useState("last_30_days");
  const [scope, setScope] = useState("all");
  const [status, setStatus] = useState("all");
  const [agent, setAgent] = useState("all");
  const [q, setQ] = useState("");

  // Drawer (details)
  const [active, setActive] = useState(null);

  const scopes = useMemo(() => ["all", ...Array.from(new Set(rows.map((r) => r.scope)))], [rows]);
  const agents = useMemo(() => ["all", ...Array.from(new Set(rows.map((r) => r.agent)))], [rows]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (scope !== "all" && r.scope !== scope) return false;
      if (status !== "all" && r.status !== status) return false;
      if (agent !== "all" && r.agent !== agent) return false;

      if (!query) return true;
      const hay = `${r.id} ${r.scope} ${r.agent} ${r.channel} ${r.orderRef}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, scope, status, agent, q]);

  const kpis = useMemo(() => {
    const total = filtered.reduce((a, r) => a + r.commission, 0);
    const paid = filtered.filter((r) => r.status === "paid").reduce((a, r) => a + r.commission, 0);
    const pending = filtered
      .filter((r) => r.status === "pending")
      .reduce((a, r) => a + r.commission, 0);
    const avgRate =
      filtered.length > 0 ? filtered.reduce((a, r) => a + r.rate, 0) / filtered.length : 0;

    const byAgent = filtered.reduce((acc, r) => {
      acc[r.agent] = (acc[r.agent] || 0) + r.commission;
      return acc;
    }, {});
    const top = Object.entries(byAgent).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      paid,
      pending,
      avgRate,
      topAgent: top?.[0] || "—",
      topAmount: top?.[1] || 0,
      count: filtered.length,
    };
  }, [filtered]);

  const onExport = () => {
    // simple client export; in real app call API -> signed URL
    const header = [
      "id",
      "date",
      "scope",
      "agent",
      "channel",
      "orderRef",
      "baseAmount",
      "rate",
      "commission",
      "status",
    ];
    const csv = [
      header.join(","),
      ...filtered.map((r) =>
        [
          r.id,
          r.date,
          `"${r.scope}"`,
          `"${r.agent}"`,
          r.channel,
          r.orderRef,
          r.baseAmount,
          r.rate,
          r.commission,
          r.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commission_overview_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="pageHeader">
        <div className="titleBlock">
          <div className="pageTitle">Commission Overview</div>
          <div className="pageSubtitle">
            Track commissions across stores, farms, agents, and channels.
          </div>
        </div>

        <div className="headerActions">
          <button className="btn btn--ghost" onClick={onExport}>
            Export CSV
          </button>
          <button className="btn btn--primary" onClick={() => alert("Open payout flow")}>
            Create Payout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filtersCard">
        <div className="filtersGrid">
          <div className="field">
            <label>Range</label>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 days</option>
              <option value="last_30_days">Last 30 days</option>
              <option value="this_month">This month</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="field">
            <label>Scope</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)}>
              {scopes.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All" : s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Agent</label>
            <select value={agent} onChange={(e) => setAgent(e.target.value)}>
              {agents.map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? "All" : a}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>

          <div className="field field--search">
            <label>Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search commission ID, order ref, agent, scope..."
            />
          </div>
        </div>

        <div className="filtersMeta">
          <div className="muted">
            Showing <b>{kpis.count}</b> records
          </div>
          <div className="hint">
            Tip: Use “Approved” to batch payouts. Keep “Reversed” visible for audit.
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpiGrid">
        <KpiCard label="Total Commission" value={money(kpis.total)} sub="All statuses" icon="₦" />
        <KpiCard label="Paid" value={money(kpis.paid)} sub="Completed payouts" icon="✓" />
        <KpiCard label="Pending" value={money(kpis.pending)} sub="Awaiting approval" icon="⏳" />
        <KpiCard label="Avg. Rate" value={pct(kpis.avgRate)} sub="Across filtered records" icon="%" />
        <KpiCard
          label="Top Earner"
          value={kpis.topAgent}
          sub={`Commission: ${money(kpis.topAmount)}`}
          icon="★"
        />
      </div>

      {/* Charts + Table */}
      <div className="mainGrid">
        <div className="card chartCard">
          <div className="cardHeader">
            <div className="cardTitle">Monthly Commission Trend</div>
            <div className="cardTools">
              <button className="chip">This month</button>
              <button className="chip chip--ghost">Last 6 months</button>
            </div>
          </div>
          <div className="chartPlaceholder">
            {/* Replace with Recharts/Chart.js later */}
            <div className="chartSkeleton" />
            <div className="muted">Connect your analytics source to render the trend chart.</div>
          </div>
        </div>

        <div className="card chartCard">
          <div className="cardHeader">
            <div className="cardTitle">Status Breakdown</div>
            <div className="cardTools">
              <button className="chip">All scopes</button>
              <button className="chip chip--ghost">Top 5 agents</button>
            </div>
          </div>
          <div className="chartPlaceholder">
            <div className="chartSkeleton" />
            <div className="muted">Use this to spot payout bottlenecks (Pending/Approved).</div>
          </div>
        </div>

        <div className="card tableCard">
          <div className="cardHeader">
            <div className="cardTitle">Commission Ledger</div>
            <div className="cardTools">
              <button className="chip chip--ghost" onClick={() => alert("Open bulk approve")}>
                Bulk Approve
              </button>
              <button className="chip chip--ghost" onClick={() => alert("Open rules")}>
                Commission Rules
              </button>
            </div>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Scope</th>
                  <th>Agent</th>
                  <th>Channel</th>
                  <th>Order Ref</th>
                  <th className="num">Base</th>
                  <th className="num">Rate</th>
                  <th className="num">Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="empty">
                      No commission records match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const meta = STATUS_META[r.status] || { label: r.status, pill: "pill--neutral" };
                    return (
                      <tr key={r.id} onClick={() => setActive(r)} className="rowClickable">
                        <td className="mono">{r.id}</td>
                        <td className="mono">{r.date}</td>
                        <td>{r.scope}</td>
                        <td>{r.agent}</td>
                        <td>{r.channel}</td>
                        <td className="mono">{r.orderRef}</td>
                        <td className="num">{money(r.baseAmount)}</td>
                        <td className="num">{pct(r.rate)}</td>
                        <td className="num strong">{money(r.commission)}</td>
                        <td>
                          <span className={`pill ${meta.pill}`}>{meta.label}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Drawer */}
      <div className={`drawer ${active ? "drawer--open" : ""}`}>
        <div className="drawerBackdrop" onClick={() => setActive(null)} />
        <div className="drawerPanel">
          <div className="drawerHeader">
            <div>
              <div className="drawerTitle">Commission Details</div>
              <div className="drawerSub muted">{active?.id || "—"}</div>
            </div>
            <button className="btn btn--ghost" onClick={() => setActive(null)}>
              Close
            </button>
          </div>

          {!active ? (
            <div className="drawerBody muted">Select a row to view details.</div>
          ) : (
            <div className="drawerBody">
              <div className="detailGrid">
                <Detail label="Date" value={active.date} />
                <Detail label="Scope" value={active.scope} />
                <Detail label="Agent" value={active.agent} />
                <Detail label="Channel" value={active.channel} />
                <Detail label="Order Ref" value={active.orderRef} />
                <Detail label="Status" value={STATUS_META[active.status]?.label || active.status} />
              </div>

              <div className="divider" />

              <div className="detailGrid">
                <Detail label="Base Amount" value={money(active.baseAmount)} />
                <Detail label="Rate" value={pct(active.rate)} />
                <Detail label="Commission" value={money(active.commission)} strong />
              </div>

              <div className="drawerActions">
                <button className="btn btn--ghost" onClick={() => alert("Open audit trail")}>
                  View Audit Trail
                </button>
                <button className="btn btn--primary" onClick={() => alert("Approve / pay action")}>
                  Approve / Pay
                </button>
              </div>

              <div className="muted tiny">
                Notes: In production, enforce RBAC (e.g., only Finance roles can approve/pay).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, icon }) {
  return (
    <div className="kpiCard">
      <div className="kpiTop">
        <div className="kpiLabel">{label}</div>
        <div className="kpiIcon">{icon}</div>
      </div>
      <div className="kpiValue">{value}</div>
      <div className="kpiSub">{sub}</div>
    </div>
  );
}

function Detail({ label, value, strong }) {
  return (
    <div className="detail">
      <div className="detailLabel">{label}</div>
      <div className={`detailValue ${strong ? "strong" : ""}`}>{value}</div>
    </div>
  );
}
