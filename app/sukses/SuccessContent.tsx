"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Alert, Button, Card, Container, CopyButton } from "@kahade/ui";
import { useSubmission } from "@/components/apply/SubmissionStore";
import { LinkButton } from "@/components/ui/LinkButton";

const inlineLink =
  "font-semibold text-fg underline decoration-line-control underline-offset-4 hover:decoration-fg";

export default function SuccessContent() {
  const { result } = useSubmission();
  const [revealed, setRevealed] = useState(false);

  const token = result?.deletionToken;

  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-narrow">
        {token ? (
          <Card className="p-6 sm:p-8">
            <h2 className="text-h4 text-fg">Token penghapusan</h2>
            <p className="mt-1 text-small text-fg-muted">Simpan token ini baik-baik:</p>
            <code className="mt-4 block rounded-control bg-surface-2 px-4 py-3 font-mono text-small font-semibold break-all text-fg">
              {revealed ? token : "••••••••••••••••••••••••••••••••"}
            </code>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                leftIcon={revealed ? EyeSlash : Eye}
                onClick={() => setRevealed((v) => !v)}
              >
                {revealed ? "Sembunyikan" : "Tampilkan"}
              </Button>
              <CopyButton text={token} label="Salin token" />
            </div>
            <p className="mt-6 max-w-reading text-small text-fg-muted sm:text-body">
              Token ini satu-satunya cara menghapus lamaranmu (beserta CV) kapan
              saja, tanpa perlu akun — misalnya lewat{" "}
              <Link href="/hapus-lamaran" className={inlineLink}>
                halaman hapus lamaran
              </Link>
              . Kami tidak menyimpannya dalam bentuk yang bisa dibaca — bila
              hilang, hubungi kami manual.
            </p>
          </Card>
        ) : (
          <Alert variant="info" title="Token penghapusan tidak tersedia">
            Halaman ini dibuka tanpa data lamaran (mis. setelah refresh). Token
            penghapusan hanya tampil sekali tepat setelah lamaran terkirim —
            catat baik-baik saat itu.
          </Alert>
        )}

        <section aria-labelledby="judul-retensi" className="mt-12 border-t border-line pt-8">
          <h2 id="judul-retensi" className="text-h4 text-fg">
            Retensi data
          </h2>
          <p className="mt-2 max-w-reading text-small text-fg-muted sm:text-body">
            Lamaran yang tidak lolos dihapus otomatis maksimal 90 hari setelah
            keputusan penolakan. Detail lengkap ada di{" "}
            <Link href="/privasi-pelamar" className={inlineLink}>
              Kebijakan Privasi Pelamar
            </Link>
            .
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/">Kembali ke beranda</LinkButton>
          <LinkButton href="/#lowongan" variant="secondary">
            Lihat lowongan lain
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
