import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo Kahade" className="h-6 w-6" />
          <span className="font-semibold text-black">Kahade</span>
          <span className="text-neutral-400">—</span>
          <span>PT Kawal Hak Dengan Aman</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/#lowongan" className="hover:text-black">
            Lowongan
          </Link>
          <Link href="/privasi-pelamar" className="hover:text-black">
            Kebijakan privasi pelamar
          </Link>
          <a href="https://legal.kahade.id" className="hover:text-black">
            Legalitas
          </a>
          <a href="https://bantuan.kahade.id" className="hover:text-black">
            Bantuan
          </a>
          <a href="https://status.kahade.id" className="hover:text-black">
            Status
          </a>
          <a
            href="https://kahade.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            kahade.id
          </a>
        </nav>
      </div>
    </footer>
  );
}
