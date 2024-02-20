"use client";

import { clsx } from "clsx";
import { useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Button } from "@/components/ui/button";

export default function ContinueToPaymentButton() {
  const { pending } = useFormStatus();
  const buttonClass =
    "mt-4 w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  const disabledClass =
    "bg-telegram-hint-color text-telegram-text-color cursor-not-allowed";

  if (pending) {
    return (
      <Button className={clsx(buttonClass, disabledClass)}>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </Button>
    );
  }

  return <Button className={buttonClass}>Continue to payment</Button>;
}
