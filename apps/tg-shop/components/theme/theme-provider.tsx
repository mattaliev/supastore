"use client";

import { useMiniApp } from "@tma.js/sdk-react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const miniApp = useMiniApp();

  miniApp.setHeaderColor(miniApp.backgroundColor);
  miniApp.setBackgroundColor(miniApp.backgroundColor);

  return <>{children}</>;
}
