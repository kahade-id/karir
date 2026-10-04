import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Link dengan visual tombol DS primary.
 * (Button DS hanya me-render <button>; <button> di dalam <a> invalid,
 * jadi link-butuh-tombol pakai komponen ini.)
 */
export default function ButtonLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition-all duration-150 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.97] ${className}`}
    >
      {children}
    </Link>
  );
}
