import { ImageResponse } from "next/og";
import { getPosting } from "@/lib/api";
import { BRAND_FONT_FAMILY, loadBrandFont, ZigzagMark } from "@/app/og-shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Cache gambar OG per lowongan 1 jam (seirama revalidate halaman). */
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * OG image UNIK per lowongan: judul posisi + lokasi/tipe + badge equity.
 * Bila API gagal, tampilkan desain generik (bukan error) agar share card
 * tidak pernah rusak.
 */
export default async function JobOgImage({ params }: Props) {
  const { slug } = await params;
  let posting: Awaited<ReturnType<typeof getPosting>> | null = null;
  try {
    posting = await getPosting(slug);
  } catch {
    posting = null;
  }

  const fonts = await loadBrandFont();
  const title = posting?.title ?? "Lowongan kerja di Kahade";
  const meta = posting
    ? `${posting.location} · ${posting.type}`
    : "Tim awal tanpa gaji, dengan saham/equity.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px",
          background: "#ffffff",
          color: "#000000",
          fontFamily: BRAND_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <ZigzagMark size={64} />
          {/* Satori: div dengan >1 child wajib display eksplisit. */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            <span>Kahade</span>
            <span style={{ color: "#737373", fontWeight: 500 }}>Karir</span>
          </div>
        </div>
        <div
          style={{
            marginTop: "36px",
            fontSize: title.length > 30 ? 58 : 72,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-2px",
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: "20px", fontSize: "30px", color: "#525252" }}>
          {meta}
        </div>
        {posting?.equity && (
          <div style={{ marginTop: "28px", display: "flex" }}>
            <div
              style={{
                background: "#000000",
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: 800,
                padding: "14px 30px",
                borderRadius: "999px",
              }}
            >
              {posting.equity}
            </div>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: "24px", color: "#a3a3a3" }}>
          karir.kahade.id
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
