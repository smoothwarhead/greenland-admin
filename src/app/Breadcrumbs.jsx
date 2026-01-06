import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBreadcrumbs } from "./routeMeta";

export function Breadcrumbs() {
  const loc = useLocation();
  const { activeFarmId, activeStoreId } = useAuth();

  const crumbs = useMemo(() => {
    return getBreadcrumbs({
      pathname: loc.pathname,
      activeFarmId,
      activeStoreId
    });
  }, [loc.pathname, activeFarmId, activeStoreId]);

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          <Link to={c.to} className="crumb">{c.label}</Link>
          {i < crumbs.length - 1 ? <span className="muted">/</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
}
