"use client";

import { useHapticFeedback } from "@tma.js/sdk-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/components/i18n/i18n-navigation";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const storeId = useStore();
  const router = useRouter();
  const hapticFeedback = useHapticFeedback();
  const t = useTranslations("ErrorPage");

  return (
    <div
      className={
        "text-telegram-text-color flex flex-col h-[80vh] justify-center items-center gap-6"
      }
    >
      <h1 className={"text-2xl font-semibold"}>{t("somethingWentWrong")}</h1>
      <div className={"flex flex-row items-center justify-center gap-2"}>
        <Button
          onClick={() => {
            reset();
            hapticFeedback.impactOccurred("light");
          }}
        >
          {t("tryAgain")}
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            hapticFeedback.impactOccurred("light");
            router.push(`/store/${storeId}`);
          }}
        >
          {t("goToCatalog")}
        </Button>
      </div>
    </div>
  );
}
