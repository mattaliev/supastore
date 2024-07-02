import { orderGetById, PaymentStatus } from "@ditch/lib";
import { BoxIcon, ContactIcon, MapPinIcon } from "lucide-react";
import { notFound } from "next/navigation";

import WithAuth, { WithAuthProps } from "@/components/auth/WithAuth";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { tmaAuthenticated } from "@/lib/auth";

type OrderPageProps = {
  params: { orderId: string; storeId: string };
};

async function OrderPage({
  params: { orderId, storeId },
  initDataRaw
}: WithAuthProps<OrderPageProps>) {
  const order = await tmaAuthenticated(initDataRaw, storeId, orderGetById, {
    storeId,
    orderId
  });

  if (!order) {
    return notFound();
  }

  return (
    <div className={"grid gap-6 px-6"}>
      <div className={"flex items-center justify-between gap-2"}>
        <h1 className={"text-lg text-telegram-text-color font-semibold"}>
          Order #{order.orderNumber}
        </h1>
        <OrderStatusBadge
          fulfillmentStatus={order.fulfilmentStatus}
          paymentStatus={order.payment?.paymentStatus}
        />
      </div>
      <div className={"grid gap-2"}>
        <div className={"flex items-center justify-start gap-2"}>
          <BoxIcon className={"text-telegram-text-color h-4 w-4"} />
          <h3 className={"text-base text-telegram-text-color font-semibold"}>
            Items
          </h3>
        </div>
        <Table>
          {order.cart.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={"text-telegram-hint-color"}>
                {item.productVariant.name}
              </TableCell>
              <TableCell className={"text-telegram-hint-color"}>
                ${item.size.price} x {item.quantity}
              </TableCell>
              <TableCell className={"text-telegram-hint-color"}>
                ${parseInt(item.size.price) * item.quantity}
              </TableCell>
            </TableRow>
          ))}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className={"text-telegram-hint-color"}>
                Total
              </TableCell>
              <TableCell className={"text-telegram-hint-color"}>
                ${order.cart.totalPrice}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className={"grid gap-2"}>
        <div className={"flex items-center justify-start gap-2"}>
          <MapPinIcon className={"text-telegram-text-color h-4 w-4"} />
          <h3 className={"text-base text-telegram-text-color font-semibold"}>
            Shipping Address
          </h3>
        </div>
        <p className={"text-sm text-telegram-hint-color"}>
          {order.shipping.shippingAddress.address}
        </p>
      </div>
      <div className={"grid gap-2"}>
        <div className={"flex items-center justify-start gap-2"}>
          <ContactIcon className={"text-telegram-text-color h-4 w-4"} />
          <h3 className={"text-base text-telegram-text-color font-semibold"}>
            Contact Information
          </h3>
        </div>
        <div className={"text-sm grid text-telegram-hint-color"}>
          <p>{order.shipping.contactInfo.name}</p>
          <p>{order.shipping.contactInfo.email}</p>
          <p>{order.shipping.contactInfo.phone}</p>
        </div>
      </div>
      {order.payment?.paymentStatus === PaymentStatus.UNPAID && (
        <Button>Process Payment</Button>
      )}
    </div>
  );
}

export default WithAuth<OrderPageProps>(OrderPage);
