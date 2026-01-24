import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useVisitTracker() {
  const location = useLocation();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only track each path once per session
    if (trackedPaths.current.has(location.pathname)) {
      return;
    }
    
    trackedPaths.current.add(location.pathname);

    const trackVisit = async () => {
      try {
        await supabase.functions.invoke("track-visit", {
          body: {
            page: location.pathname,
            referrer: document.referrer || "",
            userAgent: navigator.userAgent || "",
          },
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug("Visit tracking failed:", error);
      }
    };

    trackVisit();
  }, [location.pathname]);
}
