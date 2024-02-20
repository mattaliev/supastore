"use client";

import { useClosingBehavior, useMiniApp } from "@tma.js/sdk-react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const miniApp = useMiniApp();
  const closingBehavior = useClosingBehavior();

  miniApp.setHeaderColor(miniApp.backgroundColor);
  miniApp.setBackgroundColor(miniApp.backgroundColor);
  closingBehavior.enableConfirmation();

  return <>{children}</>;
}
