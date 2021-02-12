import React from "react";
import { useLocation } from "react-router-dom";

import analytics from "../utils/analytics";

export default function useGoogleAnalytics() {
  const location = useLocation();

  React.useEffect(() => {
    analytics.init();
  }, []);

  React.useEffect(() => {
    console.log(window.location.href);
    const currentPath = location.pathname + location.search;
    analytics.sendPageview(currentPath, window.location.href);
  }, [location]);
}
