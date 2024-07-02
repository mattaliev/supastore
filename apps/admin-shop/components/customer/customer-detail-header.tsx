"use client";
import { TelegramUserDetailParsed } from "@ditch/lib";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function CustomerDetailHeader({
  customer
}: {
  customer: TelegramUserDetailParsed;
}) {
  const { back } = useRouter();
  const t = useTranslations("CustomerDetailPage.Header");

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        type="button"
        onClick={() => back()}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">{t("back")}</span>
      </Button>

      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {customer.firstName} {customer.lastName}
      </h1>

      <div className={"hidden md:ml-auto md:flex items-center gap-2"}>
        <Button size={"sm"} type={"button"} variant="default">
          {t("sendMessage")}
        </Button>
      </div>
    </div>
  );
}
