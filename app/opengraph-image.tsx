import { ImageResponse } from "next/og";
import { BRAND_FONT_FAMILY, loadBrandFont, ZigzagMark } from "@/app/og-shared";

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
          justifyContent: "center",
          padding: "80px",
          background: "#ffffff",
          color: "#000000",
          fontFamily: BRAND_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <ZigzagMark />
        </div>
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            flexDirection: "column",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-2px",
          }}
        >
          <div>Karir di Kahade</div>
        </div>
        <div style={{ marginTop: "24px", fontSize: "28px", color: "#525252" }}>
          Bangun sosial commerce Indonesia bersama tim awal.
        </div>
        <div style={{ marginTop: "12px", fontSize: "24px", color: "#a3a3a3" }}>
          karir.kahade.id
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
