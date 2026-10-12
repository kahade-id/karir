"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@kahade/ui";

const NAV = [
  { href: "/#lowongan", label: "Lowongan" },
  { href: "/#skema", label: "Skema kompensasi" },
  { href: "/#tanya-jawab", label: "Tanya jawab" },
  { href: "/privasi-pelamar", label: "Privasi pelamar" },
  { href: "/hapus-lamaran", label: "Hapus lamaran" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <SiteHeader
      site="karir"
      nav={NAV}
      cta={{ label: "Lihat lowongan", href: "/#lowongan" }}
      pathname={pathname}
      linkAs={Link}
    />
  );
}
