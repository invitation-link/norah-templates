"use client";

import { useEffect } from "react";
import { trackEvent } from "@/app/lib/analytics";

export default function TemplateViewTracker({ templateId, occasion }: { templateId: string; occasion: string }) {
  useEffect(() => {
    trackEvent("template_view", { template_id: templateId, occasion });
  }, [occasion, templateId]);
  return null;
}
