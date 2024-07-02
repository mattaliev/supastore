"use client";
import { useTranslations } from "next-intl";

import { useRouter } from "@/components/i18n/i18n-navigation";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const storeId = useStore();
  const router = useRouter();
  const t = useTranslations("UnauthorizedPage");

  return (
    <div
      className={
        "h-[80vh] flex flex-col items-center justify-center gap-4 text-center"
      }
    >
      <div className={"grid gap-1"}>
        <h1 className={"text-2xl font-semibold text-telegram-text-color"}>
          {t("unauthorized")}
        </h1>
        <p className={"text-telegram-hint-color"}>{t("unauthorizedMessage")}</p>
      </div>
      <Button onClick={() => router.push(`/store/${storeId}`)}>
        {t("goToCatalog")}
      </Button>
    </div>
  );
}
