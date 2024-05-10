import { orderGetById } from "@ditch/lib";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import PaymentSuccess from "@/components/invoice/payment-success";
import { tmaAuthenticated } from "@/lib/auth";

type Props = {
  params: {};
  searchParams: {
    orderId: string;
  };
};

export default async function Success({ params, searchParams }: Props) {
  const orderId = searchParams.orderId;

  const initDataRaw = cookies().get("initDataRaw")?.value;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  const order = await tmaAuthenticated(initDataRaw, orderGetById, {
    orderId,
  });

  if (!order) {
    return notFound();
  }

  return <PaymentSuccess order={order} />;
}
