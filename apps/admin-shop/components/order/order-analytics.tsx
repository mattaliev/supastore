import { salesAnalyticsGet } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function OrderAnalytics({ storeId }: { storeId: string }) {
  const {
    salesThisWeek,
    salesThisMonth,
    salesIncreaseThisWeek,
    salesIncreaseThisMonth
  } = await salesAnalyticsGet({ storeId });
  const t = await getTranslations("OrderListPage");

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {t("description")}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("this-week")}</CardDescription>
          <CardTitle className="text-4xl">${salesThisWeek}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {salesIncreaseThisWeek >= 0
              ? "+" + salesIncreaseThisWeek
              : salesIncreaseThisWeek}
            % {t("from-last-week")}
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={Math.abs(salesIncreaseThisWeek)}
            aria-label={
              salesIncreaseThisWeek >= 0
                ? "+" + salesIncreaseThisWeek + "% " + t("increase")
                : salesIncreaseThisWeek + "% " + t("decrease")
            }
            indicatorColor={
              salesIncreaseThisWeek >= 0 ? "bg-primary" : "bg-destructive"
            }
          />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("this-month")}</CardDescription>
          <CardTitle className="text-4xl">${salesThisMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {salesIncreaseThisMonth > 0
              ? "+" + salesIncreaseThisMonth
              : salesIncreaseThisMonth}
            % {t("from-last-month")}
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={Math.abs(salesIncreaseThisMonth)}
            aria-label={
              salesIncreaseThisMonth > 0
                ? "+" + salesIncreaseThisMonth + "% " + t("increase")
                : salesIncreaseThisMonth + "% " + t("decrease")
            }
            indicatorColor={
              salesIncreaseThisMonth > 0 ? "bg-primary" : "bg-destructive"
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
