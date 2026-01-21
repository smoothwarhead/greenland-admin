import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AppShell } from "./app/AppShell";
import { ROUTE_LIST } from "./app/routeList";

import { RequireAccessWithConstraints } from "./app/RequireAccessWithConstraints";
import { PAGE_COMPONENTS } from "./app/pages";
import { RequirePendingContext } from "./app/routeGuards";
import { SelectContextFirstLoad } from "./app/SelectContextFirstLoad";
import { LoginPage } from "./pages/account/LoginPage";
import FarmSelection from "./pages/farm-selection/FarmSelection";
import Login from "./pages/account/Login";
import { IndexRedirect } from "./guards/IndexRedirect";
import { RequireAuth } from "./guards/RequireAuth";










const Fallback = () => (
  <div className="page">
    <div className="pageTitle">Loading…</div>
    <div className="card"><div className="muted">Please wait.</div></div>
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
              {ROUTE_LIST.map((r) => {
                if (r.key === "NOT_AUTHORIZED") return null;
                const LazyPage = PAGE_COMPONENTS[r.key];
                return (
                  <Route
                    key={r.key}
                    path={r.path.replace("/app/", "")}
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

            <Route path="/not-authorized" element={<div className="page"><h2>Not Authorized</h2></div>} />
            <Route path="*" element={<Navigate to="/not-authorized" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
