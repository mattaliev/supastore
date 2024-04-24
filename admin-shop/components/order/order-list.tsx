import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import OrderFilters from "@/components/order/order-filters";
import { Order, PaymentStatus } from "@/lib/api/types";
import { formatDateShort } from "@/lib/utils";
import Link from "next/link";

export default function OrderList({
  orders,
  page,
  limit,
  totalOrderCount,
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
              of <strong>{totalOrderCount}</strong> products
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
              <Badge
                className="text-xs"
                variant={
                  order.paymentStatus === PaymentStatus.PAID
                    ? "secondary"
                    : "outline"
                }
              >
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1).toLowerCase()}
              </Badge>
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
    // <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
    //   <div className="flex items-center">
    //     <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
    //   </div>
    <div className="flex flex-1 items-center justify-center h-64">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No orders found</h3>
        <p className="text-sm text-muted-foreground">
          Try changing the filters
        </p>
        {/*<Button className="mt-4">Add Product</Button>*/}
      </div>
    </div>
    // </div>
  );
}
