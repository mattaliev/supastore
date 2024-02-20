"use client";

import { useThemeParams } from "@tma.js/sdk-react";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  const theme = useThemeParams();

  return (
    <Link href="/">
      <Image
        src={theme.isDark ? "/assets/logo-white.png" : "/assets/logo.png"}
        alt="Logo"
        className="w-30 h-auto ml-2 mr-10 md:w-20"
        width={100}
        height={27}
      />
    </Link>
  );
}
