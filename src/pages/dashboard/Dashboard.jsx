import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/ui/Card";
import Pill from "../../components/ui/Pill";
import Stat from "../../components/ui/Stat";
import { BigLink } from "../../components/ui/BigLink";
import { PERM } from "../../app/perms";
import Row from "../../components/ui/Row";
import { cx, fmtInt, fmtNaira } from "../../utils/methods";
import { ROUTES } from "../../app/routeRegistry";
import { Link } from "react-router-dom";
import "./dashboard.scss";



export default function Dashboard() {
  const { user, can } = useAuth();
  const { activeContext } = useData();

  // These would ideally come from a "group summary" loader.
  // For now: realistic placeholders + context-aware touches.
  const summary = useMemo(() => {
    const ctx = activeContext;
    const ctxLabel = ctx ? `${ctx.type === "farm" ? "Farm" : "Store"}: ${ctx.name || ctx.id}` : "No context selected";

    return {
      ctxLabel,
      kpis: {
        farms: 3,
        stores: 15,
        eggsToday: 18500,
        transferOpen: 17,
        dispatchesToday: 6,
        cashVarianceToday: 120000,
        revenueMTD: 128400000,
        grossMargin: 34,
      },
      alerts: [
        { tone: "warn", title: "3 transfers nearing SLA breach", body: "Review pending farm→store transfers and confirm dispatch/receipts." },
        { tone: "warn", title: "2 stores missing cash-up", body: "Cash-up not submitted by end of shift. Follow up with store managers." },
        { tone: "neutral", title: "Biosecurity: 1 visitor log incomplete", body: "Prime Estate: vehicle disinfection log missing plate number entry." },
      ],
      news: [
        { tag: "Operations", title: "Cold chain capacity planning", body: "Draft plan ready for central hub cold room expansion (phase 2)." },
        { tag: "Finance", title: "Period close checklist", body: "Week 3 expenses pending approvals across 2 farms." },
        { tag: "Logistics", title: "Route optimization", body: "Trial schedule reduced average delivery time by ~12%." },
      ],
      quickTasks: [
        { title: "Approve transfers", hint: "Inbound confirmations & approvals", perm: PERM.TRANSFERS_APPROVE },
        { title: "Review expenses", hint: "Farm/store postings pending", perm: PERM.FIN_APPROVE },
        { title: "Audit activity log", hint: "Latest security & data events", perm: PERM.AUDIT_READ },
      ],
    };
  }, [activeContext]);

  // Context-aware “open dashboard” link:
  const contextDashboardLink = useMemo(() => {
    if (!activeContext) return "/select-context";
    if (activeContext.type === "farm") return `/app/farms/${activeContext.id}/overview`;
    return `/app/stores/${activeContext.id}/overview`;
  }, [activeContext]);

  // Global navigation cards (hide if user lacks perms)
  const primaryLinks = useMemo(() => {
    const farmId = activeContext?.type === "farm" ? activeContext.id : "prime-estate";
    const storeId = activeContext?.type === "store" ? activeContext.id : "store-ibadan-01";

    const links = [
      {
        show: can?.(PERM.FARM_VIEW),
        to: `/app/farms/${farmId}/overview`,
        title: "Farm performance",
        meta: "Farms",
        desc: "Monitor layers KPIs, crop blocks, compliance, and farm inventory.",
      },
      {
        show: can?.(PERM.STORE_VIEW),
        to: `/app/stores/${storeId}/overview`,
        title: "Store operations",
        meta: "Stores",
        desc: "Track POS, cash-ups, inventory receives, returns, and customer activity.",
      },
      {
        show: can?.(PERM.DISPATCH_VIEW),
        to: ROUTES.LOGISTICS_DISPATCHES?.path || "/app/logistics/dispatches",
        title: "Logistics control",
        meta: "Operations",
        desc: "Dispatch status, trips, and proof-of-delivery across locations.",
      },
      {
        show: can?.(PERM.REPORTS_VIEW),
        to: ROUTES.GROUP_FIN_REPORTS?.path || "/app/finance/reports",
        title: "Group reporting",
        meta: "Finance",
        desc: "MTD performance, margin, cashflow signals, and exception reporting.",
      },
    ];

    return links.filter((l) => l.show !== false);
  }, [activeContext, can]);

  const gmTone = summary.kpis.grossMargin >= 35 ? "ok" : summary.kpis.grossMargin >= 30 ? "warn" : "risk";
  const varTone = summary.kpis.cashVarianceToday <= 0 ? "ok" : summary.kpis.cashVarianceToday <= 100000 ? "warn" : "risk";

  return (
    <div className="page">
      {/* Hero (FedEx-corporate style: crisp headline + core actions) */}
      <div className="corpHero">
        <div className="corpHeroLeft">
          <div className="corpEyebrow">Greenland Enterprise</div>
          <div className="corpTitle">Corporate Dashboard</div>
          <div className="corpSub">
            Organization-wide visibility across farms, stores, logistics, finance, and compliance.
          </div>

          <div className="corpMetaRow">
            <Pill tone="neutral">{summary.ctxLabel}</Pill>
            {user?.role ? <Pill tone="neutral">{user.role}</Pill> : null}
          </div>

          <div className="corpActions">
            <Link className="btn primary" to={contextDashboardLink}>
              Open my dashboard
            </Link>
            <Link className="btn" to="/select-context">
              Switch context
            </Link>
            {can?.(PERM.REPORTS_VIEW) ? (
              <Link className="btn" to={ROUTES.GROUP_FIN_REPORTS?.path || "/app/finance/reports"}>
                View reports
              </Link>
            ) : null}
          </div>
        </div>

        <div className="corpHeroRight">
          <div className="heroPanel">
            <div className="heroPanelTitle">Today at a glance</div>
            <div className="heroGrid">
              <Stat label="Eggs today" value={fmtInt(summary.kpis.eggsToday)} hint="All farms" tone="ok" />
              <Stat label="Open transfers" value={fmtInt(summary.kpis.transferOpen)} hint="Farm → store" tone="warn" />
              <Stat label="Dispatches" value={fmtInt(summary.kpis.dispatchesToday)} hint="Today" tone="neutral" />
              <Stat label="Cash variance" value={fmtNaira(summary.kpis.cashVarianceToday)} hint="Exception" tone={varTone} />
            </div>
          </div>
        </div>
      </div>

      {/* Primary navigation (like corporate home quick action tiles) */}
      <div className="bigLinkGrid">
        {primaryLinks.map((l) => (
          <BigLink key={l.title} to={l.to} title={l.title} desc={l.desc} meta={l.meta} />
        ))}
      </div>

      {/* KPI strip */}
      <div className="kpiStrip">
        <div className="kpiStripItem">
          <div className="kpiStripLabel">Farms</div>
          <div className="kpiStripValue">{fmtInt(summary.kpis.farms)}</div>
        </div>
        <div className="kpiStripItem">
          <div className="kpiStripLabel">Stores</div>
          <div className="kpiStripValue">{fmtInt(summary.kpis.stores)}</div>
        </div>
        <div className="kpiStripItem">
          <div className="kpiStripLabel">Revenue (MTD)</div>
          <div className="kpiStripValue">{fmtNaira(summary.kpis.revenueMTD)}</div>
        </div>
        <div className="kpiStripItem">
          <div className="kpiStripLabel">Gross margin</div>
          <div className="kpiStripValue">
            {summary.kpis.grossMargin}%
            <span className={cx("kpiStripDot", gmTone)} />
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="corpGrid">
        <Card
          title="Priority alerts"
          subtitle="Action items requiring attention"
          right={<Pill tone="warn">{summary.alerts.length} items</Pill>}
        >
          <div className="alertList">
            {summary.alerts.map((a, idx) => (
              <div className={cx("alertRow", a.tone)} key={idx}>
                <div className="alertTitle">{a.title}</div>
                <div className="alertBody">{a.body}</div>
              </div>
            ))}
          </div>

          <div className="dashLinksRow">
            {can?.(PERM.TRANSFERS_VIEW) ? (
              <Link className="miniBtn" to={ROUTES.STORE_TRANSFERS_INBOUND?.path ? "/app/stores/store-ibadan-01/transfers/inbound" : "/app"}>
                Review transfers
              </Link>
            ) : null}
            {can?.(PERM.FIN_APPROVE) ? (
              <Link className="miniBtn" to={ROUTES.GROUP_FIN_APPROVALS?.path || "/app/finance/approvals"}>
                Approvals
              </Link>
            ) : null}
            {can?.(PERM.AUDIT_READ) ? (
              <Link className="miniBtn" to={ROUTES.AUDIT_ACTIVITY?.path || "/app/audit/activity-log"}>
                Audit log
              </Link>
            ) : null}
          </div>
        </Card>

        <Card
          title="Organization highlights"
          subtitle="What’s happening across the business"
          right={<Pill tone="neutral">Weekly</Pill>}
        >
          <div className="newsList">
            {summary.news.map((n, idx) => (
              <div className="newsRow" key={idx}>
                <div className="newsTag">{n.tag}</div>
                <div className="newsMain">
                  <div className="newsTitle">{n.title}</div>
                  <div className="newsBody">{n.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Quick tasks"
          subtitle="Common workflows"
          right={<Pill tone="neutral">Shortcuts</Pill>}
        >
          <div className="taskList">
            {summary.quickTasks
              .filter((t) => !t.perm || can?.(t.perm))
              .map((t, idx) => (
                <div className="taskRow" key={idx}>
                  <div>
                    <div className="taskTitle">{t.title}</div>
                    <div className="muted">{t.hint}</div>
                  </div>
                  <button className="miniBtn">Open</button>
                </div>
              ))}
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Tip: Use role-based shortcuts to keep work focused and reduce navigation.
          </div>
        </Card>

        <Card
          title="Global navigation"
          subtitle="Jump to major areas"
          right={<Pill tone="neutral">Company-wide</Pill>}
        >
          <div className="navList">
            <Row left="Farms overview" right={<Link className="navLink" to={activeContext?.type === "farm" ? `/app/farms/${activeContext.id}/overview` : "/select-context"}>Open</Link>} />
            <Row left="Stores overview" right={<Link className="navLink" to={activeContext?.type === "store" ? `/app/stores/${activeContext.id}/overview` : "/select-context"}>Open</Link>} />
            <Row left="Dispatches" right={<Link className="navLink" to={ROUTES.LOGISTICS_DISPATCHES?.path || "/app/logistics/dispatches"}>Open</Link>} />
            <Row left="Group reports" right={<Link className="navLink" to={ROUTES.GROUP_FIN_REPORTS?.path || "/app/finance/reports"}>Open</Link>} />
            <Row left="HR staff" right={<Link className="navLink" to={ROUTES.HR_STAFF?.path || "/app/hr/staff"}>Open</Link>} />
          </div>
        </Card>
      </div>
    </div>
  );
}