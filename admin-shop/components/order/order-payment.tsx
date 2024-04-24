import { Order } from "@/lib/api/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderPaymentStatusBadge } from "@/components/order/order-badges";
import MarkAsPaidDrawerDialog from "@/components/order/mark-as-paid-drawer-dialog";

export default function OrderPayment({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className={"flex items-center justify-start gap-2"}>
            Payment
            <OrderPaymentStatusBadge paymentStatus={order.paymentStatus} />
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
            <span>${order.deliveryAmount}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">Total</span>
            <span>${order.totalAmount}</span>
          </div>
        </div>
      </CardContent>

      {order.paymentStatus === "PENDING" && (
        <CardFooter>
          <div className="flex ml-auto">
            <MarkAsPaidDrawerDialog orderId={order.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
