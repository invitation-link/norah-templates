"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function RouteMeasurement() {
  const pathname = usePathname();

  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script id="google-consent-and-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          var analyticsConsent = localStorage.getItem('invite-link-analytics-consent') === 'granted' ? 'granted' : 'denied';
          gtag('consent', 'default', {
            analytics_storage: analyticsConsent,
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false, anonymize_ip: true });
        `}
      </Script>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <RouteMeasurement />
    </>
  );
}
