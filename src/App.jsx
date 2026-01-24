import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AppShell } from "./app/AppShell";
import { ROUTE_LIST } from "./app/routeList";

import { RequireAccessWithConstraints } from "./app/RequireAccessWithConstraints";
import { PAGE_COMPONENTS } from "./app/pages";
import { SelectContextFirstLoad } from "./app/SelectContextFirstLoad";
import { LoginPage } from "./pages/account/LoginPage";
import FarmSelection from "./pages/farm-selection/FarmSelection";
import Login from "./pages/account/Login";
import { IndexRedirect } from "./guards/IndexRedirect";
import { RequireAuth } from "./guards/RequireAuth";
import { RequirePendingContext } from "./guards/routeGuards";

RequirePendingContext;

const Fallback = () => (
  <div className="page">
    <div className="pageTitle">Loading…</div>
    <div className="card">
      <div className="muted">Please wait.</div>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* First load goes here. Smart index (no more forced /select-context on refresh) */}
            <Route path="/" element={<IndexRedirect />} />

            <Route path="/select-context" element={<FarmSelection />} />

            {/* ✅ Can't login without having selected a context */}
            <Route
              path="/login"
              element={
                <RequirePendingContext>
                  <Login />
                </RequirePendingContext>
              }
            />

            {/* Landing */}
            {/* <Route path="/app/select" element={<SelectContextLanding />} /> */}
            {/* ✅ Protected App */}
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              {/* ✅ Corporate Dashboard (index route for /app) */}
              {/* <Route
                index
                element={
                  <Suspense fallback={<Fallback />}>
                    {React.createElement(PAGE_COMPONENTS.APP_HOME)}
                  </Suspense>
                }
              /> */}

              {ROUTE_LIST.filter((r) => r.path !== "/app").map((r) => {
                if (r.key === "NOT_AUTHORIZED") return null;
                const LazyPage = PAGE_COMPONENTS[r.key];

                // ✅ safe child path builder
                const childPath = r.path.startsWith("/app/")
                  ? r.path.slice(5) // remove "/app/"
                  : r.path.replace(/^\//, "");

                return (
                  <Route
                    key={r.key}
                    path={childPath}
                    element={
                      <RequireAccessWithConstraints routeKey={r.key}>
                        <Suspense fallback={<Fallback />}>
                          <LazyPage />
                        </Suspense>
                      </RequireAccessWithConstraints>
                    }
                  />
                );
              })}
            </Route>

            <Route
              path="/not-authorized"
              element={
                <div className="page">
                  <h2>Not Authorized</h2>
                </div>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/not-authorized" replace />}
            />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
