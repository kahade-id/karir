import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { SubmissionProvider } from "@/components/apply/SubmissionStore";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={jakarta.variable}>
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
