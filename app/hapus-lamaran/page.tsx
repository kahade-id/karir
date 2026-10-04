import type { Metadata } from "next";
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
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
          Hapus lamaran
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
          Masukkan token penghapusan yang kamu terima setelah melamar. Lamaran
          beserta file CV akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
      </div>
      <DeleteApplicationForm />
    </div>
  );
}
