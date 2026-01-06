import React, { useMemo, useState } from "react";
import { PERM } from "./perms";
import { useAuth } from "../context/AuthContext";






function Modal({ open, title, children }) {
  if (!open) return null;
  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div style={{ fontWeight: 800 }}>{title}</div>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 12, zIndex: 50
  },
  modal: { width: 420, maxWidth: "100%", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" },
  modalHeader: { padding: 14, borderBottom: "1px solid #e5e7eb" },
  modalBody: { padding: 14, display: "flex", flexDirection: "column", gap: 10 }
};

/**
 * Enforces: Only Super Admin can change farm/store context without re-auth.
 * For everyone else: prompt for password (demo), then allow change.
 */
export function useContextSwitch() {


  const { user, can, inFarmScope, inStoreScope, setActiveFarmId, setActiveStoreId } = useAuth();

  const isSuper = useMemo(() => can(PERM.ADMIN_ALL), [can]);

  const [pending, setPending] = useState(null); // { type: "farm"|"store", id }
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const requestSwitch = ({ type, id, meta }) => {
    // HARD BLOCK: must be in scope (unless super admin)
    if (!scopeAllowed({ type, id })) {
      // Option A: silent fail response
      return { switched: false, blocked: true, reason: "OUT_OF_SCOPE" };

      // Option B (if you prefer): throw
      // throw new Error("Attempted to switch into out-of-scope context.");
    }

    if (isSuper) {
      if (type === "farm") setActiveFarmId(id);
      if (type === "store") setActiveStoreId(id);
      onSwitched?.({ type, id, meta, via: "direct" });
      return { switched: true, blocked: false };
    }

    setPending({ type, id, meta });
    setOpen(true);
    setPw("");
    setErr("");
    return { switched: false, blocked: false };

  };


    const scopeAllowed = ({ type, id }) => {
    // Super Admin can switch anywhere
    if (isSuper) return true;

    if (type === "farm") return inFarmScope(id);
    if (type === "store") return inStoreScope(id);

    return false;
  };


  


  // Demo password policy:
  // - Super Admin not needed
  // - Everyone else must enter "1234" OR their user id suffix (optional)
  const verify = () => {
    if (!user) return false;
    if (pw === "1234") return true;
    return false;
  };

  const confirm = () => {
    if (!pending) return;

     // HARD BLOCK (again) in case scopes changed mid-modal
    if (!scopeAllowed({ type: pending.type, id: pending.id })) {
      setErr("You no longer have access to this farm/store.");
      return;
    }


    if (!verify()) {
      setErr("Invalid password. Try 1234 (demo).");
      return;
    }
    if (pending.type === "farm") setActiveFarmId(pending.id);
    if (pending.type === "store") setActiveStoreId(pending.id);
    setOpen(false);
    setPending(null);
  };

  const cancel = () => {
    setOpen(false);
    setPending(null);
  };

  const ReAuthModal = (
    <Modal open={open} title="Re-authenticate to switch context">
      <div className="muted">
        For security, switching farms/stores requires confirmation.
      </div>
      <div className="field">
        <label>Password</label>
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Enter password"
          type="password"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb"
          }}
        />
      </div>
      {err ? <div style={{ color: "#b91c1c", fontSize: 13 }}>{err}</div> : null}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn" onClick={cancel}>Cancel</button>
        <button className="btn" onClick={confirm} style={{ fontWeight: 700 }}>Confirm</button>
      </div>
      <div className="muted" style={{ fontSize: 12 }}>Demo password: <b>1234</b></div>
    </Modal>
  );

  return { requestSwitch, ReAuthModal, isSuper };
}
