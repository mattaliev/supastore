import { Order, PaymentStatus } from "@ditch/lib";
import Link from "next/link";

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

export default function OrderList({
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

  return (
    <div className="grid gap-3">
      <OrderFilters />
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          {totalOrderCount === 0 ? (
            <NoOrdersYet />
          ) : (
            <OrderTable orders={orders} />
          )}

          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {firstProductIndex} - {lastProductIndex}
              </strong>{" "}
              of <strong>{totalOrderCount}</strong> orders
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderTable({ orders }: { orders?: Order[] }) {
  return (
    <Table containerClassname={"w-full overflow-x-auto relative"}>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
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
                  "Anonymous User"}
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

function NoOrdersYet() {
  return (
    <div className="flex flex-1 items-center justify-center h-64">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No orders found</h3>
        <p className="text-sm text-muted-foreground">
          Try changing the filters or view all orders
        </p>
        <Link href={"/orders"}>
          <Button className="mt-4" size="sm">
            View orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
