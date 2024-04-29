import { EntityState, Order, paymentMethodsList } from "@ditch/lib";

import PaymentButton from "@/components/checkout/payment-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function OrderPayment({ order }: { order: Order }) {
  const paymentMethods = await paymentMethodsList(EntityState.ACTIVE);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center">
          <div className="text-telegram-hint-color">Subtotal</div>
          <div className="ml-auto text-telegram-hint-color">
            ${order.subtotalAmount}
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-telegram-hint-color">Shipping</div>
          <div className="ml-auto text-telegram-hint-color">
            ${order.shippingAmount}
          </div>
        </div>
        <Separator />
        <div className="flex items-center font-medium">
          <div className="text-telegram-text-color">Total</div>
          <div className="ml-auto text-telegram-text-color">
            ${order.totalAmount}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="grid gap-4 grid-cols-1 auto-rows-max w-full">
          {paymentMethods.map((paymentMethod) => (
            <PaymentButton paymentMethod={paymentMethod} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
