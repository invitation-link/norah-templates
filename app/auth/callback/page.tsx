"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const code = search.get("code");
    const requested = search.get("next") || "/dashboard";
    const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
    if (!code) { router.replace(`/?login=true`); return; }
    getSupabaseClient().auth.exchangeCodeForSession(code).then(({ error }) => {
      router.replace(error ? "/?login=true" : next);
    });
  }, [router]);
  return <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", background: "#071a38", color: "#f8edd0" }}><p>Securing your invitation…</p></main>;
}
