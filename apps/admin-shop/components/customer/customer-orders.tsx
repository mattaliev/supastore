import { PaymentStatus, TelegramUserDetailParsed } from "@ditch/lib";
import { DateTime } from "luxon";
import { getTranslations } from "next-intl/server";

import Link from "@/components/navigation/link";
import { PaymentStatusBadge } from "@/components/order/order-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default async function CustomerOrders({
  customer
}: {
  customer: TelegramUserDetailParsed;
}) {
  const formatDateMed = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED, {
      locale: "en-US"
    });
  };

  const t = await getTranslations("CustomerDetailPage.CustomerOrders");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("TableHead.order")} #</TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("TableHead.date")}
              </TableHead>
              <TableHead>{t("TableHead.status")}</TableHead>
              <TableHead>{t("TableHead.total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customer.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-muted-foreground hover:underline">
                  <Link href={`/orders/edit/${order.id}`}>
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDateMed(order.created)}
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <PaymentStatusBadge
                    paymentStatus={
                      order.payment?.paymentStatus || PaymentStatus.UNPAID
                    }
                  />
                </TableCell>
                <TableCell>${order.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="text-left">
                {t("TableHead.total")}
              </TableCell>
              <TableCell className="hidden sm:table-cell"></TableCell>
              <TableCell>${customer.amountSpent}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
