import { LS_ACTIVE_CONTEXT } from "../data/storageKeys";
import SessionManager from "../utils/SessionManager";


export function setPendingContext(ctx) {
  if(!ctx) return;
  SessionManager.setUserContext(LS_ACTIVE_CONTEXT, ctx)
}

export function getPendingContext() {
  try {
    const raw = SessionManager.getUserContext(LS_ACTIVE_CONTEXT);
    return raw ? raw : null;
  } catch {
    return null;
  }
}

export function clearPendingContext() {
  SessionManager.removeUserContext(LS_ACTIVE_CONTEXT);
}

export function popPendingContext() {
  const ctx = getPendingContext();
  clearPendingContext();
  return ctx
  
}


