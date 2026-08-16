import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function requireUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };

  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: NextResponse.json({ error: "Invalid or expired session" }, { status: 401 }) };
  return { user: data.user, supabase };
}

export async function rateLimit(request: NextRequest, scope: string, limit: number, windowSeconds: number) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(`${scope}:${forwarded}`).digest("hex");
  const supabase = createServerClient();
  const { data, error } = await (supabase.rpc as any)("check_rate_limit", {
    p_key: key,
    p_scope: scope,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  return !error && data === true;
}
