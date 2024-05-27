"use client";

import { useThemeParams } from "@tma.js/sdk-react";
import Image from "next/image";
import Link from "next/link";

export default function Logo({
  storeId,
  logoLight,
  logoDark
}: {
  storeId: string;
  logoLight?: string;
  logoDark?: string;
}) {
  const themeParams = useThemeParams();

  if (!logoLight && !logoDark) {
    return null;
  }

  if (themeParams.isDark && logoLight) {
    return (
      <Link href={`/store/${storeId}`}>
        <Image
          src={logoLight}
          alt="Logo"
          width={200}
          height={200}
          className="w-24 h-8 object-contain"
        />
      </Link>
    );
  }

  return (
    <Link href={`/store/${storeId}`}>
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
