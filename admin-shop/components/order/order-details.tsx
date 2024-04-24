import { FulfilmentStatus, Order } from "@/lib/api/types";
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
import Image from "next/image";
import { OrderFulfilmentStatusBadge } from "@/components/order/order-badges";
import { DateTime } from "luxon";
import Link from "next/link";
import { CancelOrderDrawerDialog } from "@/components/order/cancel-order-drawer-dialog";
import FulfillItemsButton from "@/components/order/fulfill-items-button";

export default function OrderDetails({ order }: { order: Order }) {
  function formatDate(date: string) {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL, {
      locale: "en-US",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-start gap-2">
            Order Details
            <OrderFulfilmentStatusBadge
              fulfilmentStatus={order.fulfilmentStatus}
            />
          </div>
        </CardTitle>
        <CardDescription>Created: {formatDate(order.created)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] lg:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Product</TableHead>
              {/*<TableHead>Quantity</TableHead>*/}
              {/*<TableHead>Price</TableHead>*/}
              <TableHead></TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="hidden lg:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={
                      item.product.images && item.product.images.length > 0
                        ? item.product.images[0].url
                        : ""
                    }
                    width="64"
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/products/edit/${item.product.id}`}
                    className="hover:underline"
                  >
                    {item.product.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {item.quantity} x {"$" + item.product.price}
                </TableCell>
                {/*<TableCell>{"$" + item.product.price}</TableCell>*/}
                <TableCell>
                  {"$" + (item.product.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {order.fulfilmentStatus === FulfilmentStatus.UNFULFILLED && (
        <CardFooter>
          <div className="flex ml-auto items-end space-x-2">
            <CancelOrderDrawerDialog orderId={order.id} />
            <FulfillItemsButton orderId={order.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
