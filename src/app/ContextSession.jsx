const KEY = "greenland_pending_context_v1";
// { type: "farm"|"store", id: "prime-estate"|"store-odeda" }

export function setPendingContext(ctx) {
  localStorage.setItem(KEY, JSON.stringify(ctx));
}

export function getPendingContext() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingContext() {
  localStorage.removeItem(KEY);
}
