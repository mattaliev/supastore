import { XIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import ShippingAddressMap from "@/components/apps/google-maps/ShippingDetailsMap";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

export default async function ShippingAddressPage() {
  const t = await getTranslations("ShippingCreatePage");

  return (
    <div className={"flex flex-col space-y-2"}>
      <div className={"flex flex-row justify-between items-center p-4"}>
        <h1 className={"text-telegram-text-color text-lg font-semibold"}>
          {t("title")}
        </h1>
        <Link href={"/shipping"}>
          <Button size={"icon"} variant={"ghost"} className={"w-6 h-6"}>
            <XIcon className={"w-6 h-6 text-telegram-hint-color"} />
          </Button>
        </Link>
      </div>
      <div className={"h-[95vh]"}>
        <ShippingAddressMap />
      </div>
    </div>
  );
}
