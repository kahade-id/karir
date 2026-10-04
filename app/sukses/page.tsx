import type { Metadata } from "next";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Lamaran terkirim",
  description:
    "Konfirmasi lamaran kamu ke Kahade — simpan token penghapusan data.",
  alternates: { canonical: "/sukses" },
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessContent />;
}
