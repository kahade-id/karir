"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Alert, Button, FieldError, Input } from "@kahade/ui";
import { ApiError, deleteApplication } from "@/lib/api";

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
      <div className="mt-8">
        <Alert variant="success">
          Lamaranmu sudah dihapus beserta file CV-nya. Terima kasih atas
          ketertarikanmu pada Kahade.
        </Alert>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-black underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div ref={errorRef} tabIndex={-1} aria-live="polite">
        {error && (
          <Alert variant="danger" className="mb-5">
            {error}
          </Alert>
        )}
      </div>

      {phase === "input" ? (
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <Input
              label="Token penghapusan"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Tempel token penghapusan di sini"
              autoComplete="off"
              spellCheck={false}
              error={error && !token.trim() ? " " : undefined}
            />
            {error && !token.trim() && <FieldError>{error}</FieldError>}
          </div>
          <Button type="submit" variant="danger" className="w-full">
            Lanjut hapus lamaran
          </Button>
          <p className="text-center text-xs leading-relaxed text-neutral-500">
            Token hilang? Hubungi kami manual — detailnya ada di{" "}
            <Link href="/privasi-pelamar" className="font-semibold text-black underline">
              Kebijakan Privasi Pelamar
            </Link>
            .
          </p>
        </form>
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm font-bold text-black">
            Yakin ingin menghapus lamaran ini?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Data lamaran dan file CV akan dihapus permanen. Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
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
              className="flex-1"
              onClick={handleDelete}
              loading={submitting}
            >
              Ya, hapus permanen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
