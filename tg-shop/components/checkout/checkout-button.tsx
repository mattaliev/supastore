"use client";
import { clsx } from "clsx";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { createOrder } from "@/components/checkout/actions";
import { Button } from "@/components/ui/button";

function SubmitButton(): JSX.Element {
  const { pending } = useFormStatus();

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
      }}
    >
      Finalize
    </Button>
  );
}

export default function FinalizeButton(): JSX.Element {
  const [message, formAction] = useFormState(createOrder, null);

  return (
    <form action={formAction}>
      <SubmitButton />
      <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
        {message || ""}
      </p>
    </form>
  );
}
