import type { Metadata } from "next";
import { Breadcrumb, Container, PageHeader } from "@kahade/ui";
import DeleteApplicationForm from "./DeleteApplicationForm";

export const metadata: Metadata = {
  title: "Hapus lamaran",
  description:
    "Hapus lamaran kerja kamu ke Kahade beserta file CV menggunakan token penghapusan.",
  alternates: { canonical: "/hapus-lamaran" },
  robots: { index: false, follow: false },
};

export default function HapusLamaranPage() {
  return (
    <>
      <PageHeader
        breadcrumb={
          <Breadcrumb items={[{ label: "Karir", href: "/" }, { label: "Hapus lamaran" }]} />
        }
        title="Hapus lamaran"
        lede="Masukkan token penghapusan yang kamu terima setelah melamar. Lamaran beserta file CV akan dihapus permanen dan tidak bisa dikembalikan."
      />
      <Container className="py-12 sm:py-16">
        <div className="max-w-reading">
          <DeleteApplicationForm />
        </div>
      </Container>
    </>
  );
}
