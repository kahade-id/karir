"use client";

import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, Container, EmptyState } from "@kahade/ui";

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
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={WarningCircle}
        headingLevel={1}
        title="Terjadi kesalahan"
        description="Halaman gagal dimuat. Coba lagi — bila terus gagal, kembali lagi nanti."
        action={<Button onClick={reset}>Coba lagi</Button>}
      />
    </Container>
  );
}
