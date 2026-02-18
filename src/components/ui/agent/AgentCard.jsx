import React, { useMemo } from "react";
import "./agent-card.scss";
import { Button } from "../buttons/Buttons";
import { GoDotFill } from "react-icons/go";

const ngn = (n) => `₦${Number(n || 0).toLocaleString()}`;

function pct(v) {
  const x = Number(v || 0);
  return `${Math.round(x * 100)}%`;
}

function TierBadge({ tier = "BRONZE" }) {
  return <span className={`tierBadge ${tier.toLowerCase()}`}>{tier}</span>;
}

export default function AgentCard({ agent, storeNameMap = {}, onView, onEdit, onToggle }) {
  const {
    name,
    id,
    type,
    status,
    phone,
    tier,
    tierMonth,
    tierMetrics,
    channels,
    assignedStores,
    lastActiveAt
  } = agent || {};

  const storeLabels = useMemo(() => {
    const list = Array.isArray(assignedStores) ? assignedStores : [];
    return list.map((sid) => storeNameMap[sid] || sid);
  }, [assignedStores, storeNameMap]);

  return (
    <div className="agentCard">
      <div className="agentHead">
        <div className="agentLeft">
          <div className="agentNameRow">
            <div className="agentNameRow1">
              <div className="agentName">{name}</div>
            </div>

            <div className="agentNameRow2">
              <TierBadge tier={tier} />
              <span className={`statusPill ${String(status || "").toLowerCase()}`}>{status}</span>
            </div>
            
          </div>

          <div className="agentMeta">
            {/* <span className="agentId">{id}</span> */}
            {/* <GoDotFill /> */}
            <span>{phone}</span>
          </div>
        </div>

        <div className="agentRight">
          <div className="miniStat">
            <div className="k">Monthly Net</div>
            <div className="v">{ngn(tierMetrics?.monthlyNet)}</div>
          </div>
          <div className="miniStat">
            <div className="k">Orders</div>
            <div className="v">{tierMetrics?.monthlyOrders ?? 0}</div>
          </div>
        </div>

      </div>

      <div className="divider" />

      <div className="agentGrid">
        <div className="block">
          <div className="label">Performance ({tierMonth || "—"})</div>
          <div className="pills">
            <span className="pill">Distinct: {tierMetrics?.distinctProducts ?? 0}</span>
            <span className="pill">On-time: {pct(tierMetrics?.onTimeCloseRate)}</span>
          </div>
        </div>

        <div className="block">
          <div className="label">Channels</div>
          <div className="pills">
            {(channels || []).slice(0, 4).map((ch) => (
              <span className="pill pillSoft" key={ch}>{ch}</span>
            ))}
            {(channels || []).length > 4 ? <span className="pill pillSoft">+{channels.length - 4}</span> : null}
          </div>
        </div>

        {/* <div className="block full">
          <div className="label">Assigned Stores</div>
          <div className="stores">
            {storeLabels.length ? storeLabels.map((s) => (
              <span className="storeTag" key={s}>{s}</span>
            )) : <span className="muted">No assigned stores</span>}
          </div>
        </div> */}

        <div className="block full">
          <div className="label">Last Active</div>
          <div className="muted">
            {lastActiveAt ? new Date(lastActiveAt).toLocaleString() : "—"}
          </div>
        </div>

      </div>

      <div className="actions">
        <Button variant="ghost" text="View" action={onView} />
        <Button variant="" text="Edit" action={onEdit} />
        <Button
          variant={`btn ${status === "ACTIVE" ? "danger" : "success"}`}
          text={status === "ACTIVE" ? "Disable" : "Activate"}
          action={onToggle}
        />
      </div>
    </div>
  );
}
