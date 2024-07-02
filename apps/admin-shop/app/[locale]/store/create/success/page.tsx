import { getTranslations } from "next-intl/server";

import { Link } from "@/components/i18n/i18n-navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function StoreApplicationSuccess() {
  const t = await getTranslations("StoreApplicationSuccess");

  return (
    <div
      className={
        "grid max-w-[59rem] w-full h-[80vh] justify-center items-center mx-auto"
      }
    >
      <Card className={"m-4"}>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href={"/store"} className={"w-full"}>
            <Button size={"sm"} className={"w-full"}>
              {t("backToStores")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
