import { notFound } from "next/navigation";

import PaymentSuccess from "@/components/invoice/payment-success";
import { orderGetById } from "@/lib/api";

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
