import { FulfilmentStatus, Order } from "@ditch/lib";
import { DateTime } from "luxon";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import Link from "@/components/navigation/link";
import { CancelOrderDrawerDialog } from "@/components/order/cancel-order-drawer-dialog";
import FulfillItemsButton from "@/components/order/fulfill-items-button";
import { FulfilmentStatusBadge } from "@/components/order/order-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { NoImage } from "@/components/ui/NoImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default async function OrderDetails({ order }: { order: Order }) {
  const t = await getTranslations("OrderEditPage.OrderDetailsTable");

  function formatDate(date: string) {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL, {
      locale: "en-US"
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-start gap-2">
            {t("title")}
            <FulfilmentStatusBadge fulfilmentStatus={order.fulfilmentStatus} />
          </div>
        </CardTitle>
        <CardDescription>
          {t("created")}: {formatDate(order.created)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] lg:table-cell">
                <span className="sr-only">{t("image")}</span>
              </TableHead>
              <TableHead>{t("product")}</TableHead>
              <TableHead></TableHead>
              <TableHead>{t("total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.cart.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="hidden lg:table-cell">
                  {item.productVariant.images.length > 0 ? (
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={
                        item.productVariant.images.length > 0
                          ? item.productVariant.images[0]
                          : ""
                      }
                      width="64"
                    />
                  ) : (
                    <NoImage
                      iconSize={"xs"}
                      className={
                        "w-[64px] aspect-square rounded-md object-cover"
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/products/edit/${item.productVariant.id}`}
                    className="hover:underline"
                  >
                    {item.productVariant.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {item.quantity} x {"$" + item.size.price}
                </TableCell>
                <TableCell>
                  {"$" + (parseInt(item.size.price) * item.quantity).toFixed(2)}
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
