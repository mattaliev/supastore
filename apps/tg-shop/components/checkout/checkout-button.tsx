"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { RefObject, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { createOrder } from "@/components/checkout/actions";
import { Button } from "@/components/ui/button";

function SubmitButton({
  formRef
}: {
  formRef: RefObject<HTMLFormElement>;
}): JSX.Element {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();

  const buttonClasses =
    "mt-8 w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  const disabledClasses = "cursor-not-allowed";

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
        hapticFeedback.impactOccurred("heavy");
      }}
    >
      Join the Wild Side
    </Button>
  );
}

export default function CheckoutButton(): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, formAction] = useFormState(createOrder, null);

  return (
    <form action={formAction} ref={formRef}>
      <SubmitButton formRef={formRef} />
      <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
        {message || ""}
      </p>
    </form>
  );
}
