"use client";

import { FulfilmentStatus, Order, PaymentStatus } from "@ditch/lib";
import { ChevronLeft, ChevronRight, CreditCard, Truck } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  FulfilmentStatusBadge,
  PaymentStatusBadge
} from "@/components/order/order-badges";
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
  Pagination,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

export default function OrderPreview({
  storeId,
  orders,
  hasNext,
  hasPrev,
  limit,
  totalItems,
  page
}: {
  storeId: string;
  orders: Order[];
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
  totalItems: number;
  page: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [current, setCurrent] = useState(
    searchParams.get("current")
      ? parseInt(searchParams.get("current") as string)
      : 0
  );

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED, {
      locale: "en-US"
    });
  };

  const nextOrder = () => {
    if (current < orders.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      if (hasNext) {
        const params = new URLSearchParams(searchParams);
        params.set("current", (0).toString());
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        replace(`${pathname}?${params.toString()}`);
      }
    }
  };

  const prevOrder = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    } else {
      if (hasPrev) {
        const params = new URLSearchParams(searchParams);
        params.set("current", (orders.length - 1).toString());
        replace(`${pathname}?${params.toString()}`);
      }
    }
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <Card className="hidden lg:block">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-1">
          <CardTitle className="group flex items-center gap-2 text-lg hover:underline">
            <Link href={`store/${storeId}/orders/edit/${orders[current].id}`}>
              Order {orders[current].orderNumber}
            </Link>
          </CardTitle>
          <CardDescription>
            Date: {formatDate(orders[current].created)}
          </CardDescription>
          <div className="flex items-center justify-start space-x-1 mt-2">
            <PaymentStatusBadge
              paymentStatus={
                orders[current].payment?.paymentStatus || PaymentStatus.UNPAID
              }
            />
            <FulfilmentStatusBadge
              fulfilmentStatus={orders[current].fulfilmentStatus}
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {orders[current].fulfilmentStatus === FulfilmentStatus.TRACKING && (
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Track Order
              </span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {orders[current].cart.items.map((item) => (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {item.product.title}{" "}
                  {!item.variant ? "" : item.variant.size || ""} x{" "}
                  <span>{item.quantity}</span>
                </span>
                <span>${item.product.price}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${orders[current].subtotalAmount}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${orders[current].shippingAmount}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${orders[current].totalAmount}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Shipping Information</div>
          {orders[current].shipping.details ? (
            <div
              className={
                "grid gap-0.5 not-italic text-muted-foreground text-sm"
              }
            >
              <dd>
                {orders[current].shipping.details?.firstName +
                  " " +
                  orders[current].shipping.details?.lastName}
              </dd>
              <dd>{orders[current].shipping.details?.phone}</dd>
              <dd>{orders[current].shipping.details?.email}</dd>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <dd>{orders[current].shipping.details?.address}</dd>
                <dd>{orders[current].shipping.details?.city || ""}</dd>
                <dd>{orders[current].shipping.details?.province || ""}</dd>
                <dd>{orders[current].shipping.details?.postcode || ""}</dd>
                <dd>{orders[current].shipping.details?.country || ""}</dd>
              </address>
            </div>
          ) : (
            <dd className={"my-4 text-muted-foreground"}>
              No shipping information provided
            </dd>
          )}
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>
                {!orders[current].user && "Anonymous User"}
                {orders[current].user?.firstName}{" "}
                {orders[current].user?.lastName || ""}
              </dd>
            </div>
            {orders[current].user?.username && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Username</dt>
                <dd>@{orders[current].user?.username}</dd>
              </div>
            )}
          </dl>
        </div>
        <Separator className="my-4" />
        {orders[current].payment && (
          <div className="grid gap-3">
            <div className="font-semibold">Payment Method</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  {orders[current].payment
                    ? orders[current].payment?.paymentMethod.name
                    : "N/A"}
                </dt>
              </div>
            </dl>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        {orders[current].fulfilmentDate && (
          <div className="text-xs text-muted-foreground">
            Fulfilled on{" "}
            <time dateTime="2023-11-23">
              {formatDate(orders[current].fulfilmentDate || "")}
            </time>
          </div>
        )}
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={prevOrder}
                disabled={current === 0}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={nextOrder}
                disabled={current === totalItems - 1}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
