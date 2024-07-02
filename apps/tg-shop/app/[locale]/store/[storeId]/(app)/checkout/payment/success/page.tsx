import { orderGetById } from "@ditch/lib";
import { notFound } from "next/navigation";

import { getInitDataRaw } from "@/components/auth/getInitDataRaw";
import PaymentSuccess from "@/components/invoice/payment-success";
import { tmaAuthenticated } from "@/lib/auth";

type Props = {
  params: { storeId: string };
  searchParams: {
    orderId: string;
  };
};

export default async function Success({
  params: { storeId },
  searchParams
}: Props) {
  const orderId = searchParams.orderId;

  const initDataRaw = await getInitDataRaw();

  const order = await tmaAuthenticated(initDataRaw, storeId, orderGetById, {
    storeId,
    orderId
  });

  if (!order) {
    return notFound();
  }

  return <PaymentSuccess order={order} />;
}
