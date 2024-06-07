"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import Link from "@/components/navigation/link";

export default function Logo() {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === "dark") {
    return (
      <Link href={"/"} inStore={false} className={"font-semibold text-xl"}>
        <Image
          src={"/supastore-logo-with-text-dark.svg"}
          alt={"Supastore Logo"}
          className={"cursor-pointer object-contain"}
          width={125}
          height={45}
        />
      </Link>
    );
  }

  return (
    <Link href={"/"} inStore={false} className={"font-semibold text-xl"}>
      <Image
        src={"/supastore-logo-with-text-light.svg"}
        alt={"Supastore Logo"}
        className={"cursor-pointer object-contain"}
        width={125}
        height={45}
      />
    </Link>
  );
}
