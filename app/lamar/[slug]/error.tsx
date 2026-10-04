"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button } from "@kahade/ui";

/**
 * Error boundary area formulir lamaran.
 */
export default function ApplyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Alert variant="danger" title="Terjadi kesalahan.">
        Formulir lamaran gagal dimuat. Coba lagi — data yang sudah kamu isi
        mungkin perlu diisi ulang.
      </Alert>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset}>Coba lagi</Button>
        <Button variant="secondary" onClick={() => router.push("/#lowongan")}>
          Lihat semua lowongan
        </Button>
      </div>
    </div>
  );
}
