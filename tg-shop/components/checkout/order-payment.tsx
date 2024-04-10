import PayWithCardButton from "@/components/checkout/pay-with-card-button";
import PayWithWalletButton from "@/components/checkout/pay-with-wallet-button";
import USPaymentOption from "@/components/checkout/us-payment-option";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/lib/api/types";

export default function OrderPayment({ order }: { order: Order }) {
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
            ${order.deliveryAmount}
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
      <CardFooter className="">
        {/*<PayWithCardButton />*/}
        {order.shippingDetails.country !== "United States" ? (
          <PayWithWalletButton order={order} />
        ) : (
          <USPaymentOption order={order} />
        )}
      </CardFooter>
    </Card>
  );
}
