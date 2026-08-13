"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MicrosoftClarity({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    window.clarity?.("set", "page_path", pathname);
  }, [pathname]);

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          var consent = localStorage.getItem('invite-link-analytics-consent') === 'granted' ? 'granted' : 'denied';
          c[a]('consentv2', { source: 'InviteLink', ad_Storage: 'denied', analytics_Storage: consent });
          t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, 'clarity', 'script', '${projectId}');
      `}
    </Script>
  );
}
