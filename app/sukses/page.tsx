import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Icon, PageHeader } from "@kahade/ui";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Lamaran terkirim",
  description:
    "Konfirmasi lamaran kamu ke Kahade — simpan token penghapusan data.",
  alternates: { canonical: "/sukses" },
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Icon icon={CheckCircle} size={18} className="text-positive" />
            Lamaran berhasil dikirim
          </span>
        }
        title="Lamaran terkirim."
        lede="Terima kasih — tim kami akan meninjau dan menghubungimu via email atau nomor yang kamu cantumkan bila lolos ke tahap berikutnya."
      />
      <SuccessContent />
    </>
  );
}
