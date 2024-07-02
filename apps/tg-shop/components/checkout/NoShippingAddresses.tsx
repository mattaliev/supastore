"use client";

import { useHapticFeedback } from "@tma.js/sdk-react";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

export default function NoShippingAddresses() {
  const hapticFeedback = useHapticFeedback();
  const t = useTranslations("ShippingPage");
  return (
    <div
      className={"flex flex-col min-h-[100vh] justify-between items-start p-4"}
    >
      <div className={"grid gap-4 w-full"}>
        <div className={"flex flex-row items-center justify-between"}>
          <h1 className={"text-telegram-text-color text-lg font-semibold"}>
            {t("title")}
          </h1>
          <Link href={"/cart"}>
            <Button size={"icon"} variant={"ghost"} className={"w-6 h-6"}>
              <XIcon className={"w-6 h-6 text-telegram-hint-color"} />
            </Button>
          </Link>
        </div>
        <p className={"text-telegram-hint-color text-base"}>
          {t("noShippingAddresses")}
        </p>
      </div>
      <div className={"w-full grid gap-2"}>
        <Link href={"/shipping/create"}>
          <Button
            className={"w-full"}
            variant={"outline"}
            onClick={() => hapticFeedback.impactOccurred("light")}
          >
            {t("addShippingAddress")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
