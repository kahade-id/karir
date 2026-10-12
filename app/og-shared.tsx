import { LOGO_PATHS, LOGO_VIEWBOX } from "@kahade/ui";

/**
 * Utilitas bersama untuk OG image (PNG 1200×630): mark Kahade + lockup
 * "Karir" + pemuat font Plus Jakarta Sans dari Google Fonts dengan fallback
 * aman ke sans-serif bila fetch gagal (mis. saat build offline).
 *
 * Gaya mengikuti Kahade Design Language v1: latar hitam, mark kuning
 * (#FFD200 — satu-satunya tempat kuning), teks putih tebal.
 *
 * File ini BUKAN route (nama non-spesial) — hanya modul yang dipakai
 * app/opengraph-image.tsx dan app/lowongan/[slug]/opengraph-image.tsx.
 */

/** Warna OG (ImageResponse tidak membaca token CSS). */
export const OG = {
  bg: "#000000",
  fg: "#FFFFFF",
  muted: "rgba(255,255,255,0.72)",
  subtle: "rgba(255,255,255,0.55)",
  line: "rgba(255,255,255,0.3)",
  brand: "#FFD200",
} as const;

/**
 * Mark zigzag Kahade — geometri resmi dari @kahade/ui (`LOGO_PATHS`,
 * sama dengan komponen `Logo`). Jangan digambar ulang.
 */
export function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={(size * 417.6) / 512}
      height={size}
      viewBox={LOGO_VIEWBOX}
      fill={OG.brand}
    >
      {LOGO_PATHS.map((d) => (
        <path key={d.slice(0, 12)} d={d} />
      ))}
    </svg>
  );
}

/** Lockup header: mark │ Karir — sama seperti SiteHeader. */
export function KarirLockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <BrandMark size={60} />
      <div style={{ width: "2px", height: "36px", background: OG.line }} />
      <div
        style={{
          fontSize: "32px",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          color: OG.fg,
        }}
      >
        Karir
      </div>
    </div>
  );
}

/** Font stack brand untuk OG image (sama seperti --font-sans di web). */
export const BRAND_FONT_FAMILY = "'Plus Jakarta Sans', sans-serif";

interface BrandFont {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 800;
  style: "normal";
}

/**
 * Unduh Plus Jakarta Sans (500 & 800) untuk ImageResponse. Google Fonts
 * mengirim TTF untuk user-agent non-browser — format yang didukung Satori
 * (WOFF2 tidak). Mengembalikan undefined bila gagal — pemanggil fallback ke
 * sans-serif.
 */
export async function loadBrandFont(): Promise<BrandFont[] | undefined> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; KahadeBot/1.0)" } }
    ).then((res) => {
      if (!res.ok) throw new Error(`font css ${res.status}`);
      return res.text();
    });

    const faces = Array.from(
      css.matchAll(
        /font-weight:\s*(\d+);[^}]*?url\((https:\/\/[^)]+\.(?:ttf|otf|woff))\)/g
      )
    )
      .map((m) => ({ weight: Number(m[1]), url: m[2] }))
      .filter(
        (f): f is { weight: 500 | 800; url: string } =>
          f.weight === 500 || f.weight === 800
      );
    if (faces.length === 0) return undefined;

    return await Promise.all(
      faces.map(async (f) => {
        const res = await fetch(f.url);
        if (!res.ok) throw new Error(`font file ${res.status}`);
        return {
          name: "Plus Jakarta Sans",
          data: await res.arrayBuffer(),
          weight: f.weight,
          style: "normal" as const,
        };
      })
    );
  } catch {
    return undefined;
  }
}
