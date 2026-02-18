import { useMemo, useState } from "react";
import { useData } from "../context/DataContext"; // adjust path to your DataContext file



const normalizeCommissionType = (type) => {
  if (!type) return "";
  // Map your banded commission into a "PERCENT" bucket for filtering
  if (type === "PERCENT_BANDED") return "PERCENT";
  return type; // FLAT, PERCENT, etc
};

export function useCommissionProductQuery() {
    
  const { commissionState } = useData();

  // console.log(commissionState);

  const status = commissionState?.status || "idle";
  const error = commissionState?.error || null;

  // ✅ products list from context
  // Your loadCommission() likely returns { products: [...] } or { agents, rules, products }
  const products = useMemo(() => {
    const d = commissionState?.data.commission.products;
    if (!d) return [];
    return Array.isArray(d) ? d : (d.products || []);
  }, [commissionState?.data.commission.products]);

  // ✅ local filter state
  const [filters, setFilters] = useState({
    search: "",
    status: new Set(),
    category: new Set(),
    commissionType: new Set(),
  });

  // ✅ sort state
  const [sortKey, setSortKey] = useState(null); // "AZ" | "ZA" | null

  // ✅ options derived from products
  const options = useMemo(() => {
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
      commTypes: Array.from(commTypes).sort(),
    };
  }, [products]);

  // ✅ apply filters + sorting
  const results = useMemo(() => {
    let list = [...products];

    // Search: name or sku
    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
      );
    }

    // Status
    if (filters.status.size) {
      list = list.filter((p) => filters.status.has(p.status));
    }

    // Category
    if (filters.category.size) {
      list = list.filter((p) => filters.category.has(p.category));
    }

    // Commission type (normalized)
    if (filters.commissionType.size) {
      list = list.filter((p) => {
        const t = normalizeCommissionType(p?.commission?.type);
        return filters.commissionType.has(t);
      });
    }

    // Sort
    if (sortKey === "AZ") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === "ZA") list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [products, filters, sortKey]);

  // ✅ helpers
  const toggleInSet = (key, value) => {
    setFilters((prev) => {
      const next = new Set(prev[key]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [key]: next };
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
  };

  return {
    // context state
    status,
    error,

    // data
    products,
    results,
    options,

    // ui state
    filters,
    sortKey,

    // actions
    setFilters,
    setSortKey,
    toggleInSet,
    clearAll,
  };
}
