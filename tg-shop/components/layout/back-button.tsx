"use client";
import { useBackButton } from "@tma.js/sdk-react";
import { usePathname, useRouter } from "next/navigation";

export default function TelegramBackButton() {
  const backButton = useBackButton();

  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    backButton.hide();
  } else {
    backButton.show();
    backButton.on("click", () => {
      router.back();
    });
  }

  return null;
}
