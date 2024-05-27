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
import { StoreProvider } from "@/components/store/store-context";

type OrderDetailsPageProps = {
  params: {
    storeId: string;
    orderId: string;
  };
};

export default async function OrderDetailsPage({
  params
}: OrderDetailsPageProps) {
  const session = await getServerSession(authOptions);
  const { storeId, orderId } = params;

  if (!session || !session.user.accessToken) {
    redirect(`/auth/signIn?callbackUrl=/store/${params.storeId}/orders`);
  }

  const order = await authenticated(session.user.accessToken, orderGetById, {
    storeId,
    orderId
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4 max-w-[59rem] mx-auto w-full">
      <OrderDetailHeader
        orderId={order.id}
        orderNumber={order.orderNumber}
        storeId={storeId}
      />
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg-gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <OrderDetails order={order} storeId={storeId} />
          <OrderPayment order={order} storeId={storeId} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <OrderShipping
            storeId={storeId}
            shipping={order.shipping}
            fulfilmentStatus={order.fulfilmentStatus}
          />
          <OrderCustomer user={order.user} storeId={storeId} />
        </div>
      </div>
      <div>
        <StoreProvider storeId={storeId}>
          <OrderDeleteDrawerDialog orderId={order.id} />
        </StoreProvider>
      </div>
    </div>
  );
}
