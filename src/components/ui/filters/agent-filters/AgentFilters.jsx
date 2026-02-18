import React, { useMemo, useRef, useState, useEffect } from "react";
import "../filter-sort-bar/filtersAndSortBAr.scss";

import SearchPanel from "../filter-dropdowns/SearchPanel";
import CheckboxPanel from "../filter-dropdowns/CheckboxPanel";
import { agentFilterOptions } from "../../../../data/others";
import { useData } from "../../../../context/DataContext";



const FILTER_PANEL_IDS = new Set([1, 2, 3]);



const AgentFilters = ({ groups, onResults }) => {
  const { commissionState } = useData(); // ✅ pull from context

  // ✅ Agents from DataContext (matches your shape: commissionState.data.commission.Agents)
  const agents = useMemo(() => {
    return commissionState?.data?.commission?.agents || [];
  }, [commissionState?.data]);

  const [filters, setFilters] = useState({
    search: "",
    status: new Set(),
    tier: new Set(),
  });

  const [openPanelId, setOpenPanelId] = useState(null);
  const [panelAlign, setPanelAlign] = useState("left");

  const wrapRef = useRef(null);
  const chipRefs = useRef({});

  const toggleInSet = (setKey, value) => {
    setFilters((prev) => {
      const nextSet = new Set(prev[setKey]);
      nextSet.has(value) ? nextSet.delete(value) : nextSet.add(value);
      return { ...prev, [setKey]: nextSet };
    });
  };

  const clearAll = () => {
    setFilters({
      search: "",
      status: new Set(),
      tier: new Set(),
    });
    setOpenPanelId(null);
  };

  const openPanel = (id) => {
    const el = chipRefs.current[id];
    const PANEL_W = 320;
    const GAP = 12;

    if (el) {
      const rect = el.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const willOverflowRight = rect.left + PANEL_W > viewportW - GAP;
      setPanelAlign(willOverflowRight ? "right" : "left");
    } else {
      setPanelAlign("left");
    }

    setOpenPanelId(id);
  };

  const togglePanel = (id) => {
    setOpenPanelId((prev) => {
      const next = prev === id ? null : id;
      if (next) openPanel(id);
      return next;
    });
  };

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpenPanelId(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenPanelId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Apply filters + sort
  const filteredAgents = useMemo(() => {
    let result = [...agents];

    // Search: name or sku
    const q = filters.search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(q) ||
          (a.phone || "").toLowerCase().includes(q) ||
          (a.id || "").toLowerCase().includes(q) ||
          (a.email || "").toLowerCase().includes(q),
      );
    }

    // Status
    if (filters.status.size) {
      result = result.filter((a) => filters.status.has(a.status));
    }

    // tier
    if (filters.tier.size) {
      result = result.filter((a) => filters.tier.has(a.tier));
    }

    // best agents first
    result.sort((a, b) => {
      const an = Number(a?.tierMetrics?.monthlyNet || 0);
      const bn = Number(b?.tierMetrics?.monthlyNet || 0);
      return bn - an;
    });

    return result;
  }, [agents, filters]);

  // push results to parent if needed
  useEffect(() => {
    if (typeof onResults === "function") onResults(filteredAgents);
  }, [filteredAgents, onResults]);

  const isChipActive = (id) => {
    if (id === 1) return !!filters.search.trim();
    if (id === 2) return filters.status.size > 0;
    if (id === 3) return filters.tier.size > 0;
    return false;
  };


    const renderPanel = (id) => {
      if (id === 1) {
        return (
          <SearchPanel
            align={panelAlign}
            value={filters.search}
            onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          />
        );
      }
  
      if (id === 2) {
        return (
          <CheckboxPanel
            align={panelAlign}
            title="Status"
            options={agentFilterOptions.statuses}
            selectedSet={filters.status}
            onToggle={(v) => toggleInSet("status", v)}
            // emptyText="No status values found."
          />
        );
      }
  
      if (id === 3) {
        return (
          <CheckboxPanel
            align={panelAlign}
            title="Tier"
            options={agentFilterOptions.tiers}
            selectedSet={filters.tier}
            onToggle={(v) => toggleInSet("tier", v)}
            // emptyText="No categories found."
          />
        );
      }
    
      return null;
    };

    const isLoading = commissionState?.status === "loading";
    const isError = commissionState?.status === "error";


  return (
    <div className="fsWrap" ref={wrapRef}>
      <div className="fsRow" role="toolbar" aria-label="Filters and Sort">
        {groups.map((g) => {
          const Icon = g.icon;
          const active = isChipActive(g);

        //   const isSort = SORT_IDS.has(g.id);
          const opensPanel = FILTER_PANEL_IDS.has(g.id);

          const onClick = () => {
            if (isLoading || isError) return;
            if (opensPanel) return togglePanel(g.id);
          };

          return (
            <div key={g.id} className="fsChipSlot">
              {/* ✅ make it a div (accessibility + focus + aria-pressed) */}
              <div
                ref={(node) => {
                  if (node) chipRefs.current[g.id] = node;
                }}
                className={`fsChip ${active ? "is-active" : ""}`}
                onClick={onClick}
                aria-pressed={active}
                disabled={isLoading || isError}
              >
                {Icon ? <Icon className="fsChip__icon" aria-hidden="true" /> : null}
                <span className="fsChip__label">{g.label}</span>
              </div>

              {openPanelId === g.id && opensPanel ? renderPanel(g.id) : null}
            </div>
          );
        })}

        <div
          type="div"
          className="fsClear"
          onClick={clearAll}
          disabled={
            isLoading ||
            isError ||
            (
              !filters.search.trim() &&
              !filters.status.size &&
              !filters.tier.size
          
            )
          }
        >
          Clear
        </div>

        <div className="fsCount">
          {isLoading && <span>Loading…</span>}
          {isError && <span>Error loading products</span>}
          {!isLoading && !isError && (
            <span>
              Showing <strong>{filteredAgents.length}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentFilters;
