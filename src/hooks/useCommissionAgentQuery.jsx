import { useMemo, useState } from "react";
import { useData } from "../context/DataContext"; // adjust path to your DataContext file



// const normalizeCommissionType = (type) => {
//   if (!type) return "";
//   // Map your banded commission into a "PERCENT" bucket for filtering
//   if (type === "PERCENT_BANDED") return "PERCENT";
//   return type; // FLAT, PERCENT, etc
// };

export function useCommissionAgentQuery() {
    
  const { commissionState } = useData();

  // console.log(commissionState);

  const status = commissionState?.status || "idle";
  const error = commissionState?.error || null;

    // ✅ pull agents from DataContext
    const agents = useMemo(() => {
      return commissionState?.data?.commission?.agents || [];
    }, [commissionState?.data]);

  // ✅ local filter state
  const [filters, setFilters] = useState({
    search: "",
    status: new Set(),
    tier: new Set(),
    
  });

  // ✅ sort state
  // const [sortKey, setSortKey] = useState(null); // "AZ" | "ZA" | null

  // ✅ options derived from products
   const options = useMemo(() => {
     const statuses = new Set();
     const tiers = new Set();
     
     agents.forEach((a) => {
       if (a?.status) statuses.add(String(a.status).toUpperCase());
       if (a?.tier) tiers.add(String(a.tier).toUpperCase());
   
     });
 
     const normSort = (arr) => arr.sort((x, y) => x.localeCompare(y));
     return {
       statuses: ["ACTIVE", "INACTIVE"].filter((x) => statuses.has(x)).concat(
         normSort([...statuses].filter((x) => x !== "ACTIVE" && x !== "INACTIVE"))
       ),
       tiers: ["BRONZE", "SILVER", "GOLD"].filter((x) => tiers.has(x)).concat(
         normSort([...tiers].filter((x) => !["BRONZE", "SILVER", "GOLD"].includes(x)))
       ),
       
     };
   }, [agents]);

  // apply filters + sorting
  const results = useMemo(() => {
   
    let list = [...agents];


    
    // Search: name or sku
    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(q) ||
          (a.phone || "").toLowerCase().includes(q) ||
          (a.id || "").toLowerCase().includes(q) ||
          (a.email || "").toLowerCase().includes(q)
      );
    }

    // Status
    if (filters.status.size) {
      list = list.filter((a) => filters.status.has(a.status));
    }

    // tier
    if (filters.tier.size) {
      list = list.filter((a) => filters.tier.has(a.tier));
    }


    // best agents first
    list.sort((a, b) => {
      const an = Number(a?.tierMetrics?.monthlyNet || 0);
      const bn = Number(b?.tierMetrics?.monthlyNet || 0);
      return bn - an;
    });

    return list;

  }, [agents, filters]);

  // helpers
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
      tier: new Set(),
      
    });
    
  };

  return {
    // context state
    status,
    error,

    // data
    agents,
    results,
    options,

    // ui state
    filters,
   
    // actions
    setFilters,
    toggleInSet,
    clearAll,
  };
}
