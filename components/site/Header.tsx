import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo Kahade" className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-black">
            Kahade <span className="font-medium text-neutral-500">Karier</span>
          </span>
        </Link>
        <Link
          href="/#lowongan"
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Lihat lowongan
        </Link>
      </div>
    </header>
  );
}
