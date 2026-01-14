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
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function computeHouseHealth(h) {
  const feTone = h.feedPerEgg <= 0.170 ? "ok" : h.feedPerEgg <= 0.176 ? "warn" : "risk";
  const mTone = h.mort7d <= 0.35 ? "ok" : h.mort7d <= 0.55 ? "warn" : "risk";
  const eTone = h.eggSizeG >= 61 ? "ok" : h.eggSizeG >= 59.5 ? "warn" : "risk";
  const overall =
    (feTone === "risk" || mTone === "risk") ? "risk" :
    (feTone === "warn" || mTone === "warn" || eTone === "warn") ? "warn" : "ok";

  return { feTone, mTone, eTone, overall };
}

export function formatRoles(roleInput, obj) {

  function toCapitalizedCase(role) {
    return role
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }


  // normalize input
  const role = String(roleInput).trim().toUpperCase();

  // check role exists (as value)
  const exists = Object.values(obj).includes(role);

  if (!exists) return "Invalid Role";

  return toCapitalizedCase(role);


}

