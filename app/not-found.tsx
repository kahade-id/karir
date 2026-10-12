import type { Metadata } from "next";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Container, EmptyState } from "@kahade/ui";
import { LinkButton } from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description: "Halaman yang kamu cari tidak ada di situs karir Kahade.",
  alternates: { canonical: "/" },
};

/**
 * 404 — dirender di dalam root layout (SiteHeader + SiteFooter sudah ada).
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={MagnifyingGlass}
        headingLevel={1}
        title="Halaman tidak ditemukan"
        description="Mungkin alamatnya salah ketik atau halaman sudah dipindahkan."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton href="/">Kembali ke beranda</LinkButton>
            <LinkButton href="/#lowongan" variant="secondary">
              Lihat lowongan
            </LinkButton>
          </div>
        }
      />
    </Container>
  );
}
