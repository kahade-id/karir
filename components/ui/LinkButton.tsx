"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import {
  buttonClasses,
  buttonIconSize,
  Icon,
  type ButtonSize,
  type ButtonVariant,
} from "@kahade/ui";

const ICONS = { "arrow-right": ArrowRight, "arrow-down": ArrowDown } as const;

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ikon di kanan label (nama, bukan komponen — aman dioper dari server). */
  icon?: keyof typeof ICONS;
  className?: string;
  children: ReactNode;
}

/**
 * Tautan internal (next/link) dengan visual tombol DS. Ikon dipilih lewat
 * nama agar server component tidak perlu mengoper komponen ikon ke client.
 */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      <span>{children}</span>
      {icon && <Icon icon={ICONS[icon]} size={buttonIconSize(size)} />}
    </Link>
  );
}
