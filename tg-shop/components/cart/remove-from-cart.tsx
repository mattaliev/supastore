"use client";
import { clsx } from "clsx";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { removeFromCart } from "@/components/cart/actions";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const buttonClasses =
    "p-0 w-6 h-6 bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  const disabledClasses =
    "bg-telegram-button-hin-color text-telegram-text-color cursor-not-allowed";

  if (pending) {
    return (
      <Button className={clsx(buttonClasses, disabledClasses)}>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      className={clsx(buttonClasses)}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
    >
      <TrashIcon className="h-5 w-5" />
      <span className="sr-only">Remove</span>
    </Button>
  );
}

export default function RemoveFromCartButton({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const [message, formAction] = useFormState(removeFromCart, null);

  const actionWithPayload = formAction.bind(null, {
    cartItemId: itemId,
    quantity,
  });

  return (
    <form action={actionWithPayload}>
      <SubmitButton />
      <p className="text-xs text-telegram-text-color">{message || ""}</p>
    </form>
  );
}
