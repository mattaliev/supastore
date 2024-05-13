import { AnalyticsEvent, EventType } from "@ditch/lib";
import Link from "next/link";

export default function AnalyticsEventData({
  event
}: {
  event: AnalyticsEvent;
}) {
  if (
    event.eventType === EventType.ADDED_TO_CART ||
    event.eventType === EventType.REMOVED_FROM_CART
  ) {
    return <p>Cart total: ${event.eventData.cart_total}</p>;
  }

  if (
    event.eventType === EventType.CHECKOUT_STARTED ||
    event.eventType === EventType.PAYMENT_STARTED ||
    event.eventType === EventType.PAYMENT_COMPLETED
  ) {
    return (
      <div>
        Order{" "}
        <span>
          <Link
            href={`/orders/edit/${event.eventData.order_id}`}
            className={"hover:underline"}
          >
            #{event.eventData.order_number}
          </Link>
        </span>
      </div>
    );
  }
  return "";
}
