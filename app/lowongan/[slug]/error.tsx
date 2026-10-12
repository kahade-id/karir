"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, Container, EmptyState } from "@kahade/ui";

/**
 * Error boundary area detail lowongan.
 */
export default function JobDetailError({
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
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={WarningCircle}
        headingLevel={1}
        title="Terjadi kesalahan"
        description="Detail lowongan gagal dimuat. Coba lagi — bila terus gagal, kembali ke daftar lowongan."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Coba lagi</Button>
            <Button variant="secondary" onClick={() => router.push("/#lowongan")}>
              Lihat semua lowongan
            </Button>
          </div>
        }
      />
    </Container>
  );
}
