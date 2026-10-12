import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, Container, EmptyState } from "@kahade/ui";

/**
 * Panel error saat fetch detail lowongan gagal (bukan 404).
 * Dipakai /lowongan/[slug] dan /lamar/[slug].
 */
export default function PostingLoadError({ retryHref }: { retryHref: string }) {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={WarningCircle}
        headingLevel={1}
        title="Gagal memuat data lowongan."
        description="Periksa koneksi internetmu lalu coba lagi. Bila terus gagal, kembali ke daftar lowongan."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            {/* <a> biasa agar full reload dan fetch server diulang. */}
            <ButtonLink href={retryHref}>Coba lagi</ButtonLink>
            <ButtonLink href="/#lowongan" variant="secondary">
              Lihat semua lowongan
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
