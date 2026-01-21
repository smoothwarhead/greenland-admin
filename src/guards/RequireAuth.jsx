import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";



export function RequireAuth({ children }) {
  const { isAuthenticated, authHydrated } = useAuth();
  const { activeContext, dataHydrated } = useData();

  if (!authHydrated || !dataHydrated) return null;

  if (!activeContext) return <Navigate to="/select-context" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
