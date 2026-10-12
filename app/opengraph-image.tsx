import { ImageResponse } from "next/og";
import { BRAND_FONT_FAMILY, KarirLockup, loadBrandFont, OG } from "@/app/og-shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const revalidate = 3600;

export default async function OgImage() {
  const fonts = await loadBrandFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: OG.bg,
          color: OG.fg,
          fontFamily: BRAND_FONT_FAMILY,
        }}
      >
        <KarirLockup />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "88px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-3px",
            }}
          >
            Karir di Kahade
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "34px",
              fontWeight: 500,
              lineHeight: 1.35,
              color: OG.muted,
            }}
          >
            Bangun sosial commerce Indonesia bersama tim awal.
          </div>
        </div>
        <div style={{ fontSize: "24px", fontWeight: 500, color: OG.subtle }}>
          karir.kahade.id
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
