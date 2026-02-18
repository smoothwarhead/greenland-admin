import React, { useEffect, useMemo, useRef, useState } from "react";
import "../filter-sort-bar/filtersAndSortBar.scss";

import SearchPanel from "../filter-dropdowns/SearchPanel";
import CheckboxPanel from "../filter-dropdowns/CheckboxPanel";

const SORT_IDS = new Set([5, 6]);
const FILTER_PANEL_IDS = new Set([1, 2, 3, 4]);

export default function RulesFilterBar({ groups, rules = [], onResults }) {
  const [filters, setFilters] = useState({
    search: "",
    status: new Set(),
    basis: new Set(),
    rateType: new Set(),
  });

  const [sortKey, setSortKey] = useState(null);
  const [openPanelId, setOpenPanelId] = useState(null);
  const [panelAlign, setPanelAlign] = useState("left");

  const wrapRef = useRef(null);
  const chipRefs = useRef({});

  const options = useMemo(() => {
    const statuses = new Set();
    const bases = new Set();
    const rateTypes = new Set();

    rules.forEach((r) => {
      if (r?.status) statuses.add(r.status);
      if (r?.basis) bases.add(r.basis);
      if (r?.rateType) rateTypes.add(r.rateType);
    });

    return {
      statuses: Array.from(statuses).sort(),
      bases: Array.from(bases).sort(),
      rateTypes: Array.from(rateTypes).sort(),
    };
  }, [rules]);

  const toggleInSet = (key, v) => {
    setFilters((prev) => {
      const next = new Set(prev[key]);
      next.has(v) ? next.delete(v) : next.add(v);
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () => {
    setFilters({ search: "", status: new Set(), basis: new Set(), rateType: new Set() });
    setSortKey(null);
    setOpenPanelId(null);
  };

  const toggleSort = (id) => {
    const next = id === 5 ? "AZ" : "ZA";
    setSortKey((prev) => (prev === next ? null : next));
    setOpenPanelId(null);
  };

  const openPanel = (id) => {
    const el = chipRefs.current[id];
    const PANEL_W = 320;
    const GAP = 12;

    if (el) {
      const rect = el.getBoundingClientRect();
      const viewportW = window.innerWidth;
      setPanelAlign(rect.left + PANEL_W > viewportW - GAP ? "right" : "left");
    } else setPanelAlign("left");

    setOpenPanelId(id);
  };

  const togglePanel = (id) => {
    setOpenPanelId((prev) => {
      const next = prev === id ? null : id;
      if (next) openPanel(id);
      return next;
    });
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpenPanelId(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpenPanelId(null);

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...rules];

    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(q) ||
          (r.id || "").toLowerCase().includes(q)
      );
    }

    if (filters.status.size) list = list.filter((r) => filters.status.has(r.status));
    if (filters.basis.size) list = list.filter((r) => filters.basis.has(r.basis));
    if (filters.rateType.size) list = list.filter((r) => filters.rateType.has(r.rateType));

    if (sortKey === "AZ") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sortKey === "ZA") list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));

    return list;
  }, [rules, filters, sortKey]);

  useEffect(() => {
    if (typeof onResults === "function") onResults(filtered);
  }, [filtered, onResults]);

  const isChipActive = (g) => {
    if (g.id === 5) return sortKey === "AZ";
    if (g.id === 6) return sortKey === "ZA";
    if (g.id === 1) return !!filters.search.trim();
    if (g.id === 2) return filters.status.size > 0;
    if (g.id === 3) return filters.basis.size > 0;
    if (g.id === 4) return filters.rateType.size > 0;
    return false;
  };

  const renderPanel = (id) => {
    if (id === 1)
      return (
        <SearchPanel
          align={panelAlign}
          value={filters.search}
          onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
        />
      );

    if (id === 2)
      return (
        <CheckboxPanel
          align={panelAlign}
          title="Status"
          options={options.statuses}
          selectedSet={filters.status}
          onToggle={(v) => toggleInSet("status", v)}
        />
      );

    if (id === 3)
      return (
        <CheckboxPanel
          align={panelAlign}
          title="Basis"
          options={options.bases}
          selectedSet={filters.basis}
          onToggle={(v) => toggleInSet("basis", v)}
        />
      );

    if (id === 4)
      return (
        <CheckboxPanel
          align={panelAlign}
          title="Rate Type"
          options={options.rateTypes}
          selectedSet={filters.rateType}
          onToggle={(v) => toggleInSet("rateType", v)}
        />
      );

    return null;
  };

  return (
    <div className="fsWrap" ref={wrapRef}>
      <div className="fsRow">
        {groups.map((g) => {
          const active = isChipActive(g);
          const isSort = SORT_IDS.has(g.id);
          const opensPanel = FILTER_PANEL_IDS.has(g.id);

          const onClick = () => {
            if (isSort) return toggleSort(g.id);
            if (opensPanel) return togglePanel(g.id);
          };

          return (
            <div key={g.id} className="fsChipSlot">
              <button
                ref={(node) => node && (chipRefs.current[g.id] = node)}
                type="button"
                className={`fsChip ${active ? "is-active" : ""}`}
                onClick={onClick}
                aria-pressed={active}
              >
                <span className="fsChip__label">{g.label}</span>
              </button>

              {openPanelId === g.id && opensPanel ? renderPanel(g.id) : null}
            </div>
          );
        })}

        <button type="button" className="fsClear" onClick={clearAll}>
          Clear
        </button>

        <div className="fsCount">
          Showing <strong>{filtered.length}</strong>
        </div>
      </div>
    </div>
  );
}
