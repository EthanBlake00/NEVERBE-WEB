"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/firebase/firebaseClient";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const analytics = getFirebaseAnalytics();
    if (analytics) {
      const page_path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      
      logEvent(analytics, "page_view", {
        page_path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
