import { Order, PaymentStatus } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import Link from "@/components/navigation/link";
import { PaymentStatusBadge } from "@/components/order/order-badges";
import OrderFilters from "@/components/order/order-filters";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateShort } from "@/lib/utils";

export default async function OrderList({
  orders,
  page,
  limit,
  totalOrderCount
}: {
  orders?: Order[];
  page: number;
  totalOrderCount: number;
  limit: number;
}) {
  const firstProductIndex = (page - 1) * limit + 1;
  const lastProductIndex = Math.min(page * limit, totalOrderCount);
  const t = await getTranslations("OrderListPage.OrderListTable");

  return (
    <div className="grid gap-3">
      <OrderFilters />
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {totalOrderCount === 0 ? (
            <NoOrdersYet />
          ) : (
            <OrderTable orders={orders} />
          )}

          <CardFooter>
            <div className="text-xs text-muted-foreground">
              {t("Footer.showing") + " "}
              <strong>
                {firstProductIndex} - {lastProductIndex}
              </strong>{" "}
              {t("Footer.of")} <strong>{totalOrderCount}</strong>{" "}
              {t("Footer.orders")}
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

async function OrderTable({ orders }: { orders?: Order[] }) {
  const t = await getTranslations("OrderListPage.OrderListTable");

  return (
    <Table containerClassname={"w-full overflow-x-auto relative"}>
      <TableHeader>
        <TableRow>
          <TableHead>{t("order")} #</TableHead>
          <TableHead>{t("customer")}</TableHead>
          <TableHead className="hidden sm:table-cell">{t("status")}</TableHead>
          <TableHead className="hidden md:table-cell">{t("date")}</TableHead>
          <TableHead className="text-right">{t("amount")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-auto">
        {orders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/orders/edit/${order.id}`}>
                <p className="text-gray-500 underline">{order.orderNumber}</p>
              </Link>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {!order.user?.firstName &&
                  !order.user?.lastName &&
                  t("anonymous")}
                {order.user?.firstName || ""} {order.user?.lastName || ""}
              </div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order.user?.username ? "@" + order.user?.username : ""}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <PaymentStatusBadge
                paymentStatus={
                  order.payment?.paymentStatus || PaymentStatus.UNPAID
                }
              />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {formatDateShort(order.created)}
            </TableCell>
            <TableCell className="text-right">
              {"$" + order.totalAmount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function NoOrdersYet() {
  const t = await getTranslations("OrderListPage.NoOrdersYet");

  return (
    <div className="flex flex-1 items-center justify-center h-64">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{t("heading")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <Link href={`/orders`}>
          <Button className="mt-4" size="sm">
            {t("viewOrdersButton")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
