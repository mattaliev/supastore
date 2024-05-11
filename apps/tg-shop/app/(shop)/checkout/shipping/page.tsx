import { orderGetById } from "@ditch/lib";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import ShippingDetailsForm from "@/components/checkout/shipping-details-form";
import { tmaAuthenticated } from "@/lib/auth";

type ShippingDetailsPageProps = {
  searchParams: {
    shippingId: string;
  };
};

export default async function ShippingDetailsPage({
  searchParams
}: ShippingDetailsPageProps) {
  const orderId = cookies().get("orderId")?.value;
  const initDataRaw = cookies().get("initDataRaw")?.value;
  const shippingId = searchParams.shippingId;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  if (!orderId) {
    return notFound();
  }

  const order = await tmaAuthenticated(initDataRaw, orderGetById, {
    orderId
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
