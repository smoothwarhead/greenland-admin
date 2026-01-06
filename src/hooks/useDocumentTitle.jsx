import { useEffect } from "react";
import { getPageTitle } from "../app/routeMeta";




export function useDocumentTitle({ pathname, activeFarmId, activeStoreId }) {
  useEffect(() => {
    document.title = getPageTitle({ pathname, activeFarmId, activeStoreId });
  }, [pathname, activeFarmId, activeStoreId]);
}
