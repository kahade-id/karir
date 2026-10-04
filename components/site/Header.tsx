import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo Kahade" className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-black">
            Kahade <span className="font-medium text-neutral-500">Karier</span>
          </span>
        </Link>
        {/* Link navigasi: <a> dengan visual tombol DS primary/sm.
            (Button DS hanya me-render <button>; <button> di dalam <a> invalid.) */}
        <Link
          href="/#lowongan"
          className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.97]"
        >
          Lihat lowongan
        </Link>
      </div>
    </header>
  );
}
