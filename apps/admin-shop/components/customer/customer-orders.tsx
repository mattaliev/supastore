import { PaymentStatus, TelegramUserDetailParsed } from "@ditch/lib";
import { DateTime } from "luxon";
import Link from "next/link";

import { PaymentStatusBadge } from "@/components/order/order-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerOrders({
  customer,
}: {
  customer: TelegramUserDetailParsed;
}) {
  const formatDateMed = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED, {
      locale: "en-US",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
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
                Total
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
