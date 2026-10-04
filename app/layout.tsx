import type { Metadata } from "next";
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
    default: "Karier di Kahade — Bangun Sosial Commerce Indonesia",
    template: "%s — Karier Kahade",
  },
  description:
    "Bergabung dengan tim awal Kahade. Skema kompensasi transparan: tanpa gaji, dengan saham/equity. Lihat lowongan yang terbuka.",
  metadataBase: new URL("https://karir.kahade.id"),
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Karier Kahade",
    title: "Karier di Kahade — Bangun Sosial Commerce Indonesia",
    description:
      "Bergabung dengan tim awal Kahade. Skema kompensasi transparan: tanpa gaji, dengan saham/equity.",
    images: [{ url: "/logo.svg", alt: "Logo Kahade" }],
  },
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
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SubmissionProvider>
      </body>
    </html>
  );
}
