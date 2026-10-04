import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { SubmissionProvider } from "@/components/apply/SubmissionStore";

// Font brand: Plus Jakarta Sans, dimuat dari Google Fonts CDN.
// (Sebelumnya via next/font self-hosted — gagal render di sebagian perangkat
// Android: file valid & 200 tapi browser jatuh ke fallback. CDN terbukti tampil
// benar di perangkat yang terdampak, jadi pakai jalur yang terbukti.)
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap";

export const metadata: Metadata = {
  title: {
    default: "Karir di Kahade — Lowongan Kerja Startup Indonesia",
    template: "%s — Karir Kahade",
  },
  description:
    "Lowongan kerja startup di Kahade, aplikasi jual-beli pengguna ke pengguna yang tampilannya seperti media sosial. Tim awal tanpa gaji, dengan skema saham/equity — lihat posisi yang terbuka.",
  metadataBase: new URL("https://karir.kahade.id"),
  icons: {
    // PNG berukuran eksplisit untuk tab browser; SVG tetap sebagai fallback
    // modern. apple-touch-icon WAJIB PNG 180×180 (SVG tidak valid di sini).
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Karir Kahade",
    title: "Karir di Kahade — Lowongan Kerja Startup Indonesia",
    description:
      "Lowongan kerja startup di Kahade. Tim awal tanpa gaji, dengan skema saham/equity.",
    // Gambar og:image diambil otomatis dari app/opengraph-image.tsx (PNG
    // 1200×630). Jangan set images eksplisit ke /logo.svg — SVG tidak
    // di-render scraper sosial (Facebook/X/WhatsApp).
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body>
        <SubmissionProvider>
          <div className="flex min-h-screen flex-col bg-white text-black">
            {/* Skip-to-content: lompat ke konten utama tanpa tab berkali-kali. */}
            <a
              href="#konten"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-black focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
            >
              Lewati ke konten
            </a>
            <Header />
            <main id="konten" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </div>
        </SubmissionProvider>
      </body>
    </html>
  );
}
