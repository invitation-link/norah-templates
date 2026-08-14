import { ImageResponse } from "next/og";
import { safeFirstName } from "@/app/lib/tiranga";

export const alt = "A personal Pass the Tiranga invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const inviter = safeFirstName(shareId);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", color: "white", background: "linear-gradient(155deg,#061d30,#0b405c 60%,#b25e3d)", fontFamily: "Arial" }}>
      <span style={{ color: "#F2CC69", fontSize: 20, letterSpacing: 4 }}>INVITE LINK</span>
      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 76, lineHeight: 1, letterSpacing: -4 }}>{inviter} passed you<br />the Tiranga.</span><span style={{ marginTop: 28, fontSize: 28, color: "rgba(255,255,255,.75)" }}>It rises only when you do. Hoist it →</span></div>
      <div style={{ width: "100%", height: 12, display: "flex" }}><span style={{ flex: 1, background: "#FF671F" }} /><span style={{ flex: 1, background: "#FFFFFF" }} /><span style={{ flex: 1, background: "#046A38" }} /></div>
    </div>,
    size,
  );
}
