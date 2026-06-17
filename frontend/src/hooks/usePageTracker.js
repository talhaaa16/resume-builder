import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    const API = process.env.REACT_APP_API_URL || "";
    fetch(`${API}/api/admin/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location.pathname }),
    }).catch(() => { }); // silent fail — never throw
  }, [location.pathname]);
}
