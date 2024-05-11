import { orderGetById } from "@ditch/lib";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import OrderCustomer from "@/components/order/order-customer";
import OrderDeleteDrawerDialog from "@/components/order/order-delete-drawer-dialog";
import OrderDetailHeader from "@/components/order/order-detail-header";
import OrderDetails from "@/components/order/order-details";
import OrderPayment from "@/components/order/order-payment";
import OrderShipping from "@/components/order/order-shipping";

type OrderDetailsPageProps = {
  params: {
    orderId: string;
  };
};

export default async function OrderDetailsPage({
  params
}: OrderDetailsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn?callbackUrl=/orders");
  }

  const order = await authenticated(session.user.accessToken, orderGetById, {
    orderId: params.orderId
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4 max-w-[59rem] mx-auto">
      <OrderDetailHeader orderId={order.id} orderNumber={order.orderNumber} />
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg-gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <OrderDetails order={order} />
          <OrderPayment order={order} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <OrderShipping
            shipping={order.shipping}
            fulfilmentStatus={order.fulfilmentStatus}
          />
          <OrderCustomer user={order.user} />
        </div>
      </div>
      <div>
        <OrderDeleteDrawerDialog orderId={order.id} />
      </div>
    </div>
  );
}
