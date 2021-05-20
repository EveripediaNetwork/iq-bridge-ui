import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import analytics from "../utils/analytics";

export default function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    analytics.sendPageview(currentPath, window.location.href);
  }, [location]);
}
