"use client";
import { useHapticFeedback, useMiniApp, useUtils } from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading } from "react-icons/ai";

import { createInvoice } from "@/components/invoice/actions";
import { Button } from "@/components/ui/button";

function SubmitButton(): JSX.Element {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();
  const buttonClass =
    "mt-4 w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  const disabledClass =
    "bg-telegram-hint-color text-telegram-text-color cursor-not-allowed";

  if (pending) {
    return (
      <Button className={clsx(buttonClass, disabledClass)}>
        <AiOutlineLoading className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      className={clsx(buttonClass)}
      onClick={() => hapticFeedback.impactOccurred("heavy")}
    >
      Pay with card
    </Button>
  );
}

export default function PayWithCardButton(): JSX.Element {
  const [invoiceResponse, formAction] = useFormState(createInvoice, null);
  const utils = useUtils();
  const miniApp = useMiniApp();

  useEffect(() => {
    if (invoiceResponse?.paymentLink) {
      // Open the payment link
      utils.openTelegramLink(invoiceResponse.paymentLink);
      miniApp.close();
    }
  }, [invoiceResponse?.paymentLink]);

  return (
    <form action={formAction} className="w-full">
      <SubmitButton />
      {invoiceResponse?.error && (
        <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
          {invoiceResponse.error}
        </p>
      )}
    </form>
  );
}
