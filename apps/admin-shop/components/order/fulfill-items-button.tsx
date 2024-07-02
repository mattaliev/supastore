"use client";
import { FulfilmentStatus } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { updateOrderStatus } from "@/components/order/actions";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

export default function FulfillItemsButton({ orderId }: { orderId: string }) {
  const storeId = useStore();
  const [formState, formAction] = useFormState(updateOrderStatus, null);
  const t = useTranslations("OrderDetailsPage.OrderFulfillment");

  return (
    <form action={formAction}>
      {formState?.error && (
        <p className={"text-destructive text-end text-xs"}>
          {t("fulfillmentError")}
        </p>
      )}
      <input type={"hidden"} name={"store-id"} value={storeId} />
      <input type={"hidden"} name={"order-id"} value={orderId} />
      <input
        type={"hidden"}
        name={"fulfilment-status"}
        value={FulfilmentStatus.FULFILLED}
      />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("OrderDetailsPage.OrderFulfillment");

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1"}
        disabled
        size={"sm"}
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        {t("fulfillingItems")}
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"}>
      {t("fulfillItems")}
    </Button>
  );
}
