"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CreditCard, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { FulfilmentStatus, Order } from "@/lib/api/types";
import { useState } from "react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  OrderFulfilmentStatusBadge,
  OrderPaymentStatusBadge,
} from "@/components/order/order-badges";
import Link from "next/link";

export default function OrderPreview({
  orders,
  hasNext,
  hasPrev,
  limit,
  totalItems,
  page,
}: {
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
      : 0,
  );

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED, {
      locale: "en-US",
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
            <Link href={`/orders/edit/${orders[current].id}`}>
              Order {orders[current].orderNumber}
            </Link>
          </CardTitle>
          <CardDescription>
            Date: {formatDate(orders[current].created)}
          </CardDescription>
          <div className="flex items-center justify-start space-x-1 mt-2">
            <OrderPaymentStatusBadge
              paymentStatus={orders[current].paymentStatus}
            />
            <OrderFulfilmentStatusBadge
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
            {orders[current].items.map((item) => (
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
              <span>${orders[current].deliveryAmount}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${orders[current].totalAmount}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Shipping Information</div>
            {/*<address className="grid gap-0.5 not-italic text-muted-foreground">*/}
            {/*  <span>*/}
            {/*    {orders[current].shippingDetails.firstName +*/}
            {/*      " " +*/}
            {/*      orders[current].shippingDetails.lastName}*/}
            {/*  </span>*/}
            {/*  <span>{orders[current].shippingDetails.phone}</span>*/}
            {/*  <span>{orders[current].shippingDetails.email}</span>*/}
            {/*  <span>{orders[current].shippingDetails.address}</span>*/}
            {/*  <span>*/}
            {/*    {orders[current].shippingDetails.city +*/}
            {/*      ", " +*/}
            {/*      orders[current].shippingDetails.province +*/}
            {/*      " " +*/}
            {/*      orders[current].shippingDetails.postcode}*/}
            {/*  </span>*/}
            {/*  <span>{orders[current].shippingDetails.country}</span>*/}
            {/*</address>*/}
          </div>
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Billing Information</div>
            <div className="text-muted-foreground">
              Same as shipping address
            </div>
          </div>
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
            {orders[current].user?.email && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${orders[current].user?.email}`}>
                    @{orders[current].user?.username}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Method</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Requisites
              </dt>
              {/*<dd>**** **** **** 4532</dd>*/}
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time dateTime="2023-11-23">
            {formatDate(orders[current].updated)}
          </time>
        </div>
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
