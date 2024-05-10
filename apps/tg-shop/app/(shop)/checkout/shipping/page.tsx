import { orderGetById } from "@ditch/lib";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import ShippingDetailsForm from "@/components/checkout/shipping-details-form";
import { tmaAuthenticated } from "@/lib/auth";

export default async function ShippingDetailsPage() {
  const orderId = cookies().get("orderId")?.value;
  const initDataRaw = cookies().get("initData")?.value;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  if (!orderId) {
    return notFound();
  }

  const order = await tmaAuthenticated(initDataRaw, orderGetById, {
    orderId,
  });

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
