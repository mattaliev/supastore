"use client";

import { useHapticFeedback } from "@tma.js/sdk-react";

import Link from "@/components/navigation/link";
import { PencilIcon } from "@/components/ui/icons";

export default function UpdateContactInformation() {
  const hapticFeedback = useHapticFeedback();
  return (
    <Link href={"/contact-info"}>
      <PencilIcon
        className="w-4 h-4 ml-2 text-telegram-hint-color hover:text-telegram-button-color"
        onClick={() => hapticFeedback.impactOccurred("light")}
      />
    </Link>
  );
}
