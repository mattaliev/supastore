import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

import DeliverySummary from "@/components/checkout/delivery-summary";
import OrderItems from "@/components/checkout/order-items";
import OrderPayment from "@/components/checkout/order-payment";
import { ShippingSummary } from "@/components/checkout/shipping-summary";
import { EntityState, orderGetById } from "@ditch/lib";

type OrderSummaryPageProps = {
  searchParams: {
    orderId?: string;
  }
}

export default async function OrderSummaryPage({ searchParams }: OrderSummaryPageProps) {
  let orderId;
  let order;
  let mutable = true;

  if (searchParams.orderId) {
    orderId = searchParams.orderId;
    order = await orderGetById(orderId);
    mutable = false;
  } else {
    orderId = cookies().get("orderId")?.value;

    if (!orderId) {
      return notFound();
    }
    order = await orderGetById(orderId, EntityState.ACTIVE);
  }

  if (!order) {
    return notFound();
  }

  return (
    <div>
      <ShippingSummary
        shippingDetails={order.shipping.details}
        mutable={mutable}
      />
      <OrderItems items={order.cart.items} />
      <DeliverySummary shippingDetails={order.shipping.details} />
      <OrderPayment order={order} />
    </div>
  );
}
