import type { Metadata } from "next";
import Link from "next/link";

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
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.98]"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
