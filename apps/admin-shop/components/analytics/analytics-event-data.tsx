"use client";
import { AnalyticsEvent, EventType } from "@ditch/lib";
import { useTranslations } from "next-intl";

import Link from "@/components/navigation/link";

export default function AnalyticsEventData({
  event
}: {
  event: AnalyticsEvent;
}) {
  const t = useTranslations("Analytics.EventData");

  if (
    event.eventType === EventType.ADDED_TO_CART ||
    event.eventType === EventType.REMOVED_FROM_CART
  ) {
    return (
      <p>
        {t("cartTotal")}: ${event.eventData.cart_total}
      </p>
    );
  }

  if (
    event.eventType === EventType.CHECKOUT_STARTED ||
    event.eventType === EventType.PAYMENT_STARTED ||
    event.eventType === EventType.PAYMENT_COMPLETED
  ) {
    return (
      <div>
        {t("order")}{" "}
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
