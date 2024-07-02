import { TelegramUserDetailParsed } from "@ditch/lib";
import { DateTime } from "luxon";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function CustomerInformation({
  customer
}: {
  customer: TelegramUserDetailParsed;
}) {
  const t = await getTranslations("CustomerDetailPage.CustomerInformation");
  const formatDateMed = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED, {
      locale: "en-US"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <h3 className="text-sm font-semibold">{t("customerInformation")}</h3>
          <div className="text-muted-foreground text-sm grid gap-1">
            <div className="flex justify-between">
              <p>{t("name")}:</p>
              <p>
                {customer.firstName || ""} {customer.lastName || ""}
              </p>
            </div>
            <div className="flex justify-between">
              <p>{t("username")}:</p>
              <p>{customer.username ? `@${customer.username}` : ""}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("registeredOn")}:</p>
              <p>{formatDateMed(customer.created)}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("lastVisit")}:</p>
              <p>{formatDateMed(customer.updated)}</p>
            </div>
          </div>
          <Separator />
          <h3 className="text-sm font-semibold">{t("orders")}</h3>
          <div className="grid gap-1 text-muted-foreground text-sm">
            <div className="flex justify-between">
              <p>{t("ordersCreated")}:</p>
              <p>{customer.orderCount}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("ordersPaid")}:</p>
              <p>{customer.completedPaymentCount}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("amountSpent")}:</p>
              <p>${customer.amountSpent}</p>
            </div>
          </div>
          <Separator />
          <h3 className="text-sm font-semibold">{t("carts")}</h3>
          <div className="grid gap-1 text-muted-foreground text-sm">
            <div className="flex justify-between">
              <p>{t("cartsCreated")}:</p>
              <p>{customer.cartCount}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("addedToCart")}:</p>
              <p>{customer.addedToCartCount}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("totalCartAmount")}:</p>
              <p>${customer.totalCartAmount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
