import { ImageResponse } from "next/og";

export const alt = "Pass the Tiranga — Hoist yours and pass it on";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 70px", color: "white", background: "linear-gradient(160deg,#061d30 0%,#0b405c 58%,#c16b42 100%)", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24, letterSpacing: 4 }}><span>PASS THE TIRANGA</span><span style={{ color: "#F2CC69", fontSize: 20 }}>INVITE LINK</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 650 }}><span style={{ fontSize: 86, lineHeight: .94, letterSpacing: -5 }}>This one<br />is yours.</span><span style={{ marginTop: 28, fontSize: 28, color: "rgba(255,255,255,.78)" }}>Hoist yours. Pass it on.</span></div>
        <div style={{ width: 380, height: 253, display: "flex", flexDirection: "column", boxShadow: "0 20px 55px rgba(0,0,0,.28)" }}><span style={{ flex: 1, background: "#FF671F" }} /><span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}><span style={{ width: 54, height: 54, border: "4px solid #06038D", borderRadius: "50%", background: "radial-gradient(circle,#06038D 0 4px,transparent 5px)" }} /></span><span style={{ flex: 1, background: "#046A38" }} /></div>
      </div>
      <span style={{ fontSize: 19, color: "rgba(255,255,255,.62)" }}>An interactive Independence Day experience by Invite Link</span>
    </div>,
    size,
  );
}
