"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, Container, EmptyState } from "@kahade/ui";

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
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={WarningCircle}
        headingLevel={1}
        title="Terjadi kesalahan"
        description="Formulir lamaran gagal dimuat. Coba lagi — data yang sudah kamu isi mungkin perlu diisi ulang."
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
