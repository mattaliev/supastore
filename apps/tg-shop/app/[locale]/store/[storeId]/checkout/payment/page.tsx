import { EntityState, orderGetById } from "@ditch/lib";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React from "react";

import DeliverySummary from "@/components/checkout/delivery-summary";
import OrderItems from "@/components/checkout/order-items";
import OrderPayment from "@/components/checkout/order-payment";
import { ShippingSummary } from "@/components/checkout/shipping-summary";
import { tmaAuthenticated } from "@/lib/auth";

type OrderSummaryPageProps = {
  params: {
    storeId: string;
  };
  searchParams: {
    orderId?: string;
  };
};

export default async function OrderSummaryPage({
  params: { storeId },
  searchParams
}: OrderSummaryPageProps) {
  const initDataRaw = cookies().get("initDataRaw")?.value;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  const orderId = searchParams.orderId || cookies().get("orderId")?.value;

  if (!orderId) {
    notFound();
  }

  const order = await tmaAuthenticated(initDataRaw, storeId, orderGetById, {
    storeId,
    orderId
  });

  if (!order) {
    return notFound();
  }

  const mutable = order.state === EntityState.ACTIVE;

  return (
    <div>
      <ShippingSummary
        shippingDetails={order.shipping.details}
        mutable={mutable}
      />
      <OrderItems items={order.cart.items} />
      <DeliverySummary shippingDetails={order.shipping.details} />
      <OrderPayment order={order} mutable={mutable} />
    </div>
  );
}
