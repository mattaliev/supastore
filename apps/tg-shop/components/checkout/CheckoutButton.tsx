"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

export default function CheckoutButton({
  canCheckout
}: {
  canCheckout?: boolean;
}) {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();
  const t = useTranslations("CartPage");

  const buttonClasses =
    "w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  const disabledClasses = "cursor-not-allowed";

  if (!canCheckout) {
    return (
      <Link href={"/cart#shipping-address"}>
        <Button className={"w-full"} type={"button"}>
          {t("checkoutButton")}
        </Button>
      </Link>
    );
  }

  if (pending) {
    return (
      <Button className={clsx(buttonClasses, disabledClasses)} type={"submit"}>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      className={clsx(buttonClasses)}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
        hapticFeedback.impactOccurred("heavy");
      }}
      type={"submit"}
    >
      {t("checkoutButton")}
    </Button>
  );
}
