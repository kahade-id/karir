import type { Metadata } from "next";
import ButtonLink from "@/components/site/ButtonLink";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description: "Halaman yang kamu cari tidak ada di situs karir Kahade.",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="text-5xl font-bold tracking-tight text-black">404</p>
      <h1 className="mt-4 text-xl font-bold text-black">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Mungkin alamatnya salah ketik atau halaman sudah dipindahkan.
      </p>
      <ButtonLink href="/" className="mt-8 px-6 py-3">
        Kembali ke beranda
      </ButtonLink>
    </div>
  );
}
