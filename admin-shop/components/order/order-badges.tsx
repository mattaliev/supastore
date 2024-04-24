import { FulfilmentStatus, PaymentStatus } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";

export function OrderPaymentStatusBadge({
  paymentStatus,
}: {
  paymentStatus: PaymentStatus;
}) {
  return (
    <Badge
      variant={
        paymentStatus === PaymentStatus.PAID
          ? "success"
          : paymentStatus === PaymentStatus.EXPIRED ||
              paymentStatus === PaymentStatus.REFUNDED
            ? "danger"
            : "warning"
      }
    >
      {paymentStatus.charAt(0).toUpperCase() +
        paymentStatus.slice(1).toLowerCase()}
    </Badge>
  );
}

export function OrderFulfilmentStatusBadge({
  fulfilmentStatus,
}: {
  fulfilmentStatus: FulfilmentStatus;
}) {
  return (
    <Badge
      variant={
        fulfilmentStatus === FulfilmentStatus.FULFILLED ||
        fulfilmentStatus === FulfilmentStatus.TRACKING
          ? "success"
          : fulfilmentStatus === FulfilmentStatus.CANCELLED
            ? "danger"
            : "warning"
      }
    >
      {fulfilmentStatus.charAt(0).toUpperCase() +
        fulfilmentStatus.slice(1).toLowerCase()}
    </Badge>
  );
}
