import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import ShippingDetailsForm from "@/components/checkout/shipping-details-form";
import { orderGetById } from "@ditch/lib";

export default async function ShippingDetailsPage() {
  const orderId = cookies().get("orderId")?.value;

  if (!orderId) {
    return notFound();
  }

  const order = await orderGetById(orderId);

  if (!order) {
    return notFound();
  }

  return (
    <ShippingDetailsForm
      shippingDetails={order.shipping.details}
      shippingId={order.shipping.id}
    />
  );
}
