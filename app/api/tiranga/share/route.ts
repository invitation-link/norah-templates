import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createShare, getShare } from "@/app/lib/tiranga-store";

const shareSchema = z.object({
  name: z.string().trim().min(1).max(28),
  city: z.string().trim().min(1).max(36),
  parentShareId: z.string().trim().max(100).optional(),
  community: z.string().trim().max(80).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = shareSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Unable to create this share link." }, { status: 400 });
  const share = await createShare(parsed.data);
  return NextResponse.json({ shareId: share.shareId, url: `${request.nextUrl.origin}/tiranga/${share.shareId}` }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const shareId = request.nextUrl.searchParams.get("shareId");
  if (!shareId) return NextResponse.json({ error: "shareId is required" }, { status: 400 });
  const share = await getShare(shareId);
  if (!share) return NextResponse.json({ error: "Share not found" }, { status: 404 });
  return NextResponse.json(share);
}
