"use client";

import { useThemeParams } from "@tma.js/sdk-react";
import Image from "next/image";

import Link from "@/components/navigation/link";

export default function Logo({
  logoLight,
  logoDark
}: {
  logoLight?: string;
  logoDark?: string;
}) {
  const themeParams = useThemeParams();

  if (!logoLight && !logoDark) {
    return null;
  }

  if (themeParams.isDark && logoLight) {
    return (
      <Link href={`/`}>
        <Image
          src={logoLight}
          alt="Logo"
          width={200}
          height={200}
          className="w-24 h-8 object-contain cursor-pointer"
        />
      </Link>
    );
  }

  return (
    <Link href={`/`}>
      <Image
        src={logoDark || logoLight || ""}
        alt="Logo"
        width={200}
        height={200}
        className="w-24 h-8 object-contain"
      />
    </Link>
  );
}
