"use client";

import { useEffect } from "react";
import { Alert, Button } from "@kahade/ui";

/**
 * Error boundary area beranda karir — tampil bila render daftar lowongan
 * gagal di sisi klien/server component boundary.
 */
export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Alert variant="danger" title="Terjadi kesalahan.">
        Halaman gagal dimuat. Coba lagi — bila terus gagal, kembali lagi
        nanti.
      </Alert>
      <div className="mt-6">
        <Button onClick={reset} className="w-full sm:w-auto">
          Coba lagi
        </Button>
      </div>
    </div>
  );
}
