import React, { useMemo, useState } from "react";
// import { Card, Pill, Table, Toolbar, Input, Select, int } from "./commissionUi";
import { useData } from "../../../context/DataContext";
import Card from "../../../components/ui/Card";
import Pill from "../../../components/ui/Pill";
import Table from "../../../components/ui/Table";
import Input from "../../../components/ui/forms/Input";
import Select from "../../../components/ui/forms/Select";
import { Toolbar } from "../../../components/ui/Toolbar";
import { fmtInt } from "../../../utils/methods";










function toneStatus(s) {
  if (s === "ACTIVE") return "ok";
  if (s === "SUSPENDED") return "warn";
  return "neutral";
}

export default function AgentsList() {
  const { commissionState } = useData();
  const c = commissionState.data?.commission;

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");

  const agents = c?.agents || [];

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return agents
      .filter((a) => status === "ALL" ? true : a.status === status)
      .filter((a) => type === "ALL" ? true : a.type === type)
      .filter((a) => {
        if (!qq) return true;
        return (
          (a.name || "").toLowerCase().includes(qq) ||
          (a.id || "").toLowerCase().includes(qq) ||
          (a.phone || "").toLowerCase().includes(qq)
        );
      });
  }, [agents, q, status, type]);

  const rows = filtered.map((a) => {
    const stores = (a.assignedStores || []).slice(0, 2).join(", ") + ((a.assignedStores || []).length > 2 ? "…" : "");
    const channels = (a.channels || []).join(", ");
    return [
      <div key="id">
        <div style={{ fontWeight: 950, color: "#0f172a" }}>{a.name}</div>
        <div className="muted" style={{ fontSize: 12 }}>{a.id} • {a.phone}</div>
      </div>,
      <Pill key="t" tone="neutral">{a.type}</Pill>,
      <Pill key="s" tone={toneStatus(a.status)}>{a.status}</Pill>,
      <div key="c">
        <div style={{ fontWeight: 900 }}>{channels || "—"}</div>
        <div className="muted" style={{ fontSize: 12 }}>Stores: {stores || "—"}</div>
      </div>,
      <div key="b">
        <div style={{ fontWeight: 900 }}>{a.bank?.name || "—"}</div>
        <div className="muted" style={{ fontSize: 12 }}>{a.bank?.accountNumber || "—"}</div>
      </div>,
      <button key="act" className="btn">View</button>
    ];
  });

  return (
    <div className="page">
      <div className="pageTop">
        <div>
          <div className="pageTitle">Agents</div>
          <div className="pageMeta"><span className="muted">{fmtInt(filtered.length)} agents</span></div>
        </div>
        <div className="pageActions">
          <button className="btn primary">New Agent</button>
        </div>
      </div>

      <Card
        title="Agent directory"
        subtitle="Field agents and referral partners"
        right={<Pill tone={commissionState.fromCache ? "neutral" : "ok"}>{commissionState.fromCache ? "Cached" : "Live"}</Pill>}
      >
        {/* <Toolbar
          left={
            <>
              <Input value={q} onChange={setQ} placeholder="Search name / id / phone…" />
              <Select value={status} onChange={setStatus} options={[
                { value: "ALL", label: "All statuses" },
                { value: "ACTIVE", label: "Active" },
                { value: "SUSPENDED", label: "Suspended" }
              ]} />
              <Select value={type} onChange={setType} options={[
                { value: "ALL", label: "All types" },
                { value: "FIELD_AGENT", label: "Field Agent" },
                { value: "AFFILIATE", label: "Affiliate" }
              ]} />
            </>
          }
          right={<button className="btn">Export</button>}
        /> */}

        <Table
          columns={["Agent", "Type", "Status", "Channels / Stores", "Bank", ""]}
          grid="1.3fr 0.8fr 0.8fr 1.4fr 1.1fr 0.5fr"
          rows={rows}
        />
      </Card>
    </div>
  );
}
