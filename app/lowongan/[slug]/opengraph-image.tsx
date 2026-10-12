import { ImageResponse } from "next/og";
import { getPosting } from "@/lib/api";
import { oneLine } from "@/lib/markdown";
import { BRAND_FONT_FAMILY, KarirLockup, loadBrandFont, OG } from "@/app/og-shared";

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
          background: OG.bg,
          color: OG.fg,
          fontFamily: BRAND_FONT_FAMILY,
        }}
      >
        <KarirLockup />
        <div
          style={{
            marginTop: "56px",
            fontSize: title.length > 30 ? 60 : 76,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-2.5px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: "20px",
            fontSize: "30px",
            fontWeight: 500,
            color: OG.muted,
          }}
        >
          {oneLine(meta)}
        </div>
        {posting?.equity && (
          <div style={{ marginTop: "32px", display: "flex" }}>
            <div
              style={{
                background: OG.fg,
                color: OG.bg,
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
        <div style={{ fontSize: "24px", fontWeight: 500, color: OG.subtle }}>
          karir.kahade.id
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
