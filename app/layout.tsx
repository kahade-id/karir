import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SiteFooter } from "@kahade/ui";
import { Header } from "@/components/site/Header";
import { SubmissionProvider } from "@/components/apply/SubmissionStore";

// Plus Jakarta Sans self-hosted via next/font: tanpa CSS pihak ketiga yang
// memblokir render. Variabel dipasang di <html> agar token --font-sans di
// :root ikut terisi (memasangnya di <body> membuat font jatuh ke fallback).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

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
    <html lang="id" className={jakarta.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <SubmissionProvider>
          <a href="#konten-utama" className="kh-skip-link">
            Lewati ke konten utama
          </a>
          <Header />
          <main id="konten-utama" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter site="karir" linkAs={Link} />
        </SubmissionProvider>
      </body>
    </html>
  );
}
