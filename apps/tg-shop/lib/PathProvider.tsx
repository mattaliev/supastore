"use client";
import { useLaunchParams } from "@tma.js/sdk-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { getPath } from "@/lib/path";

export default function PathProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const launchParams = useLaunchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (launchParams.startParam) {
      const path = getPath(launchParams.startParam);

      if (!pathname.includes(path)) {
        const fullPath = `${pathname}/${path}`;
        push(fullPath, { scroll: true });
      }
    }
  }, []);

  return children;
}
