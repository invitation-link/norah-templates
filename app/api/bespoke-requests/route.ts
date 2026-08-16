import { NextRequest, NextResponse } from "next/server";
import { bespokeRequestSchema } from "@/lib/product";
import { rateLimit } from "@/lib/server-auth";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!(await rateLimit(request, "bespoke", 4, 86400))) return NextResponse.json({ error: "Please wait before sending another request" }, { status: 429 });
  const parsed = bespokeRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the request details", issues: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;
  const { error } = await (createServerClient().from("bespoke_requests") as any).insert({ name: input.name, email: input.email, phone: input.phone, occasion: input.occasion, event_date: input.eventDate || null, brief: input.brief });
  if (error) return NextResponse.json({ error: "Could not send your request" }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
