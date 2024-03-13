"use client";
import { clsx } from "clsx";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { removeFromCart } from "@/components/cart/actions";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TrashIcon } from "@/components/ui/icons";

function DrawerTriggerButton() {
  const buttonClasses =
    "bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color p-0 h-6 w-6";

  return (
    <DrawerTrigger asChild className="border-none outline-none">
      <Button className={clsx(buttonClasses)}>
        <TrashIcon className="h-5 w-5" />
        <span className="sr-only">Remove</span>
      </Button>
    </DrawerTrigger>
  );
}

function CancelButton({ setIsDrawerOpen }: { setIsDrawerOpen: Function }) {
  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  const buttonClasses =
    "bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  return (
    <Button className={buttonClasses} onClick={handleClose}>
      Cancel
    </Button>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();
  const buttonClasses =
    "text-telegram-text-color hover:text-telegram-text-color bg-telegram-bg-color hover:bg-telegram-bg-color border border-telegram-text-color w-full my-2";
  const disabledClasses =
    "bg-telegram-button-hint-color text-telegram-text-color cursor-not-allowed";

  if (pending) {
    return (
      <Button type="submit" className={clsx(buttonClasses, disabledClasses)}>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      className={clsx(buttonClasses)}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
    >
      Remove from cart
    </Button>
  );
}

export default function RemoveFromCart({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const [message, formAction] = useFormState(removeFromCart, null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const actionWithPayload = formAction.bind(null, {
    cartItemId: itemId,
    quantity,
  });

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTriggerButton />
      <DrawerContent className="bg-telegram-bg-color text-telegram-text-color border-none outline-none">
        <DrawerHeader>
          <DrawerTitle>
            Are you sure you want to remove this item from your cart?
          </DrawerTitle>
        </DrawerHeader>
        <form action={actionWithPayload} className={"px-4"}>
          <SubmitButton />
          <p className="text-xs text-telegram-text-color">{message || ""}</p>
        </form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <CancelButton setIsDrawerOpen={setIsDrawerOpen} />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
