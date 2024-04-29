import { orderGetById } from "@ditch/lib";
import { notFound } from "next/navigation";

import PaymentSuccess from "@/components/invoice/payment-success";

type Props = {
  params: {};
  searchParams: {
    orderId: string;
  };
};

export default async function Success({ params, searchParams }: Props) {
  const orderId = searchParams.orderId;

  const order = await orderGetById(orderId);

  if (!order) {
    return notFound();
  }

  return <PaymentSuccess order={order} />;
}
