import Link from "next/link";
import { ButtonLink, Logo } from "@kahade/ui";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="text-base font-bold tracking-tight text-black">
            Kahade <span className="font-medium text-neutral-500">Karir</span>
          </span>
        </Link>
        <ButtonLink href="/#lowongan" size="sm">
          Lihat lowongan
        </ButtonLink>
      </div>
    </header>
  );
}
