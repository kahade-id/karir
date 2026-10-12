"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Alert, Button, Card, Input } from "@kahade/ui";
import { LinkButton } from "@/components/ui/LinkButton";
import { ApiError, deleteApplication } from "@/lib/api";

const inlineLink =
  "font-semibold text-fg underline decoration-line-control underline-offset-4 hover:decoration-fg";

type Phase = "input" | "confirm" | "done";

export default function DeleteApplicationForm() {
  const [token, setToken] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const showError = (message: string) => {
    setError(message);
    requestAnimationFrame(() =>
      errorRef.current?.scrollIntoView({ block: "center" })
    );
    // Pindahkan fokus ke pesan error agar terbaca screen reader.
    requestAnimationFrame(() =>
      errorRef.current?.focus({ preventScroll: true })
    );
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const value = token.trim();
    if (!value) {
      showError("Masukkan token penghapusan terlebih dahulu.");
      return;
    }
    setError(null);
    setPhase("confirm");
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await deleteApplication(token.trim());
      setPhase("done");
    } catch (err) {
      showError(
        err instanceof ApiError ? err.message : "Terjadi kesalahan. Silakan coba lagi."
      );
      setPhase("input");
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === "done") {
    return (
      <div>
        <Alert variant="success">
          Lamaranmu sudah dihapus beserta file CV-nya. Terima kasih atas
          ketertarikanmu pada Kahade.
        </Alert>
        <LinkButton href="/" variant="secondary" className="mt-6">
          Kembali ke beranda
        </LinkButton>
      </div>
    );
  }

  return (
    <div>
      <div ref={errorRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {error && (
          <Alert variant="danger" className="mb-6">
            {error}
          </Alert>
        )}
      </div>

      {phase === "input" ? (
        <form onSubmit={handleCheck} className="space-y-6">
          <Input
            id="deletion-token"
            label="Token penghapusan"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Tempel token penghapusan di sini"
            autoComplete="off"
            spellCheck={false}
            className={token ? "font-mono" : ""}
          />
          <Button
            type="submit"
            variant="danger"
            className="w-full sm:w-auto"
            disabled={!token.trim()}
          >
            Lanjut hapus lamaran
          </Button>
          <p className="border-t border-line pt-6 text-small text-fg-muted">
            Token hilang? Hubungi kami manual — detailnya ada di{" "}
            <Link href="/privasi-pelamar" className={inlineLink}>
              Kebijakan Privasi Pelamar
            </Link>
            .
          </p>
        </form>
      ) : (
        <Card className="p-6 sm:p-8">
          <h2 className="text-h4 text-fg">Yakin ingin menghapus lamaran ini?</h2>
          <p className="mt-2 text-small text-fg-muted sm:text-body">
            Data lamaran dan file CV akan dihapus permanen. Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPhase("input");
                setError(null);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              loading={submitting}
            >
              Ya, hapus permanen
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
