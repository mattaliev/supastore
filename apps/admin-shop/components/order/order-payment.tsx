import { Order, paymentMethodsList, PaymentStatus } from "@ditch/lib";
import { CreditCard } from "lucide-react";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import CreatePaymentDrawerDialog from "@/components/order/create-payment-drawer-dialog";
import MarkAsPaidDrawerDialog from "@/components/order/mark-as-paid-drawer-dialog";
import { PaymentStatusBadge } from "@/components/order/order-badges";
import { getStoreId } from "@/components/store/helpers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderPayment({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className={"flex items-center justify-start gap-2"}>
            Payment
            <PaymentStatusBadge
              paymentStatus={
                order.payment
                  ? order.payment.paymentStatus
                  : PaymentStatus.UNPAID
              }
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.subtotalAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>${order.shippingAmount}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">Total</span>
            <span>${order.totalAmount}</span>
          </div>
          {order.payment && (
            <div className="flex justify-between font-semibold">
              <span className={"text-muted-foreground"}>Payment Method</span>
              <div className="flex items-center justify-center gap-1">
                <CreditCard className="h-4 w-4" />
                {order.payment?.paymentMethod?.name}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <PaymentActions order={order} />
    </Card>
  );
}

async function PaymentActions({ order }: { order: Order }) {
  if (!order.payment) {
    const accessToken = await getAccessToken();
    const storeId = getStoreId();

    const paymentMethods = await authenticated(
      accessToken,
      paymentMethodsList,
      { storeId }
    );

    if (!paymentMethods) {
      return null;
    }

    return (
      <CardFooter>
        <div className="flex ml-auto">
          <CreatePaymentDrawerDialog
            orderId={order.id}
            paymentMethods={paymentMethods}
          />
        </div>
      </CardFooter>
    );
  }

  if (order.payment.paymentStatus === PaymentStatus.UNPAID) {
    return (
      <CardFooter>
        <div className="flex ml-auto">
          <MarkAsPaidDrawerDialog paymentId={order.payment.id} />
        </div>
      </CardFooter>
    );
  }

  return null;
}
