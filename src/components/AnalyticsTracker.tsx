import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/api";

/**
 * Records a page view on every route change, and a click for any element
 * (or ancestor) carrying a `data-track="label"` attribute. Admin pages are skipped.
 */
const AnalyticsTracker = () => {
  const { pathname, hash } = useLocation();

  // New page without a #section: start at the top (React Router keeps scroll position otherwise).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    trackEvent("pageview", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      const el = (e.target as Element | null)?.closest?.("[data-track]");
      const label = el?.getAttribute("data-track");
      if (label) trackEvent("click", window.location.pathname, label);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
};

export default AnalyticsTracker;
