export type AnalyticsValue = string | number | boolean | undefined;
export type AnalyticsParameters = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

export function trackEvent(name: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined") return;

  const aliases: Record<string, string> = {
    live_demo_open: "template_preview",
    create_started: "customize_start",
    publish_success: "invite_published",
    checkout_start: "begin_checkout",
  };
  const canonicalName = name === "share" && parameters.method === "WhatsApp"
    ? "share_whatsapp"
    : aliases[name];
  const eventNames = canonicalName && canonicalName !== name ? [name, canonicalName] : [name];

  eventNames.forEach((eventName) => {
    window.gtag?.("event", eventName, parameters);
    window.clarity?.("event", eventName);
  });
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined) window.clarity?.("set", key, String(value));
  });
}
