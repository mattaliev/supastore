import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

import DeliverySummary from "@/components/checkout/delivery-summary";
import OrderItems from "@/components/checkout/order-items";
import OrderPayment from "@/components/checkout/order-payment";
import { ShippingSummary } from "@/components/checkout/shipping-summary";
import { orderGetById } from "@/lib/api";

export default async function OrderSummaryPage() {
  const orderId = cookies().get("orderId")?.value;

  if (!orderId) {
    return notFound();
  }

  const order = await orderGetById(orderId, "ACTIVE");

  if (!order) {
    return notFound();
  }

  console.log("Order: ", order);

  return (
    <div>
      <ShippingSummary shippingDetails={order.shippingDetails} />
      <OrderItems items={order.cart.items} />
      <DeliverySummary shippingDetails={order.shippingDetails} />
      <OrderPayment order={order} />
    </div>
  );
}
