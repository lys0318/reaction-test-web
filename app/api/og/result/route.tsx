import { ImageResponse } from "next/og";

function readParam(url: URL, key: string, fallback: string) {
  return url.searchParams.get(key)?.slice(0, 80) || fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "ko";
  const score = readParam(url, "score", locale === "ko" ? "결과" : "Result");
  const tier = readParam(url, "tier", locale === "ko" ? "티어" : "Tier");
  const top = readParam(url, "top", locale === "ko" ? "상위 기록" : "Top result");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "linear-gradient(135deg, #020617 0%, #06111f 50%, #082f49 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: 1 }}>Testier</div>
          <div
            style={{
              border: "2px solid rgba(34, 211, 238, 0.55)",
              borderRadius: 999,
              padding: "12px 24px",
              color: "#a7f3d0",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            {locale === "ko" ? "결과 공유" : "Result Share"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#67e8f9", fontSize: 34, fontWeight: 900 }}>
            {locale === "ko" ? "내 테스트 결과" : "My Test Result"}
          </div>
          <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 1 }}>{score}</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                borderRadius: 24,
                background: "rgba(34, 211, 238, 0.14)",
                border: "2px solid rgba(34, 211, 238, 0.35)",
                padding: "22px 28px",
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              {tier}
            </div>
            <div
              style={{
                borderRadius: 24,
                background: "rgba(16, 185, 129, 0.13)",
                border: "2px solid rgba(16, 185, 129, 0.35)",
                padding: "22px 28px",
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              {top}
            </div>
          </div>
        </div>
        <div style={{ color: "#cbd5e1", fontSize: 28 }}>
          {locale === "ko" ? "test + tier, 테스트하고 티어로 확인하세요" : "test + tier, measure your score and tier"}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
