import { ImageResponse } from "next/og";

// Default Open Graph / Twitter card for all pages that do not set their own
// (home, tests, guides, legal). Node runtime — do NOT use edge here, the
// OpenNext adapter does not build app-router edge routes.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "white",
          background: "linear-gradient(135deg, #020617 0%, #06111f 55%, #082f49 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              width: 86,
              height: 86,
              borderRadius: 22,
              border: "3px solid rgba(34, 211, 238, 0.5)",
              background: "rgba(34, 211, 238, 0.12)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              fontWeight: 900,
              color: "#67e8f9",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: 1 }}>Testier · 테스티어</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1.05 }}>Test + Tier</div>
          <div style={{ fontSize: 34, color: "#cbd5e1" }}>반응속도 · 에임 · 기억력 · 집중력 · 타자 속도</div>
          <div style={{ fontSize: 30, color: "#94a3b8" }}>Reaction · Aim · Memory · Focus · Typing speed</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: "#a7f3d0" }}>
          Bronze · Silver · Gold · Platinum · Diamond · Master · Champion
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "cache-control": "public, max-age=86400, immutable" },
    }
  );
}
