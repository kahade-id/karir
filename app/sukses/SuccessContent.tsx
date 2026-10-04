"use client";

import Link from "next/link";
import { CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button, CopyButton, Icon } from "@kahade/ui";
import { useState } from "react";
import { useSubmission } from "@/components/apply/SubmissionStore";
import ButtonLink from "@/components/site/ButtonLink";

export default function SuccessContent() {
  const { result } = useSubmission();
  const [revealed, setRevealed] = useState(false);

  const token = result?.deletionToken;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <div className="text-center">
        <Icon icon={CheckCircle} size={56} className="mx-auto text-black" />
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={revealed ? EyeSlash : Eye}
              onClick={() => setRevealed((v) => !v)}
            >
              {revealed ? "Sembunyikan" : "Tampilkan"}
            </Button>
            <CopyButton text={token} label="Salin token" />
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
        <ButtonLink href="/">Kembali ke beranda</ButtonLink>
      </div>
    </div>
  );
}
