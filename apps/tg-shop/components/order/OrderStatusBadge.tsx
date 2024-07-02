import { FulfilmentStatus, PaymentStatus } from "@ditch/lib";

import { Badge } from "@/components/ui/badge";

export default function OrderStatusBadge({
  fulfillmentStatus,
  paymentStatus
}: {
  fulfillmentStatus: FulfilmentStatus;
  paymentStatus?: PaymentStatus;
}) {
  if (fulfillmentStatus === FulfilmentStatus.TRACKING) {
    return <Badge>Out For Delivery</Badge>;
  }

  if (paymentStatus === PaymentStatus.PAID) {
    return <Badge>Payment Received</Badge>;
  }

  if (paymentStatus === PaymentStatus.UNPAID) {
    return <Badge variant={"outline"}>Payment Pending</Badge>;
  }

  return <Badge variant={"outline"}>Placed</Badge>;
}
