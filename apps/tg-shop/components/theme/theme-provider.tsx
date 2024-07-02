"use client";

import { useMiniApp, useViewport } from "@tma.js/sdk-react";

export default function ThemeProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const miniApp = useMiniApp();
  const viewport = useViewport();

  miniApp.setHeaderColor(miniApp.backgroundColor);
  miniApp.setBackgroundColor(miniApp.backgroundColor);
  viewport.expand();

  return <>{children}</>;
}
