"use client";
import { SafePaymentMethod } from "@ditch/lib";
import { useHapticFeedback, useMiniApp, useUtils } from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading } from "react-icons/ai";

import { createPayment } from "@/components/checkout/actions";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

const buttonClasses: Record<string, string> = {
  "Wallet Pay":
    "bg-telegram-bg-color text-telegram-text-color hover:bg-telegram-wallet-button-color border border-telegram-text-color hover:text-telegram-button-text-color hover:border-none",
  Stripe:
    "bg-telegram-bg-color text-telegram-text-color hover:bg-indigo-500 border border-telegram-text-color hover:text-telegram-button-text-color hover:border-none",
  Crypto:
    "bg-telegram-bg-color text-telegram-text-color hover:bg-telegram-button-color border border-telegram-text-color hover:text-telegram-button-text-color hover:border-none",
  "Bank Transfer":
    "bg-telegram-bg-color text-telegram-text-color hover:bg-telegram-button-color border border-telegram-text-color hover:text-telegram-button-text-color hover:border-none"
};

function SubmitButton({
  name,
  buttonText
}: {
  name: string;
  buttonText?: string;
}) {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();
  const buttonClass = clsx("w-full", buttonClasses[name]);
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
      type="submit"
      onClick={() => hapticFeedback.impactOccurred("heavy")}
    >
      {buttonText || "Pay with " + name}
    </Button>
  );
}

export default function PaymentButton({
  paymentMethod
}: {
  paymentMethod: SafePaymentMethod;
}) {
  const { id, name, provider, buttonText } = paymentMethod;
  const storeId = useStore();
  const utils = useUtils();
  const miniApp = useMiniApp();
  const [formState, formAction] = useFormState(createPayment, null);
  const actionWithPaymentMethod = formAction.bind(null, {
    storeId,
    paymentMethodId: id
  });

  useEffect(() => {
    if (!formState?.success) {
      return;
    }

    if (formState?.paymentLink) {
      utils.openTelegramLink(formState.paymentLink);
    }

    miniApp.close();
  }, [formState?.success, formState?.paymentLink]);

  return (
    <form action={actionWithPaymentMethod} className={"w-full"}>
      <SubmitButton name={name} buttonText={buttonText} />
      {formState?.error && (
        <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
          {formState.error}
        </p>
      )}
    </form>
  );
}
