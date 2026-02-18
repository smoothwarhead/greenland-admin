export function cx(...a) {
  return a.filter(Boolean).join(" ");
}
export function fmtInt(n) {
  // console.log(n);
  return new Intl.NumberFormat().format(n ?? 0);
}

export function fmt1(n) {
  return (n ?? 0).toFixed(1);
}

export function fmt2(n) {
  return (n ?? 0).toFixed(2);
}

export function fmtNaira(n) {
  return "₦" + new Intl.NumberFormat().format(n ?? 0);
}

export function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

export function hoursBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60));
}

export function formatDate(isoOrNull) {
  if (!isoOrNull) return "Now";
  const d = new Date(isoOrNull);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function computeHouseHealth(h) {
  const feTone =
    h.feedPerEgg <= 0.17 ? "ok" : h.feedPerEgg <= 0.176 ? "warn" : "risk";
  const mTone = h.mort7d <= 0.35 ? "ok" : h.mort7d <= 0.55 ? "warn" : "risk";
  const eTone = h.eggSizeG >= 61 ? "ok" : h.eggSizeG >= 59.5 ? "warn" : "risk";
  const overall =
    feTone === "risk" || mTone === "risk"
      ? "risk"
      : feTone === "warn" || mTone === "warn" || eTone === "warn"
        ? "warn"
        : "ok";

  return { feTone, mTone, eTone, overall };
}

export function formatRoles(roleInput, obj) {
  function toCapitalizedCase(role) {
    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // normalize input
  const role = String(roleInput).trim().toUpperCase();

  // check role exists (as value)
  const exists = Object.values(obj).includes(role);

  if (!exists) return "Invalid Role";

  return toCapitalizedCase(role);
}

export function evaluateAgentTier(metrics) {

  const AGENT_TIERS = {
    BRONZE: {
      id: "BRONZE",
      label: "Bronze",
      bonusMultiplier: 1.0,
      thresholds: {
        minMonthlyNet: 0,
        minOrders: 1,
        minDistinctProducts: 1,
        minOnTimeCloseRate: 0.0,
      },
    },
    SILVER: {
      id: "SILVER",
      label: "Silver",
      bonusMultiplier: 1.15,
      thresholds: {
        minMonthlyNet: 300000,
        minOrders: 8,
        minDistinctProducts: 3,
        minOnTimeCloseRate: 0.6,
      },
    },
    GOLD: {
      id: "GOLD",
      label: "Gold",
      bonusMultiplier: 1.3,
      thresholds: {
        minMonthlyNet: 800000,
        minOrders: 15,
        minDistinctProducts: 5,
        minOnTimeCloseRate: 0.75,
      },
    },
  };

  // metrics: { monthlyNet, monthlyOrders, distinctProducts, onTimeCloseRate }
  const m = {
    monthlyNet: Number(metrics?.monthlyNet || 0),
    monthlyOrders: Number(metrics?.monthlyOrders || 0),
    distinctProducts: Number(metrics?.distinctProducts || 0),
    onTimeCloseRate: Number(metrics?.onTimeCloseRate || 0),
  };

  const qualifies = (tier) => {
    const t = tier.thresholds;
    return (
      m.monthlyNet >= t.minMonthlyNet &&
      m.monthlyOrders >= t.minOrders &&
      m.distinctProducts >= t.minDistinctProducts &&
      m.onTimeCloseRate >= t.minOnTimeCloseRate
    );
  };

  if (qualifies(AGENT_TIERS.GOLD)) return AGENT_TIERS.GOLD;
  if (qualifies(AGENT_TIERS.SILVER)) return AGENT_TIERS.SILVER;
  return AGENT_TIERS.BRONZE;
}


const matchesAppliesTo = (rule, product) => {
  const sku = (product?.sku || "").toUpperCase();
  const prefixes = rule?.appliesTo?.skuPrefixes || [];
  const okSku = !prefixes.length || prefixes.some((p) => sku.startsWith(String(p).toUpperCase()));

  const cats = rule?.appliesTo?.categories || [];
  const okCat = !cats.length || cats.includes(product?.category);

  return okSku && okCat;
};

const matchesConditions = (cond = {}, ctx = {}) => {
  // ctx: { netSales, channel, ...maybe monthlyNet later }
  if (cond.minNet != null && Number(ctx.netSales) < Number(cond.minNet)) return false;

  if (Array.isArray(cond.channel) && cond.channel.length) {
    if (!cond.channel.includes(ctx.channel)) return false;
  }

  // Optional future support:
  if (cond.minMonthlyNet != null && Number(ctx.monthlyNet) < Number(cond.minMonthlyNet)) return false;

  return true;
};

const calcBase = (rule, ctx) => {
  const net = Number(ctx.netSales || 0);
  const qty = Number(ctx.qty || 1);

  if (rule.rateType === "PERCENT") return (Number(rule.rate || 0) / 100) * net;
  if (rule.rateType === "FLAT") return Number(rule.rate || 0) * qty;
  return 0;
};

const calcBonus = (rule, ctx) => {
  const b = rule?.bonus;
  if (!b) return 0;

  const ok = matchesConditions(b.conditions || {}, ctx);
  if (!ok) return 0;

  const net = Number(ctx.netSales || 0);

  // For now bonus is percent of NET_SALES
  if (b.type === "PERCENT") return (Number(b.rate || 0) / 100) * net;

  return 0;
};

export function computeCommission({ rules, product, netSales, qty = 1, channel, monthlyNet, agentTier }) {

  const ctx = { netSales, qty, channel, monthlyNet };

  const tierMult = agentTier?.bonusMultiplier ?? 1;

  // pick highest priority matching rule
  const matching = (rules || [])
    .filter((r) => r.status === "ACTIVE")
    .filter((r) => matchesAppliesTo(r, product))
    .filter((r) => matchesConditions(r.conditions || {}, ctx))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const rule = matching[0];
  if (!rule) {
    return { appliedRuleId: null, baseCommission: 0, bonusCommission: 0, totalCommission: 0 };
  }

  const baseCommission = calcBase(rule, ctx);
  const bonusCommission = calcBonus(rule, ctx) * tierMult ;

 

  return {
    appliedRuleId: rule.id,
    baseCommission,
    bonusCommission,
    totalCommission: baseCommission + bonusCommission,
    tierApplied: agentTier?.id || "BRONZE"
  };
}

