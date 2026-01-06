import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { STORES } from "../../app/orgMap";
import { buildTo, ROUTES } from "../../app/routeRegistry";
import { PERM } from "../../app/perms";
import "../../styles/pages.scss";





function cx(...a) { return a.filter(Boolean).join(" "); }
function fmtInt(n) { return new Intl.NumberFormat().format(n ?? 0); }
function fmtNaira(n) { return "₦" + new Intl.NumberFormat().format(n ?? 0); }

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
        {hint ? <span className="muted">{hint}</span> : <span className="muted"> </span>}
        {trend ? <span className={cx("trend", trend.type)}>{trend.text}</span> : null}
      </div>
    </div>
  );
}

function Pill({ tone = "neutral", children }) {
  return <span className={cx("pill", tone)}>{children}</span>;
}

function Table({ columns, rows }) {
  return (
    <div className="proTable">
      <div className="proTableHead">
        {columns.map((c) => (
          <div key={c} className="proTh">{c}</div>
        ))}
      </div>
      {rows.map((r, idx) => (
        <div key={idx} className="proTr">
          {r.map((cell, j) => (
            <div key={j} className="proTd">{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function makeStoreSnapshot(storeId) {
  const base = storeId.includes("lagos") ? 1.0 : storeId.includes("abeokuta") ? 0.75 : 0.6;

  const salesToday = Math.round(180_000 * base);
  const transactions = Math.round(42 * base);
  const avgBasket = transactions ? Math.round(salesToday / transactions) : 0;

  const returnsToday = Math.max(0, Math.round(4 * (1.1 - base)));
  const lowStock = Math.round(8 * (1.2 - base)) + 3;

  const cashOnHand = Math.round(280_000 * base);
  const transferInTransit = Math.round(3 + 5 * base);

  return {
    kpis: { salesToday, transactions, avgBasket, returnsToday, lowStock, cashOnHand, transferInTransit },
    alerts: [
      ...(lowStock >= 8 ? [{ type: "warn", text: "Low stock items are high — review reorder & transfers." }] : []),
      ...(returnsToday >= 3 ? [{ type: "risk", text: "Returns unusually high — audit POS receipts & product quality." }] : [])
    ].slice(0, 2)
  };
}

export default function StoreOverviewPage() {
  const { storeId: routeStoreId } = useParams();
  const storeId = routeStoreId;

  const { can, inStoreScope } = useAuth();
  const { storeState } = useData();

  const store = STORES.find((s) => s.id === storeId);
  const snap = useMemo(() => makeStoreSnapshot(storeId), [storeId]);

  const hasAccess = inStoreScope(storeId);

  if (!store) {
    return (
      <div className="page">
        <div className="pageTitle">Store not found</div>
        <div className="proCard"><div className="muted">Unknown store id: {storeId}</div></div>
      </div>
    );
  }
  if (!hasAccess) {
    return (
      <div className="page">
        <div className="pageTitle">Not authorized</div>
        <div className="proCard"><div className="muted">You don’t have access to {store.name}.</div></div>
      </div>
    );
  }

  const synced =
    storeState.status === "ready"
      ? `Last sync: ${new Date(storeState.data?.kpis?.lastSyncAt || Date.now()).toLocaleString()}`
      : storeState.status === "loading"
        ? "Syncing…"
        : storeState.status === "error"
          ? "Sync error"
          : "Idle";

  const quick = [
    { label: "Sell (POS)", key: "POS_SELL", perm: PERM.POS_SELL },
    { label: "Transactions", key: "POS_TXNS", perm: PERM.POS_VIEW },
    { label: "Inventory Receive", key: "STORE_INV_RECEIVE", perm: PERM.INVENTORY_VIEW },
    { label: "Transfers", key: "STORE_TRANSFERS_CREATE", perm: PERM.TRANSFERS_VIEW },
    { label: "Returns", key: "STORE_RETURNS_CREATE", perm: PERM.RETURNS_VIEW },
    { label: "Customers", key: "STORE_CUSTOMERS", perm: PERM.CRM_VIEW },
    { label: "Cashbook", key: "STORE_FIN_CASHBOOK", perm: PERM.FINANCE_VIEW }
  ].filter((x) => !x.perm || can(x.perm))
   .filter((x) => ROUTES[x.key]);

  const topSellers = [
    ["Eggs (crate)", fmtInt(Math.round(48 * (storeId.includes("lagos") ? 1.2 : 1.0))), fmtNaira(Math.round(72_000 * (storeId.includes("lagos") ? 1.2 : 1.0)))],
    ["Broiler (whole)", fmtInt(Math.round(12 * (storeId.includes("lagos") ? 1.1 : 0.9))), fmtNaira(Math.round(120_000 * (storeId.includes("lagos") ? 1.1 : 0.9)))],
    ["Pepper (kg)", fmtInt(Math.round(26 * 1.0)), fmtNaira(Math.round(65_000 * 1.0))],
    ["Plantain (bunch)", fmtInt(Math.round(9 * 1.0)), fmtNaira(Math.round(45_000 * 1.0))]
  ];

  const pendingOps = [
    ["Inbound transfers", fmtInt(snap.kpis.transferInTransit), <Pill key="a" tone="neutral">In transit</Pill>],
    ["Low stock SKUs", fmtInt(snap.kpis.lowStock), <Pill key="b" tone={snap.kpis.lowStock >= 8 ? "warn" : "ok"}>{snap.kpis.lowStock >= 8 ? "Action" : "OK"}</Pill>],
    ["Returns today", fmtInt(snap.kpis.returnsToday), <Pill key="c" tone={snap.kpis.returnsToday >= 3 ? "warn" : "ok"}>{snap.kpis.returnsToday >= 3 ? "Review" : "OK"}</Pill>]
  ];

  return (
    <div className="page">
      <div className="pageTop">
        <div>
          <div className="pageTitle">{store.name} — Store Overview</div>
          <div className="pageMeta">
            <span className="muted">{store.location || "Nigeria"}</span>
            <span className="dotSep">•</span>
            <span className="muted">{synced}</span>
          </div>
        </div>

        <div className="pageActions">
          <button className="btn">Open Shift</button>
          <button className="btn">Create Transfer</button>
          <button className="btn primary">Start POS</button>
        </div>
      </div>

      <div className="grid4">
        <div className="proCard kpiCard">
          <KPI label="Sales today" value={fmtNaira(snap.kpis.salesToday)} hint="POS gross" trend={{ type: "ok", text: "+5.2% vs avg" }} />
        </div>
        <div className="proCard kpiCard">
          <KPI label="Transactions" value={fmtInt(snap.kpis.transactions)} hint="Count" trend={{ type: "neutral", text: "Normal" }} />
        </div>
        <div className="proCard kpiCard">
          <KPI label="Avg basket" value={fmtNaira(snap.kpis.avgBasket)} hint="Per transaction" trend={{ type: "ok", text: "+₦300" }} />
        </div>
        <div className="proCard kpiCard">
          <KPI label="Cash on hand" value={fmtNaira(snap.kpis.cashOnHand)} hint="Till + safe" trend={{ type: "neutral", text: "Reconcile EOD" }} />
        </div>
      </div>

      <div className="grid2">
        <Card title="Operational watchlist" subtitle="Transfers, stock, returns">
          <Table columns={["Item", "Value", "Status"]} rows={pendingOps} />
          {snap.alerts.length ? (
            <div className="alertList" style={{ marginTop: 12 }}>
              {snap.alerts.map((a, i) => (
                <div key={i} className={cx("alertRow", a.type)}>
                  <span className="alertDot" />
                  <div className="alertText">{a.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ marginTop: 10 }}>No critical alerts.</div>
          )}
        </Card>

        <Card title="Top sellers (today)" subtitle="Fast-moving items">
          <Table columns={["Product", "Qty", "Sales"]} rows={topSellers} />
          <div className="muted" style={{ marginTop: 10 }}>
            Tip: monitor egg pricing & shrink on meat items daily.
          </div>
        </Card>
      </div>

      <div className="grid3">
        <Card title="Quick actions" subtitle="Jump into store modules">
          <div className="quickGrid">
            {quick.map((q) => (
              <Link key={q.key} to={buildTo(q.key, { storeId })} className="quickLink">
                <div className="quickTitle">{q.label}</div>
                <div className="quickSub">Open</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Shrink & quality" subtitle="Loss controls">
          <div className="listRows">
            <div className="listRow">
              <div>
                <div className="listTitle">Egg breakage (week)</div>
                <div className="muted">Target &lt; 0.6%</div>
              </div>
              <Pill tone="ok">0.4%</Pill>
            </div>
            <div className="listRow">
              <div>
                <div className="listTitle">Cold-chain compliance</div>
                <div className="muted">Meat & perishables</div>
              </div>
              <Pill tone="warn">Needs review</Pill>
            </div>
            <div className="listRow">
              <div>
                <div className="listTitle">Refund approvals</div>
                <div className="muted">Manager required</div>
              </div>
              <Pill tone="neutral">2 pending</Pill>
            </div>
          </div>
        </Card>

        <Card title="Staff & shifts" subtitle="Today’s coverage">
          <div className="listRows">
            <div className="listRow">
              <div>
                <div className="listTitle">Cashier</div>
                <div className="muted">Morning shift</div>
              </div>
              <Pill tone="ok">Present</Pill>
            </div>
            <div className="listRow">
              <div>
                <div className="listTitle">Storekeeper</div>
                <div className="muted">Inventory & receiving</div>
              </div>
              <Pill tone="ok">Present</Pill>
            </div>
            <div className="listRow">
              <div>
                <div className="listTitle">Manager</div>
                <div className="muted">Approvals & reconciliation</div>
              </div>
              <Pill tone="neutral">On-call</Pill>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
