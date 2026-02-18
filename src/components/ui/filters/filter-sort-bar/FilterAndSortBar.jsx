import React, { useMemo, useRef, useState, useEffect } from "react";
import "./filtersAndSortBar.scss";

import SearchPanel from "../filter-dropdowns/SearchPanel";
import CheckboxPanel from "../filter-dropdowns/CheckboxPanel";
import { filterOptions } from "../../../../data/others";
import { useData } from "../../../../context/DataContext"; // ✅ add

const SORT_IDS = new Set([5, 6]);
const FILTER_PANEL_IDS = new Set([1, 2, 3, 4]);

// Optional: treat banded percent as "PERCENT" in filters
const normalizeCommissionType = (type) => {
  if (!type) return "";
  if (type === "PERCENT_BANDED") return "PERCENT";
  return type;
};

export default function FiltersAndSortBar({ groups, onResults }) {
  const { commissionState } = useData(); // ✅ pull from context

  // ✅ products from DataContext (matches your shape: commissionState.data.commission.products)
  const products = useMemo(() => {
    return commissionState?.data?.commission?.products || [];
  }, [commissionState?.data]);

  const [filters, setFilters] = useState({
    search: "",
    status: new Set(),
    category: new Set(),
    commissionType: new Set(),
  });

  const [sortKey, setSortKey] = useState(null);
  const [openPanelId, setOpenPanelId] = useState(null);
  const [panelAlign, setPanelAlign] = useState("left");

  const wrapRef = useRef(null);
  const chipRefs = useRef({});

  // ✅ (Optional) derive available options from actual data
  // If you want to keep using filterOptions from data/others, you can ignore this.
  // This avoids showing categories/statuses that don't exist.
  const derivedOptions = useMemo(() => {
    const statuses = new Set();
    const categories = new Set();
    const commTypes = new Set();

    products.forEach((p) => {
      if (p?.status) statuses.add(p.status);
      if (p?.category) categories.add(p.category);
      const t = normalizeCommissionType(p?.commission?.type);
      if (t) commTypes.add(t);
    });

    return {
      statuses: Array.from(statuses).sort(),
      categories: Array.from(categories).sort(),
      commissionTypes: Array.from(commTypes).sort(),
    };
  }, [products]);

  // ✅ prefer hardcoded filterOptions if provided, otherwise fallback to derived
  // const uiOptions = useMemo(() => {
  //   return {
  //     statuses: filterOptions?.statuses?.length ? filterOptions.statuses : derivedOptions.statuses,
  //     categories: filterOptions?.categories?.length ? filterOptions.categories : derivedOptions.categories,
  //     commissionTypes:
  //       filterOptions?.commissionTypes?.length
  //         ? filterOptions.commissionTypes
  //         : derivedOptions.commissionTypes,
  //   };
  // }, [derivedOptions]);

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
      category: new Set(),
      commissionType: new Set(),
    });
    setSortKey(null);
    setOpenPanelId(null);
  };

  const toggleSort = (id) => {
    const nextKey = id === 5 ? "AZ" : "ZA";
    setSortKey((prev) => (prev === nextKey ? null : nextKey));
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
  const filteredProducts = useMemo(() => {
    let result = [...products];

    const q = filters.search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
      );
    }

    // console.log(filters.status.size);

    if (filters.status.size) result = result.filter((p) => filters.status.has(p.status));
    if (filters.category.size) result = result.filter((p) => filters.category.has(p.category));

    if (filters.commissionType.size) {
      result = result.filter((p) => {
        const t = normalizeCommissionType(p?.commission?.type);
        return filters.commissionType.has(t);
      });
    }

    if (sortKey === "AZ") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === "ZA") result.sort((a, b) => b.name.localeCompare(a.name));

    return result;
  }, [products, filters, sortKey]);

  // ✅ push results to parent if needed
  useEffect(() => {
    if (typeof onResults === "function") onResults(filteredProducts);
  }, [filteredProducts, onResults]);

  const isChipActive = (g) => {
    if (g.id === 5) return sortKey === "AZ";
    if (g.id === 6) return sortKey === "ZA";
    if (g.id === 1) return !!filters.search.trim();
    if (g.id === 2) return filters.status.size > 0;
    if (g.id === 3) return filters.category.size > 0;
    if (g.id === 4) return filters.commissionType.size > 0;
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
          options={filterOptions.statuses}
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
          title="Category"
          options={filterOptions.categories}
          selectedSet={filters.category}
          onToggle={(v) => toggleInSet("category", v)}
          // emptyText="No categories found."
        />
      );
    }

    if (id === 4) {
      return (
        <CheckboxPanel
          align={panelAlign}
          title="Commission Type"
          options={filterOptions.commissionTypes}
          selectedSet={filters.commissionType}
          onToggle={(v) => toggleInSet("commissionType", v)}
          // emptyText="No commission types found."
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

          const isSort = SORT_IDS.has(g.id);
          const opensPanel = FILTER_PANEL_IDS.has(g.id);

          const onClick = () => {
            if (isLoading || isError) return;
            if (isSort) return toggleSort(g.id);
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
              !filters.category.size &&
              !filters.commissionType.size &&
              !sortKey
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
              Showing <strong>{filteredProducts.length}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
