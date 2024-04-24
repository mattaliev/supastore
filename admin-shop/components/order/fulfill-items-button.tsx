"use client";
import { useFormState, useFormStatus } from "react-dom";
import { updateOrderStatus } from "@/components/order/actions";
import { FulfilmentStatus } from "@/lib/api/types";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FulfillItemsButton({ orderId }: { orderId: string }) {
  const [formState, formAction] = useFormState(updateOrderStatus, {
    orderId,
    fulfilmentStatus: FulfilmentStatus.FULFILLED,
    paymentStatus: undefined,
  });

  return (
    <form action={formAction}>
      {formState?.error && (
        <p className={"text-destructive text-end text-xs"}>{formState.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1"}
        disabled
        size={"sm"}
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        Fulfilling items...
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"}>
      Fulfill items
    </Button>
  );
}
