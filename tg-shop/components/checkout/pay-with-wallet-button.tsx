"use client";

import {
  useClosingBehavior,
  useHapticFeedback,
  useMiniApp,
  useUtils,
} from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading } from "react-icons/ai";

import { Button } from "../ui/button";

import { createInvoice } from "@/components/invoice/actions";
import { Order } from "@/lib/api/types";

function SubmitButton(): JSX.Element {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();
  const buttonClass =
    "mt-4 w-full bg-telegram-button-color text-telegram-text-color hover:bg-telegram-button-color border-none border-telegram-text-color hover:text-telegram-button-text-color hover:border-none";
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
      Pay via Wallet
    </Button>
  );
}

export default function PayWithWalletButton({
  order,
}: {
  order: Order;
}): JSX.Element {
  const utils = useUtils();
  const miniApp = useMiniApp();
  const [invoiceResponse, formAction] = useFormState(createInvoice, null);

  useEffect(() => {
    if (invoiceResponse?.paymentLink) {
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
