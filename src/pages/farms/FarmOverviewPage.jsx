import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Pill from "../../components/ui/Pill";
import KPI from "../../components/ui/Kpi";
import MiniBar from "../../components/ui/Minibar";
import Table from "../../components/ui/Table";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { FARMS, STORES } from "../../app/orgMap";
import { buildTo, ROUTES } from "../../app/routeRegistry";
import { PERM } from "../../app/perms";
import { fmtInt, fmtNaira, formatDate, computeHouseHealth } from "../../utils/methods";
import Card from "../../components/ui/Card";
import "./overviews.scss";






function storeName(storeId) {
  return STORES?.find((s) => s.id === storeId)?.name || storeId;
}

function slaBadge(status) {
  if (status === "ontime") return <Pill tone="ok">On-time</Pill>;
  if (status === "risk") return <Pill tone="warn">At risk</Pill>;
  return <Pill tone="risk">SLA breach</Pill>;
}



export default function FarmOverviewPage() {

  const { farmId } = useParams();
  const { can, inFarmScope } = useAuth();
  const { farmState, activeContext } = useData();

  const farm = FARMS.find((f) => f.id === farmId);

  // Ensure correct context + correct cached payload
  const payload = farmState.data;

  const isThisFarm = activeContext?.type === "farm" && payload?.farmId === farmId;

  // console.log(payload, isThisFarm, farmId);

  const loading = farmState.status === "loading";
  const error = farmState.status === "error";

  const k = isThisFarm ? payload?.kpis : null;
  const ov = isThisFarm ? payload?.overview : null;

  const houses = ov?.houses || [];
  const crops = ov?.crops || [];
  const transfers = ov?.transfers || [];
  const compliance = ov?.compliance || { biosecurityCompletion: 0, visitorLog: [], vaccinationsDue: [] };

  const lastSync = k?.lastSyncAt ? new Date(k.lastSyncAt).toLocaleString() : "—";

  const caps = useMemo(() => {
    // Prefer orgMap capabilities if present; otherwise infer from data existence
    const orgCaps = farm?.capabilities;
    if (orgCaps) return orgCaps;
    return {
      hatchery: !!payload?.poultry?.hatchery, // optional
      breeders: !!payload?.poultry?.breeders,
      feedMill: false
    };
  }, [farm, payload]);

  if (!farm) {
    return (
      <div className="page">
        <div className="pageTitle">Farm not found</div>
        <div className="proCard"><div className="muted">Unknown farmId: {farmId}</div></div>
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

  // Quick links (hide by permission + route availability)
  const quickLinks = [
    { key: "FARM_POULTRY_HOME", label: "Poultry Overview", perm: PERM.POULTRY_VIEW },
    { key: "LAYERS_FLOCKS", label: "Layers Flocks", perm: PERM.LAYERS_VIEW },
    { key: "LAYERS_EGG_COLLECTION", label: "Egg Collection", perm: PERM.LAYERS_VIEW },
    { key: "BROILERS_BATCHES", label: "Broilers Batches", perm: PERM.BROILERS_VIEW },
    { key: "BREEDERS_HOME", label: "Breeders", perm: PERM.BREEDERS_VIEW, requires: caps?.breeders },
    { key: "HATCHERY_HOME", label: "Hatchery", perm: PERM.HATCHERY_VIEW, requires: caps?.hatchery },
    { key: "FARM_CROPS_HOME", label: "Crops Overview", perm: PERM.CROPS_VIEW },
    { key: "FARM_INV_ITEMS", label: "Inventory", perm: PERM.INVENTORY_VIEW },
    { key: "FARM_TRANSFERS_OUT", label: "Transfers Out", perm: PERM.TRANSFERS_VIEW },
    { key: "FARM_FIN_EXPENSES", label: "Expenses", perm: PERM.FIN_VIEW }
  ]
    .filter((x) => x.requires === undefined ? true : !!x.requires)
    .filter((x) => !x.perm || can(x.perm))
    .filter((x) => ROUTES?.[x.key]);

  const finance = k?.finance || {};
  const gmTone = (finance.grossMargin ?? 0) >= 35 ? "ok" : "warn";

  const kpiMortTone = (k?.mortality7d ?? 0) <= 0.5 ? "ok" : (k?.mortality7d ?? 0) <= 0.7 ? "warn" : "risk";

  const bio = compliance.biosecurityCompletion ?? 0;
  const bioTone = bio >= 90 ? "ok" : bio >= 80 ? "warn" : "risk";

  // Tables
  const productionRows = [
    ["Eggs (today)", fmtInt(k?.eggToday), <MiniBar key="b1" value={k?.eggToday} max={16000} />],
    ["Lay rate", `${k?.layRate ?? 0}%`, <MiniBar key="b2" value={k?.layRate} max={100} />],
    ["Feed use (t/week)", fmtInt(k?.feedTonsWeek), <MiniBar key="b3" value={k?.feedTonsWeek} max={40} />],
    ["Water use (m³/day)", fmtInt(k?.waterM3Day), <MiniBar key="b4" value={k?.waterM3Day} max={10} />]
  ];

  const houseRows = houses.slice(0, 4).map((h) => {
    const health = computeHouseHealth(h);
    return [
      <div key="house">
        <div style={{ fontWeight: 900, color: "#0f172a" }}>{h.name}</div>
        <div className="muted" style={{ fontSize: 12 }}>Flock age: {h.flockAgeWeeks}w</div>
      </div>,
      <div key="fe">
        <div style={{ fontWeight: 900 }}>{(h.feedPerEgg ?? 0).toFixed(3)} kg/egg</div>
        <div className="muted" style={{ fontSize: 12 }}>Target ≤ 0.170</div>
      </div>,
      <div key="m">
        <div style={{ fontWeight: 900 }}>{(h.mort7d ?? 0).toFixed(2)}%</div>
        <div className="muted" style={{ fontSize: 12 }}>7-day</div>
      </div>,
      <div key="e">
        <div style={{ fontWeight: 900 }}>{(h.eggSizeG ?? 0).toFixed(1)} g</div>
        <div className="muted" style={{ fontSize: 12 }}>Avg size</div>
      </div>,
      <div key="s" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Pill tone={health.overall}>{health.overall === "ok" ? "Healthy" : health.overall === "warn" ? "Watch" : "Action"}</Pill>
        <Pill tone={health.feTone}>FE</Pill>
        <Pill tone={health.mTone}>Mort</Pill>
        <Pill tone={health.eTone}>Egg</Pill>
      </div>
    ];
  });

  const cropRows = crops.map((b) => {
    const stage = (b.stage || "").toLowerCase();
    const tone =
      stage.includes("harvest") ? "ok" :
      stage.includes("fruit") || stage.includes("flower") ? "warn" :
      "neutral";

    return [
      <span key="blk" style={{ fontWeight: 900 }}>{b.block}</span>,
      b.crop,
      <Pill key="st" tone={tone}>{b.stage}</Pill>,
      `${b.daysInStage ?? 0} days`,
      <span key="eh" style={{ fontWeight: 900 }}>{formatDate(b.expectedHarvestAt)}</span>
    ];
  });

  const transferRows = transfers.map((t) => {
    const lines = t.lines || [];
    const totalUnits = lines.reduce((s, x) => s + (x.qty || 0), 0);

    const topItems = lines.slice(0, 2).map((x) => `${x.name}: ${fmtInt(x.qty)} ${x.uom}`).join(" • ")
      + (lines.length > 2 ? " • …" : "");

    return [
      <div key="no">
        <div style={{ fontWeight: 900, color: "#0f172a" }}>{t.transferNo}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          Created {t.ageHrs}h ago • SLA {t.slaHours}h
        </div>
      </div>,
      storeName(t.toStoreId),
      <div key="qty">
        <div style={{ fontWeight: 900 }}>{fmtInt(totalUnits)}</div>
        <div className="muted" style={{ fontSize: 12 }}>items: {lines.length}</div>
      </div>,
      slaBadge(t.status),
      <div key="items" className="muted" style={{ fontSize: 12 }}>{topItems}</div>
    ];
  });

  return (
    <div className="page">
      {/* Header */}
      <div className="pageTop">
        <div>
          <div className="pageTitle">{farm.name} — Farm Overview</div>
          <div className="pageMeta">
            <span className="muted">{farm.location}</span>
            <span className="dotSep">•</span>
            <span className="muted">Last sync: {lastSync}</span>
            {farmState.fromCache ? (
              <>
                <span className="dotSep">•</span>
                <Pill tone="neutral">Cached</Pill>
              </>
            ) : null}
          </div>
        </div>

        <div className="pageActions">
          <button className="btn">Create Task</button>
          <button className="btn">Log Issue</button>
          <button className="btn primary">New Expense</button>
        </div>
      </div>

      {/* Loading / Error / Missing */}
      {loading ? (
        <div className="proCard"><div className="muted">Loading farm overview…</div></div>
      ) : null}

      {error ? (
        <div className="proCard"><div className="errText">{farmState.error}</div></div>
      ) : null}

      {(!loading && !error && !isThisFarm) ? (
        <div className="proCard">
          <div className="muted">
            No data loaded for this farm yet. Switch to {farm.name} (context) to load overview.
          </div>
        </div>
      ) : null}

      {/* Main dashboard (only render if data exists) */}
      {isThisFarm ? (
        <>
          {/* KPI Row */}
          <div className="grid4">
            <div className="proCard kpiCard">
              <KPI label="Layers (active)" value={fmtInt(k.layers)} hint="Live birds" tone="ok" />
            </div>
            <div className="proCard kpiCard">
              <KPI label="Broilers (active)" value={fmtInt(k.broilers)} hint="Live birds" tone="ok" />
            </div>
            <div className="proCard kpiCard">
              <KPI label="Eggs today" value={fmtInt(k.eggToday)} hint={`Lay rate: ${k.layRate}%`} tone="ok" />
            </div>
            <div className="proCard kpiCard">
              <KPI label="Mortality (7d)" value={`${(k.mortality7d ?? 0).toFixed(2)}%`} hint="Target < 0.50%" tone={kpiMortTone} />
            </div>
          </div>

          {/* Snapshot row */}
          <div className="grid2">
            <Card
              title="Operations snapshot"
              subtitle="Production and utilization"
              right={
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Pill tone={caps?.hatchery ? "ok" : "neutral"}>{caps?.hatchery ? "Hatchery Enabled" : "No Hatchery"}</Pill>
                  <Pill tone={caps?.breeders ? "ok" : "neutral"}>{caps?.breeders ? "Breeders Enabled" : "No Breeders"}</Pill>
                </div>
              }
            >
              <Table columns={["Metric", "Value", "Indicator"]} grid="1.2fr 0.8fr 1fr" rows={productionRows} />
            </Card>

            <Card
              title="Finance snapshot (MTD)"
              subtitle="Revenue, costs, margin"
              right={<Pill tone={gmTone}>{finance.grossMargin ?? 0}% GM</Pill>}
            >
              <div className="financeGrid">
                <div className="finBox">
                  <div className="finLabel">Revenue</div>
                  <div className="finValue">{fmtNaira(finance.revenueMTD)}</div>
                  <div className="muted">Eggs, birds, crops, transfers</div>
                </div>
                <div className="finBox">
                  <div className="finLabel">COGS</div>
                  <div className="finValue">{fmtNaira(finance.cogsMTD)}</div>
                  <div className="muted">Feed, chicks, meds, packaging</div>
                </div>
                <div className="finBox">
                  <div className="finLabel">OPEX</div>
                  <div className="finValue">{fmtNaira(finance.opexMTD)}</div>
                  <div className="muted">Diesel, payroll allocation</div>
                </div>
              </div>
              <div className="muted" style={{ marginTop: 10 }}>
                Track feed variance per house weekly to protect margin.
              </div>
            </Card>
          </div>

          {/* House performance */}
          <Card
            title="Layers performance (House 1–4)"
            subtitle="Feed/egg ratio, mortality, egg size — identify underperforming houses quickly"
            right={<Pill tone="neutral">Daily ops</Pill>}
          >
            <Table
              columns={["House", "Feed/Egg", "Mortality", "Egg size", "Status"]}
              grid="1.15fr 0.95fr 0.75fr 0.75fr 1.4fr"
              rows={houseRows}
            />
            <div className="muted" style={{ marginTop: 10 }}>
              FE = kg feed per egg (lower is better). Mortality is 7-day %. Egg size in grams.
            </div>
          </Card>

          {/* Crops + Transfers */}
          <div className="grid2">
            <Card
              title="Crop block map"
              subtitle="Block, crop, stage, days-in-stage, expected harvest"
              right={<Pill tone="neutral">Field ops</Pill>}
            >
              <Table
                columns={["Block", "Crop", "Stage", "Days", "Expected harvest"]}
                grid="0.55fr 1.2fr 0.9fr 0.8fr 1fr"
                rows={cropRows}
              />
            </Card>

            <Card
              title="Transfer pipeline"
              subtitle="Farm → Stores pending quantities and SLA timers"
              right={<Pill tone="neutral">Logistics</Pill>}
            >
              <Table
                columns={["Transfer", "Destination", "Qty", "SLA", "Top items"]}
                grid="1.1fr 1fr 0.75fr 0.75fr 1.4fr"
                rows={transferRows}
              />
              <div className="muted" style={{ marginTop: 10 }}>
                SLA: On-time (&lt;75%), At risk (75–100%), Breach (&gt;100%).
              </div>
            </Card>
          </div>

          {/* Compliance row */}
          <div className="grid3">
            <Card
              title="Biosecurity compliance"
              subtitle="Checklist completion (today)"
              right={<Pill tone={bioTone}>{bio}%</Pill>}
            >
              <div className="complianceBar">
                <div className="complianceBarFill" style={{ width: `${bio}%` }} />
              </div>
              <div className="muted" style={{ marginTop: 10 }}>
                Target ≥ 90% daily completion (visitor control, PPE, footbaths, house entry logs).
              </div>
            </Card>

            <Card
              title="Visitor log"
              subtitle="Today’s external access"
              right={<Pill tone="neutral">{(compliance.visitorLog || []).length} visits</Pill>}
            >
              <div className="activityList">
                {(compliance.visitorLog || []).length === 0 ? (
                  <div className="muted">No visitors recorded.</div>
                ) : (
                  (compliance.visitorLog || []).map((v, i) => (
                    <div key={i} className="activityRow" style={{ gridTemplateColumns: "70px 1fr 120px" }}>
                      <div className="activityTime">{v.time}</div>
                      <div className="activityBody">
                        <div className="activityWho">{v.name}</div>
                        <div className="muted">{v.purpose}</div>
                      </div>
                      <div className="activityTag"><Pill tone="neutral">{v.status}</Pill></div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card
              title="Vaccinations due"
              subtitle="Next 7 days"
              right={<Pill tone={(compliance.vaccinationsDue || []).length ? "warn" : "ok"}>{(compliance.vaccinationsDue || []).length} due</Pill>}
            >
              {(compliance.vaccinationsDue || []).length === 0 ? (
                <div className="muted">No vaccinations due in the next 7 days.</div>
              ) : (
                <div className="listRows">
                  {(compliance.vaccinationsDue || []).map((v, i) => (
                    <div key={i} className="listRow">
                      <div>
                        <div className="listTitle">{v.unit}</div>
                        <div className="muted">{v.item}</div>
                      </div>
                      <Pill tone={v.dueInDays <= 2 ? "risk" : v.dueInDays <= 4 ? "warn" : "neutral"}>
                        Due in {v.dueInDays}d
                      </Pill>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* (farmId === "prime-estate") &&  */}

          {/* Quick actions */}
          <Card title="Quick actions" subtitle="Jump into modules">
            <div className="quickGrid">
              {quickLinks.map((q) => (
                
                <Link key={q.key} to={buildTo(q.key, { farmId })} className="quickLink">
                  <div className="quickTitle">{q.label}</div>
                  <div className="quickSub">Open</div>
                </Link>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
