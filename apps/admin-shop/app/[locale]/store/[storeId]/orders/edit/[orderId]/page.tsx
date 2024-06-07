import { orderGetById } from "@ditch/lib";
import { notFound } from "next/navigation";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import OrderCustomer from "@/components/order/order-customer";
import OrderDeleteDrawerDialog from "@/components/order/order-delete-drawer-dialog";
import OrderDetailHeader from "@/components/order/order-detail-header";
import OrderDetails from "@/components/order/order-details";
import OrderPayment from "@/components/order/order-payment";
import OrderShipping from "@/components/order/order-shipping";

type OrderDetailsPageProps = {
  params: {
    storeId: string;
    orderId: string;
  };
};

async function OrderDetailsPage({
  params: { storeId, orderId },
  accessToken
}: WithAuthProps<OrderDetailsPageProps>) {
  const order = await authenticated(accessToken, orderGetById, {
    storeId,
    orderId
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4 max-w-[59rem] mx-auto w-full">
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

export default WithAuth<OrderDetailsPageProps>(OrderDetailsPage);
