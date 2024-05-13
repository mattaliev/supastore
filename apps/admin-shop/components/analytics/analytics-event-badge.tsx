import { EventType } from "@ditch/lib";

import { Badge } from "@/components/ui/badge";

export default function AnalyticsEventBadge({
  eventType
}: {
  eventType: EventType;
}) {
  if (eventType === EventType.ADDED_TO_CART) {
    return <Badge variant="success">Added To Cart</Badge>;
  }

  if (eventType === EventType.CHECKOUT_STARTED) {
    return <Badge variant="success">Checkout</Badge>;
  }

  if (eventType === EventType.PAYMENT_STARTED) {
    return <Badge variant="success">Payment Started</Badge>;
  }

  if (eventType === EventType.PAYMENT_COMPLETED) {
    return <Badge variant="success">Payment Completed</Badge>;
  }

  if (eventType === EventType.REMOVED_FROM_CART) {
    return <Badge variant="warning">Removed From Cart</Badge>;
  }

  if (eventType === EventType.USER_REGISTERED) {
    return <Badge variant="default">User Registered</Badge>;
  }

  if (eventType === EventType.USER_VISITED) {
    return <Badge variant="outline">User Visited</Badge>;
  }
}
