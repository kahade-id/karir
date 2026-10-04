"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Copy, Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { useSubmission } from "@/components/apply/SubmissionStore";

export default function SuccessContent() {
  const { result } = useSubmission();
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const token = result?.deletionToken;

  const copyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API tidak tersedia — pengguna bisa salin manual
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <div className="text-center">
        <CheckCircle
          size={56}
          className="mx-auto text-black"
          aria-hidden
        />
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-black sm:text-3xl">
          Lamaran terkirim.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
          Terima kasih — tim kami akan meninjau dan menghubungimu via email
          atau nomor yang kamu cantumkan bila lolos ke tahap berikutnya.
        </p>
      </div>

      {token ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm font-bold text-black">
            Simpan token ini baik-baik:
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-xl bg-white px-4 py-3 font-mono text-sm font-semibold text-black">
              {revealed ? token : "••••••••••••••••••••••••••••••••"}
            </code>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-black transition hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.97]"
            >
              {revealed ? (
                <>
                  <EyeSlash size={16} aria-hidden /> Sembunyikan
                </>
              ) : (
                <>
                  <Eye size={16} aria-hidden /> Tampilkan
                </>
              )}
            </button>
            <button
              type="button"
              onClick={copyToken}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.97]"
            >
              <Copy size={16} aria-hidden />
              {copied ? "Tersalin!" : "Salin token"}
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Token ini satu-satunya cara menghapus lamaranmu (beserta CV) kapan
            saja, tanpa perlu akun. Kami tidak menyimpannya dalam bentuk yang
            bisa dibaca — bila hilang, hubungi kami manual.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
          <p className="text-sm leading-relaxed text-neutral-600">
            Halaman ini dibuka tanpa data lamaran (mis. setelah refresh).
            Token penghapusan hanya tampil sekali tepat setelah lamaran
            terkirim — catat baik-baik saat itu.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-sm font-bold text-black">Retensi data</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Lamaran yang tidak lolos dihapus otomatis maksimal 90 hari setelah
          keputusan penolakan. Detail lengkap ada di{" "}
          <Link href="/privasi-pelamar" className="font-semibold text-black underline">
            Kebijakan Privasi Pelamar
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.98]"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
