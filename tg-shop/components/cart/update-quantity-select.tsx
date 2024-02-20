"use client";
import { clsx } from "clsx";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updateCartItem } from "@/components/cart/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectTriggerAndContent({ quantity }: { quantity: number }) {
  const { pending } = useFormStatus();

  const triggerClasses =
    "w-16 h-7 outline-none border-none text-telegram-text-color bg-telegram-bg-color";
  const disabledTriggerClass = "text-telegram-text-color cursor-not-allowed";

  if (pending) {
    return (
      <SelectTrigger className={clsx(triggerClasses, disabledTriggerClass)}>
        <SelectValue />
      </SelectTrigger>
    );
  }

  return (
    <>
      <SelectTrigger className={triggerClasses} value={quantity}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-0 max-h-36 w-16 bg-telegram-bg-color text-telegram-text-color">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
          <SelectItem
            key={i}
            value={i.toString()}
            className={
              "text-telegram-text-color hover:bg-telegram-button-color"
            }
          >
            {i}
          </SelectItem>
        ))}
      </SelectContent>
    </>
  );
}

export default function UpdateItemQuantitySelect({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, formAction] = useFormState(updateCartItem, null);

  const onSelectChange = (value: string) => {
    formRef.current?.requestSubmit();
  };

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="cartItemId" value={itemId} />
      <Select
        defaultValue={quantity.toString()}
        onValueChange={onSelectChange}
        name={"quantity"}
      >
        <SelectTriggerAndContent quantity={quantity} />
      </Select>
    </form>
  );
}
