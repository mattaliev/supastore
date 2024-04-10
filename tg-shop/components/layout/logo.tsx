"use client";

import Link from "next/link";

import { LogoIcon } from "@/components/ui/icons";

export default function Logo() {
  return (
    <Link href="/">
      <LogoIcon className="text-telegram-text-color fill-telegram-text-color stroke-telegram-text-color stroke-0 w-24 h-8" />
    </Link>
  );
}
