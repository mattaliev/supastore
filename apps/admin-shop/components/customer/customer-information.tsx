import { TelegramUserDetailParsed } from "@ditch/lib";
import { DateTime } from "luxon";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CustomerInformation({
  customer
}: {
  customer: TelegramUserDetailParsed;
}) {
  const formatDateMed = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED, {
      locale: "en-US"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <h3 className="text-sm font-semibold">Customer information</h3>
          <div className="text-muted-foreground text-sm grid gap-1">
            <div className="flex justify-between">
              <p>Name:</p>
              <p>
                {customer.firstName || ""} {customer.lastName || ""}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Username:</p>
              <p>{customer.username ? `@${customer.username}` : ""}</p>
            </div>
            <div className="flex justify-between">
              <p>Registered on:</p>
              <p>{formatDateMed(customer.created)}</p>
            </div>
            <div className="flex justify-between">
              <p>Last visit:</p>
              <p>{formatDateMed(customer.updated)}</p>
            </div>
          </div>
          <Separator />
          <h3 className="text-sm font-semibold">Orders</h3>
          <div className="grid gap-1 text-muted-foreground text-sm">
            <div className="flex justify-between">
              <p>Orders created:</p>
              <p>{customer.orderCount}</p>
            </div>
            <div className="flex justify-between">
              <p>Orders paid:</p>
              <p>{customer.completedPaymentCount}</p>
            </div>
            <div className="flex justify-between">
              <p>Amount spent:</p>
              <p>${customer.amountSpent}</p>
            </div>
          </div>
          <Separator />
          <h3 className="text-sm font-semibold">Carts</h3>
          <div className="grid gap-1 text-muted-foreground text-sm">
            <div className="flex justify-between">
              <p>Carts created:</p>
              <p>{customer.cartCount}</p>
            </div>
            <div className="flex justify-between">
              <p>Added To Cart:</p>
              <p>{customer.addedToCartCount}</p>
            </div>
            <div className="flex justify-between">
              <p>Total cart amount:</p>
              <p>${customer.totalCartAmount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
