import React, { useMemo, useState } from "react";
import "./poultry.scss";

/**
 * Clean, professional Layers Flock Page (Admin UI)
 * - Minimal, consistent layout
 * - Strong hierarchy: Header → KPIs → Tabs → Cards → Tables
 * - No external UI libs (wire to SCSS via classNames)
 */

const n = (v) => Number(v || 0);
const fmtInt = (v) => n(v).toLocaleString();
const fmtMoney = (v, currency = "₦") => `${currency}${n(v).toLocaleString()}`;
const fmtPct = (v, d = 1) => `${n(v).toFixed(d)}%`;

const weeksSince = (dateISO) => {
  const start = new Date(dateISO);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - start.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
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

function KPI({ label, value, meta }) {
  return (
    <div className="kpi">
      <div className="kpi__label">{label}</div>
      <div className="kpi__value">{value}</div>
      {meta ? <div className="kpi__meta">{meta}</div> : null}
    </div>
  );
}

function RowKV({ k, v }) {
  return (
    <div className="rowkv">
      <div className="rowkv__k">{k}</div>
      <div className="rowkv__v">{v}</div>
    </div>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs">
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          className={`tabs__tab ${value === t.value ? "is-active" : ""}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Table({ columns, rows, empty = "No records." }) {
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
              rows.map((r, idx) => (
                <tr key={r.id || idx}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {typeof c.render === "function" ? c.render(r) : r[c.key]}
                    </td>
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

function SectionHint({ children }) {
  return <div className="hint">{children}</div>;
}

export default function LayersFlockPageClean() {
  // Replace with API data + route params
  const flock = useMemo(
    () => ({
      id: "LYR-PRIME-2026-Q1",
      farm: { name: "Prime Estate", location: "Odeda, Ogun State, NG" },
      house: "Layer House A1",
      strain: "ISA Brown",
      housingType: "Battery Cage",
      placementDate: "2026-01-12",
      expectedCullingAgeWeeks: 72,

      birds: { opening: 5000, live: 4720, mortalityPct: 5.6, uniformityPct: 92 },

      production: {
        todayEggs: 4160,
        hdpPct: 88.1,
        avgEggWeightG: 62,
        rejectsPct: 2.4,
        weeklyAvgEggs: 4120,
        peakAchieved: true,
        trend: "Stable",
        gradingPct: { small: 8, medium: 34, large: 46, xl: 12 },
      },

      feed: {
        type: "Layer Mash",
        proteinPct: 16.5,
        calciumPct: 3.8,
        intakePerBirdG: 115,
        totalPerDayKg: 543,
        fcr: 2.15,
      },

      water: { intakePerBirdMl: 230, source: "Borehole + Reservoir", treatment: "Chlorination" },

      health: {
        vaccinations: [
          { id: "v1", name: "Newcastle", status: "Completed" },
          { id: "v2", name: "Gumboro", status: "Completed" },
          { id: "v3", name: "Fowl Pox", status: "Completed" },
          { id: "v4", name: "Deworming", status: "Last done 14 days ago" },
        ],
        observations: [
          { id: "o1", k: "Respiratory symptoms", v: "None" },
          { id: "o2", k: "Feather pecking", v: "Mild" },
          { id: "o3", k: "Egg Drop Syndrome", v: "No" },
        ],
        biosecurity: [
          { id: "b1", k: "Footbath compliance", v: "Yes" },
          { id: "b2", k: "Visitor log", v: "Active" },
          { id: "b3", k: "Entry restriction", v: "Enforced" },
        ],
      },

      finance: {
        eggsSoldMonthly: 122000,
        avgPricePerEgg: 180,
        costs: { feed: 9450000, medsVet: 380000, laborUtilities: 620000 },
      },

      alerts: {
        thresholds: { mortalityDailyPct: 0.2, hdpMinPct: 80, feedVarPct: 5, waterVarPct: 10 },
        active: [], // [{id:"a1", type:"warning", title:"HDP below 80%", detail:"..."}]
      },

      audit: [
        {
          id: "a1",
          at: "2026-01-20 09:12",
          by: "POULTRY_MANAGER",
          action: "Recorded daily production",
          detail: "Eggs=4,160 • Rejects=2.4%",
        },
        {
          id: "a2",
          at: "2026-01-19 17:33",
          by: "FARM_ADMIN",
          action: "Logged feed delivery",
          detail: "Delivery=1,500kg • Batch=FM-2026-01-19",
        },
      ],
    }),
    []
  );

  const ageWeeks = useMemo(() => weeksSince(flock.placementDate), [flock.placementDate]);

  const revenue = useMemo(
    () => flock.finance.eggsSoldMonthly * flock.finance.avgPricePerEgg,
    [flock.finance.eggsSoldMonthly, flock.finance.avgPricePerEgg]
  );

  const totalCosts = useMemo(() => {
    const c = flock.finance.costs;
    return n(c.feed) + n(c.medsVet) + n(c.laborUtilities);
  }, [flock.finance.costs]);

  const net = useMemo(() => revenue - totalCosts, [revenue, totalCosts]);
  const profitPerBird = useMemo(() => net / Math.max(1, flock.birds.live), [net, flock.birds.live]);

  const statusTone = flock.alerts.active.some((x) => x.type === "critical")
    ? "danger"
    : flock.alerts.active.some((x) => x.type === "warning")
    ? "warning"
    : "success";

  const statusLabel =
    statusTone === "success" ? "Healthy" : statusTone === "warning" ? "Attention" : "Critical";

  const [tab, setTab] = useState("overview");

  const onAction = (key) => {
    // replace with modal / route navigation
    // eslint-disable-next-line no-alert
    alert(`Action: ${key}`);
  };

  const onExport = (type) => {
    // replace with export endpoint
    // eslint-disable-next-line no-alert
    alert(`Export: ${type}`);
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="page__header">
        <div className="page__crumbs">
          <span>Poultry</span>
          <span className="sep">/</span>
          <span>Layers</span>
          <span className="sep">/</span>
          <span className="active">{flock.id}</span>
        </div>

        <div className="page__titleRow">
          <div className="page__titleBlock">
            <h1 className="page__title">Layers Flock</h1>
            <div className="page__sub">
              {flock.farm.name} • {flock.house} • {flock.strain} • {flock.housingType}
            </div>
          </div>

          <div className="page__actions">
            <Pill tone={statusTone}>{statusLabel}</Pill>
            <Button tone="ghost" type="button" onClick={() => onExport("CSV")}>
              Export CSV
            </Button>
            <Button tone="ghost" type="button" onClick={() => onExport("Excel")}>
              Export Excel
            </Button>
            <Button tone="ghost" type="button" onClick={() => onExport("PDF")}>
              Export PDF
            </Button>
            <Button tone="primary" type="button" onClick={() => onAction("record_today")}>
              Record Today
            </Button>
          </div>
        </div>
      </header>

      {/* KPI Strip */}
      <section className="kpiStrip">
        <KPI label="Eggs Today" value={fmtInt(flock.production.todayEggs)} meta="Collected today" />
        <KPI label="HDP" value={fmtPct(flock.production.hdpPct, 1)} meta="Hen Day Production" />
        <KPI label="Avg Egg Weight" value={`${fmtInt(flock.production.avgEggWeightG)} g`} meta="Average weight" />
        <KPI label="Rejects" value={fmtPct(flock.production.rejectsPct, 1)} meta="Cracked / rejects" />
      </section>

      {/* Tabs */}
      <div className="tabsBar">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { label: "Overview", value: "overview" },
            { label: "Production", value: "production" },
            { label: "Feed & Water", value: "feed" },
            { label: "Health", value: "health" },
            { label: "Finance", value: "finance" },
            { label: "Alerts", value: "alerts" },
            { label: "Audit", value: "audit" },
          ]}
        />
      </div>

      {/* Body */}
      {tab === "overview" && (
        <div className="grid grid--2">
          <Card
            title="Flock Summary"
            action={
              flock.production.peakAchieved ? (
                <Pill tone="success">Peak achieved</Pill>
              ) : (
                <Pill tone="warning">Not at peak</Pill>
              )
            }
          >
            <div className="rows">
              <RowKV k="Flock ID" v={flock.id} />
              <RowKV k="Farm" v={`${flock.farm.name} • ${flock.farm.location}`} />
              <RowKV k="Placement date" v={flock.placementDate} />
              <RowKV k="Age" v={`${fmtInt(ageWeeks)} weeks`} />
              <RowKV k="Culling plan" v={`${fmtInt(flock.expectedCullingAgeWeeks)} weeks (target)`} />
              <RowKV k="Weekly average eggs" v={fmtInt(flock.production.weeklyAvgEggs)} />
              <RowKV k="Trend" v={flock.production.trend} />
            </div>

            <div className="split">
              <div className="split__col">
                <div className="miniTitle">Birds</div>
                <div className="rows">
                  <RowKV k="Opening stock" v={fmtInt(flock.birds.opening)} />
                  <RowKV k="Live birds" v={fmtInt(flock.birds.live)} />
                  <RowKV k="Mortality" v={fmtPct(flock.birds.mortalityPct, 1)} />
                  <RowKV k="Uniformity" v={fmtPct(flock.birds.uniformityPct, 0)} />
                </div>
              </div>

              <div className="split__col">
                <div className="miniTitle">Egg grading</div>
                <div className="rows">
                  <RowKV k="Small" v={fmtPct(flock.production.gradingPct.small, 0)} />
                  <RowKV k="Medium" v={fmtPct(flock.production.gradingPct.medium, 0)} />
                  <RowKV k="Large" v={fmtPct(flock.production.gradingPct.large, 0)} />
                  <RowKV k="Extra-large" v={fmtPct(flock.production.gradingPct.xl, 0)} />
                </div>
              </div>
            </div>

            <SectionHint>
              Keep HDP ≥ {fmtInt(flock.alerts.thresholds.hdpMinPct)}% and maintain stable feed/water intake to protect egg size
              and shell quality.
            </SectionHint>
          </Card>

          <Card title="Quick Actions">
            <div className="actionsGrid">
              <Button type="button" onClick={() => onAction("record_production")}>
                Record egg production
              </Button>
              <Button tone="ghost" type="button" onClick={() => onAction("log_mortality")}>
                Log mortality
              </Button>
              <Button tone="ghost" type="button" onClick={() => onAction("record_feed")}>
                Record feed delivery
              </Button>
              <Button tone="ghost" type="button" onClick={() => onAction("schedule_vaccine")}>
                Schedule vaccination
              </Button>
              <Button tone="ghost" type="button" onClick={() => onAction("transfer_birds")}>
                Transfer birds
              </Button>
              <Button tone="danger" type="button" onClick={() => onAction("mark_culling")}>
                Mark for culling
              </Button>
            </div>

            <div className="hr" />

            <div className="rows">
              <RowKV k="House" v={flock.house} />
              <RowKV k="Housing type" v={flock.housingType} />
              <RowKV k="Breed/strain" v={flock.strain} />
            </div>
          </Card>
        </div>
      )}

      {tab === "production" && (
        <div className="grid grid--2">
          <Card
            title="Production"
            action={
              <div className="inlineActions">
                <Button type="button" onClick={() => onAction("record_today")}>
                  Record today
                </Button>
                <Button tone="ghost" type="button" onClick={() => onAction("record_grading")}>
                  Record grading
                </Button>
              </div>
            }
          >
            <div className="rows">
              <RowKV k="Eggs today" v={fmtInt(flock.production.todayEggs)} />
              <RowKV k="HDP" v={fmtPct(flock.production.hdpPct, 1)} />
              <RowKV k="Avg egg weight" v={`${fmtInt(flock.production.avgEggWeightG)} g`} />
              <RowKV k="Rejects" v={fmtPct(flock.production.rejectsPct, 1)} />
            </div>

            <SectionHint>
              If HDP drops suddenly, check heat stress, water flow, feed change, disease signs, and lighting schedule.
            </SectionHint>
          </Card>

          <Card title="Recent Logs (sample)">
            <Table
              columns={[
                { key: "date", header: "Date", width: "22%" },
                { key: "eggs", header: "Eggs", width: "16%" },
                { key: "hdp", header: "HDP", width: "16%" },
                { key: "rejects", header: "Rejects", width: "16%" },
                { key: "avgW", header: "Avg weight", width: "16%" },
                { key: "notes", header: "Notes" },
              ]}
              rows={[
                {
                  id: "p1",
                  date: "2026-01-20",
                  eggs: fmtInt(4160),
                  hdp: fmtPct(88.1, 1),
                  rejects: fmtPct(2.4, 1),
                  avgW: "62 g",
                  notes: "Stable",
                },
                {
                  id: "p2",
                  date: "2026-01-19",
                  eggs: fmtInt(4090),
                  hdp: fmtPct(86.7, 1),
                  rejects: fmtPct(2.8, 1),
                  avgW: "61 g",
                  notes: "Heat stress midday",
                },
              ]}
            />
          </Card>
        </div>
      )}

      {tab === "feed" && (
        <div className="grid grid--2">
          <Card
            title="Feed"
            action={
              <div className="inlineActions">
                <Button type="button" onClick={() => onAction("record_feed")}>
                  Record delivery
                </Button>
                <Button tone="ghost" type="button" onClick={() => onAction("feed_variance")}>
                  Variance check
                </Button>
              </div>
            }
          >
            <div className="rows">
              <RowKV k="Feed type" v={flock.feed.type} />
              <RowKV k="Protein" v={fmtPct(flock.feed.proteinPct, 1)} />
              <RowKV k="Calcium" v={fmtPct(flock.feed.calciumPct, 1)} />
              <RowKV k="Intake / bird / day" v={`${fmtInt(flock.feed.intakePerBirdG)} g`} />
              <RowKV k="Total / day" v={`${fmtInt(flock.feed.totalPerDayKg)} kg`} />
              <RowKV k="FCR" v={String(flock.feed.fcr)} />
            </div>

            <SectionHint>
              Keep feed variance within ±{fmtInt(flock.alerts.thresholds.feedVarPct)}%. Sudden drops often indicate heat, water
              issues, or feed quality changes.
            </SectionHint>
          </Card>

          <Card
            title="Water"
            action={
              <div className="inlineActions">
                <Button type="button" onClick={() => onAction("record_water")}>
                  Record quality
                </Button>
                <Button tone="ghost" type="button" onClick={() => onAction("water_anomaly")}>
                  Anomaly check
                </Button>
              </div>
            }
          >
            <div className="rows">
              <RowKV k="Intake / bird / day" v={`${fmtInt(flock.water.intakePerBirdMl)} ml`} />
              <RowKV k="Source" v={flock.water.source} />
              <RowKV k="Treatment" v={flock.water.treatment} />
            </div>

            <SectionHint>
              If water intake drops, check drinker lines, pressure, blockage, temperature, and disinfectant dosage.
            </SectionHint>
          </Card>
        </div>
      )}

      {tab === "health" && (
        <div className="grid grid--2">
          <Card
            title="Vaccination & Treatments"
            action={
              <div className="inlineActions">
                <Button type="button" onClick={() => onAction("schedule_vaccine")}>
                  Schedule
                </Button>
                <Button tone="ghost" type="button" onClick={() => onAction("log_treatment")}>
                  Log treatment
                </Button>
              </div>
            }
          >
            <Table
              columns={[
                { key: "name", header: "Item", width: "60%" },
                {
                  key: "status",
                  header: "Status",
                  render: (r) =>
                    String(r.status).toLowerCase().includes("completed") ? (
                      <Pill tone="success">Completed</Pill>
                    ) : (
                      <Pill tone="neutral">{r.status}</Pill>
                    ),
                },
              ]}
              rows={flock.health.vaccinations}
              empty="No vaccination records."
            />
          </Card>

          <Card title="Observations & Biosecurity">
            <div className="miniTitle">Observations</div>
            <div className="rows">
              {flock.health.observations.map((x) => (
                <RowKV key={x.id} k={x.k} v={x.v} />
              ))}
            </div>

            <div className="hr" />

            <div className="miniTitle">Biosecurity</div>
            <div className="rows">
              {flock.health.biosecurity.map((x) => (
                <RowKV key={x.id} k={x.k} v={x.v} />
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "finance" && (
        <div className="grid grid--2">
          <Card title="Revenue">
            <div className="rows">
              <RowKV k="Eggs sold (monthly)" v={fmtInt(flock.finance.eggsSoldMonthly)} />
              <RowKV k="Average price" v={`${fmtMoney(flock.finance.avgPricePerEgg)} / egg`} />
              <RowKV k="Monthly revenue" v={fmtMoney(revenue)} />
            </div>
            <SectionHint>Connect this to Sales Orders and Dispatch to reconcile quantities and cash.</SectionHint>
          </Card>

          <Card title="Costs & Net Contribution">
            <div className="rows">
              <RowKV k="Feed cost" v={fmtMoney(flock.finance.costs.feed)} />
              <RowKV k="Medications & vet" v={fmtMoney(flock.finance.costs.medsVet)} />
              <RowKV k="Labor & utilities" v={fmtMoney(flock.finance.costs.laborUtilities)} />
              <RowKV k="Total costs" v={fmtMoney(totalCosts)} />
              <RowKV k="Net flock profit" v={fmtMoney(net)} />
              <RowKV k="Profit per bird / month" v={fmtMoney(profitPerBird)} />
            </div>
            <SectionHint>Use “cost per egg” for benchmarking across houses and farms.</SectionHint>
          </Card>
        </div>
      )}

      {tab === "alerts" && (
        <div className="grid grid--2">
          <Card title="Active Alerts">
            {flock.alerts.active?.length ? (
              <div className="alerts">
                {flock.alerts.active.map((a) => (
                  <div key={a.id} className={`alert alert--${a.type || "warning"}`}>
                    <div className="alert__title">{a.title}</div>
                    {a.detail ? <div className="alert__detail">{a.detail}</div> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <div className="empty__title">No alerts</div>
                <div className="empty__sub">All monitored indicators are within safe thresholds.</div>
              </div>
            )}

            <SectionHint>
              Thresholds: Mortality &gt; {fmtPct(flock.alerts.thresholds.mortalityDailyPct, 1)} / day • HDP &lt;{" "}
              {fmtPct(flock.alerts.thresholds.hdpMinPct, 0)} • Feed variance ±{fmtPct(flock.alerts.thresholds.feedVarPct, 0)} •
              Water variance ±{fmtPct(flock.alerts.thresholds.waterVarPct, 0)}
            </SectionHint>
          </Card>

          <Card title="Recommended Checks">
            <div className="list">
              <button type="button" className="list__item" onClick={() => onAction("review_mortality_14d")}>
                Review mortality (last 14 days)
              </button>
              <button type="button" className="list__item" onClick={() => onAction("compare_feed_curve")}>
                Compare feed intake vs target curve
              </button>
              <button type="button" className="list__item" onClick={() => onAction("check_water_lines")}>
                Inspect drinker lines and pressure
              </button>
              <button type="button" className="list__item" onClick={() => onAction("heat_stress_check")}>
                Run heat-stress checklist
              </button>
            </div>
          </Card>
        </div>
      )}

      {tab === "audit" && (
        <div className="grid grid--1">
          <Card
            title="Audit Trail"
            action={
              <Button tone="ghost" type="button" onClick={() => onExport("Audit PDF")}>
                Export audit
              </Button>
            }
          >
            <Table
              columns={[
                { key: "at", header: "Timestamp", width: "22%" },
                { key: "by", header: "User/Role", width: "18%" },
                { key: "action", header: "Action", width: "26%" },
                { key: "detail", header: "Details" },
              ]}
              rows={flock.audit}
              empty="No audit records."
            />
            <SectionHint>Store actor identity + timestamps + before/after deltas. Prefer append-only logs.</SectionHint>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="page__footer">
        <div className="page__footerLeft">
          <span className="muted">
            Modules: Poultry → Layers • Inventory (Eggs/Feed) • Sales Orders • Finance • Compliance
          </span>
        </div>
        <div className="page__footerRight">
          <Button tone="ghost" type="button" onClick={() => onAction("open_egg_inventory")}>
            Egg Inventory
          </Button>
          <Button tone="ghost" type="button" onClick={() => onAction("open_feed_inventory")}>
            Feed Inventory
          </Button>
          <Button tone="primary" type="button" onClick={() => onAction("open_dispatch")}>
            Egg Dispatch
          </Button>
        </div>
      </footer>
    </div>
  );
}
