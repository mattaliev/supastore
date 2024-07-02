import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function CustomerListHeader() {
  const t = await getTranslations("CustomerListPage.Header");

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <div className="grid sm:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("storeSessionsThisWeek")}</CardDescription>
          <CardTitle className={"text-4xl"}>240</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={"text-muted-foreground text-xs"}>
            +25% {t("fromLastWeek")}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("storeSessionsThisMonth")}</CardDescription>
          <CardTitle className={"text-4xl"}>240</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={"text-muted-foreground text-xs"}>
            +25% {t("fromLastMonth")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
