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
  window.gtag?.("event", name, parameters);
  window.clarity?.("event", name);
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined) window.clarity?.("set", key, String(value));
  });
}
