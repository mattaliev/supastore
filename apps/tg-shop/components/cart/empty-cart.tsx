import { getTranslations } from "next-intl/server";

import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

export default async function EmptyCart() {
  const t = await getTranslations("CartPage");

  return (
    <div className="bg-telegram-bg-color min-h-screen w-full pt-40">
      <div className="grid grid-cols-1 grid-rows-4 justify-items-center items-center gap-6">
        <p className="text-telegram-hint-color text-center text-lg">
          {t("emptyCart")}
        </p>
        <Link href={`/`}>
          <Button
            className="bg-telegram-button-color text-telegram-button-text-color"
            size="lg"
          >
            {t("shopNow")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
