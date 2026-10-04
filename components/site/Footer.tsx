import Link from "next/link";
import { Logo } from "@kahade/ui";

const SIBLINGS = [
  { label: "Legalitas", href: "https://legal.kahade.id" },
  { label: "Bantuan", href: "https://bantuan.kahade.id" },
  { label: "Status Layanan", href: "https://status.kahade.id" },
  { label: "Investor", href: "https://investor.kahade.id" },
  { label: "Artikel", href: "https://artikel.kahade.id" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-4xl px-5 py-8 text-sm text-neutral-600">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo dekoratif: teks "Kahade" di sebelahnya sudah dibaca SR. */}
            <span aria-hidden="true">
              <Logo size={24} />
            </span>
            <span className="font-semibold text-black">Kahade</span>
            <span className="text-neutral-500">—</span>
            <span>PT Kawal Hak Dengan Aman</span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/#lowongan" className="inline-flex items-center py-3 hover:text-black">
              Lowongan
            </Link>
            <Link href="/privasi-pelamar" className="inline-flex items-center py-3 hover:text-black">
              Kebijakan privasi pelamar
            </Link>
            <Link href="/hapus-lamaran" className="inline-flex items-center py-3 hover:text-black">
              Hapus lamaran
            </Link>
            {SIBLINGS.map((l) => (
              <a key={l.href} href={l.href} className="inline-flex items-center py-3 hover:text-black">
                {l.label}
              </a>
            ))}
            <a href="https://kahade.id" className="inline-flex items-center py-3 hover:text-black">
              kahade.id
            </a>
          </nav>
        </div>
        <p className="mt-6 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
          © {year} PT Kawal Hak Dengan Aman. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
