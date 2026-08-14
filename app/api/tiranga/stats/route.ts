import { NextResponse } from "next/server";
import { getTirangaStats } from "@/app/lib/tiranga-store";

export async function GET() {
  const stats = await getTirangaStats();
  return NextResponse.json(stats, { headers: { "Cache-Control": "no-store" } });
}
