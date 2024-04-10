"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import Link from "next/link";

import { PencilIcon } from "@/components/ui/icons";

export default function UpdateShippingDetailsButton() {
  const hapticFeedback = useHapticFeedback();

  return (
    <Link href={`/checkout/shipping?update=true`}>
      <PencilIcon
        className="w-4 h-4 ml-2 text-telegram-hint-color hover:text-telegram-button-color"
        onClick={() => hapticFeedback.impactOccurred("light")}
      />
    </Link>
  );
}
