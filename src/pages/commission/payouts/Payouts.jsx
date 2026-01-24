import React, { useMemo, useState } from "react";
// import { useData } from "../../dataContext";
import Card from "../../../components/ui/Card";
import Pill from "../../../components/ui/Pill";
import Table from "../../../components/ui/Table";
import Input from "../../../components/ui/forms/Input";
import Select from "../../../components/ui/forms/Select";
import { useData } from "../../../context/DataContext";
import { Toolbar } from "../../../components/ui/Toolbar";
// import { Card, Pill, Table, Toolbar, Input, Select, money } from "./commissionUi";


function tone(s) {
  if (s === "PAID") return "ok";
  if (s === "DRAFT") return "warn";
  return "neutral";
}

const money = (n, c = "NGN") =>
  `${c} ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;


export default function CommissionPayouts() {
  const { commissionState } = useData();
  const c = commissionState.data?.commission;

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const payouts = c?.payouts || [];
  const agents = c?.agents || [];

  const agentById = useMemo(() => {
    const m = new Map();
    agents.forEach((a) => m.set(a.id, a));
    return m;
  }, [agents]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return payouts
      .filter((p) => status === "ALL" ? true : p.status === status)
      .filter((p) => {
        if (!qq) return true;
        return (p.id || "").toLowerCase().includes(qq) || (p.period || "").toLowerCase().includes(qq);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [payouts, q, status]);

  const rows = filtered.map((p) => {
    const total = (p.lines || []).reduce((s, l) => s + (l.amount || 0), 0);
    const agentsCount = (p.lines || []).length;
    const createdAt = p.createdAt ? new Date(p.createdAt).toLocaleString() : "—";

    const top = (p.lines || []).slice(0, 2).map((l) => {
      const a = agentById.get(l.agentId);
      return `${a?.name || l.agentId}: ${money(l.amount)}`;
    }).join(" • ") + ((p.lines || []).length > 2 ? " • …" : "");

    return [
      <div key="id">
        <div style={{ fontWeight: 950, color: "#0f172a" }}>{p.id}</div>
        <div className="muted" style={{ fontSize: 12 }}>{p.period} • {createdAt}</div>
      </div>,
      <Pill key="st" tone={tone(p.status)}>{p.status}</Pill>,
      <div key="sum">
        <div style={{ fontWeight: 950 }}>{money(total)}</div>
        <div className="muted" style={{ fontSize: 12 }}>{agentsCount} agent(s)</div>
      </div>,
      <div key="lines" className="muted" style={{ fontSize: 12 }}>{top || "—"}</div>,
      <div key="act" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="btn">Export</button>
        <button className="btn primary">Open</button>
      </div>
    ];
  });

  return (
    <div className="page">
      <div className="pageTop">
        <div>
          <div className="pageTitle">Payouts</div>
          <div className="pageMeta"><span className="muted">Create, review and export agent payouts</span></div>
        </div>
        <div className="pageActions">
          <button className="btn primary">Create payout</button>
        </div>
      </div>

      <Card title="Payout register" subtitle="Draft → Paid">
        {/* <Toolbar
          left={
            <>
              <Input value={q} onChange={setQ} placeholder="Search payout id / period…" />
              <Select value={status} onChange={setStatus} options={[
                { value: "ALL", label: "All statuses" },
                { value: "DRAFT", label: "Draft" },
                { value: "PAID", label: "Paid" }
              ]} />
            </>
          }
          right={<button className="btn">Bank format</button>}
        /> */}

        <Table
          columns={["Payout", "Status", "Total", "Top lines", "Actions"]}
          grid="1.2fr 0.8fr 0.9fr 1.4fr 1fr"
          rows={rows}
        />
      </Card>
    </div>
  );
}
