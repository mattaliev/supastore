"use client";
import { EventType } from "@ditch/lib";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

export default function AnalyticsEventBadge({
  eventType
}: {
  eventType: EventType;
}) {
  const t = useTranslations("Analytics.EventBadge");

  if (eventType === EventType.ADDED_TO_CART) {
    return <Badge variant="success">{t("addedToCart")}</Badge>;
  }

  if (eventType === EventType.CHECKOUT_STARTED) {
    return <Badge variant="success">{t("checkout")}</Badge>;
  }

  if (eventType === EventType.PAYMENT_STARTED) {
    return <Badge variant="success">{t("paymentStarted")}</Badge>;
  }

  if (eventType === EventType.PAYMENT_COMPLETED) {
    return <Badge variant="success">{t("paymentCompleted")}</Badge>;
  }

  if (eventType === EventType.REMOVED_FROM_CART) {
    return <Badge variant="warning">{t("removedFromCart")}</Badge>;
  }

  if (eventType === EventType.USER_REGISTERED) {
    return <Badge variant="default">{t("userRegistered")}</Badge>;
  }

  if (eventType === EventType.USER_VISITED) {
    return <Badge variant="outline">{t("userVisited")}</Badge>;
  }
}
