// src/pages/commission/agents/Agents.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./agents.scss";
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { HiStatusOnline } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";

import { useData } from "../../../context/DataContext";
import AgentCard from "../../../components/ui/agent/AgentCard";
import Modal from "../../../components/ui/modal/Modal";
import { ButtonWithLefttIcon, Button } from "../../../components/ui/buttons/Buttons";
import { useCommissionAgentQuery } from "../../../hooks/useCommissionAgentQuery";
import AgentFilters from "../../../components/ui/filters/agent-filters/AgentFilters";
import { AGENT_FILTER_GROUPS } from "../../../data/others";



function Chip({ active, icon: Icon, label, onClick }) {
  return (
    <button type="button" className={`afChip ${active ? "is-active" : ""}`} onClick={onClick}>
      {Icon ? <Icon className="afChip__icon" /> : null}
      <span className="afChip__label">{label}</span>
    </button>
  );
}

function Panel({ align = "left", title, children }) {
  return (
    <div className={`afPanel afPanel--${align}`} role="dialog" aria-label={title || "Filter panel"}>
      {title ? <div className="afPanel__title">{title}</div> : null}
      <div className="afPanel__body">{children}</div>
    </div>
  );
}

function CheckRow({ checked, label, onToggle }) {
  return (
    <label className="afCheckRow">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span>{label}</span>
    </label>
  );
}

export default function Agents() {

  const { commissionState } = useData();

  const { status, error} = useCommissionAgentQuery();

  const [visible, setVisible] = useState([]);
  const [viewAgent, setViewAgent] = useState(null);






  // const filtersActive =
  //   !!q.trim() || statusSet.size > 0 || tierSet.size > 0 || typeSet.size > 0;

  return (
    <div className="page">

      <div className="pageHeader">
        
        <div className="headerActions">
          <ButtonWithLefttIcon
            icon={<FaPlus />}
            text="Create Agent"
            variant="primary"
            action={() => alert("Create Agent")}
          />
        </div>
      </div>

      <div className="page-body">
        {/* Filter Bar */}
        <div className="agents-actions">
          <AgentFilters groups={AGENT_FILTER_GROUPS} onResults={setVisible} />
        </div>
        

        <div className="agents-con">
          {commissionState?.status === "loading" && <p>Loading...</p>}

          {commissionState?.status === "error" && (
            <p style={{ color: "crimson" }}>{commissionState?.error || error}</p>
          )}

           {status === "ready" &&
            (visible?.length ? (
              visible.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onEdit={() => navigate(`/app/commission/agents/${agent.id}/edit`)} />
              ))
            ) : (
              <p>No agents match your filters.</p>
            ))}


        </div>

        {/* Cards */}
        {/* <div className="agentsGrid">
          {commissionState?.status === "loading" ? (
            <p>Loading agents…</p>
          ) : !filteredAgents.length ? (
            <div className="emptyState">
              <div className="emptyTitle">No agents found</div>
              <div className="emptySub">
                Try clearing filters or adding a new agent.
              </div>
              <div style={{ marginTop: 12 }}>
                <Button text="Clear Filters" variant="secondary" action={clearAll} />
              </div>
            </div>
          ) : (
            filteredAgents.map((a) => (
              <AgentCard
                key={a.id}
                agent={a}
                storeNameMap={storeNameMap}
                onView={() => setViewAgent(a)}
                onEdit={() => alert(`Edit ${a.name}`)}
                onToggle={() => alert(`Toggle ${a.name}`)}
              />
            ))
          )}
        </div> */}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={!!viewAgent}
        title="Agent Details"
        subtitle={viewAgent ? `${viewAgent.name} • ${viewAgent.tier || "BRONZE"}` : ""}
        size="lg"
        onClose={() => setViewAgent(null)}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button text="Close" variant="secondary" action={() => setViewAgent(null)} />
          </div>
        }
      >
        {!viewAgent ? null : (
          <div className="agentView">
            <div className="agentViewRow">
              <div className="k">Agent ID</div>
              <div className="v">{viewAgent.id}</div>
            </div>
            <div className="agentViewRow">
              <div className="k">Phone</div>
              <div className="v">{viewAgent.phone}</div>
            </div>
            <div className="agentViewRow">
              <div className="k">Email</div>
              <div className="v">{viewAgent.email || "—"}</div>
            </div>
            <div className="agentViewRow">
              <div className="k">Status</div>
              <div className="v">{viewAgent.status}</div>
            </div>
            <div className="agentViewRow">
              <div className="k">Tier Month</div>
              <div className="v">{viewAgent.tierMonth || "—"}</div>
            </div>

            <div className="divider" />

            <div className="agentViewKpis">
              <div className="kpiBox">
                <div className="k">Monthly Net</div>
                <div className="v">
                  ₦{Number(viewAgent?.tierMetrics?.monthlyNet || 0).toLocaleString()}
                </div>
              </div>
              <div className="kpiBox">
                <div className="k">Orders</div>
                <div className="v">{viewAgent?.tierMetrics?.monthlyOrders || 0}</div>
              </div>
              <div className="kpiBox">
                <div className="k">Distinct Products</div>
                <div className="v">{viewAgent?.tierMetrics?.distinctProducts || 0}</div>
              </div>
              <div className="kpiBox">
                <div className="k">On-time Close</div>
                <div className="v">
                  {Math.round(Number(viewAgent?.tierMetrics?.onTimeCloseRate || 0) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
