import React from "react";
import { useParams } from "react-router-dom";
import { ROUTES } from "./routeRegistry";

function PageShell({ title }) {
  const params = useParams();
  return (
    <div className="page">
      {/* <div className="pageTitle">{title}</div> */}
      <div className="pageMeta">
        <code>params</code>: {JSON.stringify(params)}
      </div>
      <div className="card">
        <div className="muted">This is a stub page.</div>
      </div>
    </div>
  );
}

// Convert an in-memory component to a lazy component (no code-splitting yet,
// but gives you the Suspense architecture; later you can replace with real imports).
const makeLazy = (Comp) =>
  React.lazy(() => Promise.resolve({ default: Comp }));

export const PAGE_COMPONENTS = Object.fromEntries(
  Object.values(ROUTES).map((r) => {
    const Comp = () => <PageShell title={r.label} />;
    return [r.key, makeLazy(Comp)];
  })
);
