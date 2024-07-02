"use client";
import { useHapticFeedback, useMiniApp, useUtils } from "@tma.js/sdk-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";

import { createOrder } from "@/components/checkout/actions";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import CheckoutTotal from "@/components/checkout/CheckoutTotal";

export default function CheckoutForm({
  cartTotal,
  cartQuantity,
  children,
  canCheckout
}: {
  cartTotal: number;
  cartQuantity: number;
  canCheckout?: boolean;
  children: React.ReactNode;
}) {
  const [formState, formAction] = useFormState(createOrder, null);
  const utils = useUtils();
  const hapticFeedback = useHapticFeedback();
  const miniApp = useMiniApp();

  useEffect(() => {
    if (formState?.success) {
      if (formState.paymentLink) {
        utils.openTelegramLink(formState.paymentLink);
      }
      hapticFeedback.notificationOccurred("success");
      miniApp.close();
    } else if (formState && !formState.success) {
      hapticFeedback.notificationOccurred("error");
    }
  }, [formState]);

  return (
    <form className={"grid gap-6"} action={formAction}>
      {children}
      <CheckoutTotal totalQuantity={cartQuantity} cartTotal={cartTotal} />
      <div
        className={
          "sticky bottom-0 z-10 w-full py-2 bg-telegram-bg-color -mt-6"
        }
      >
        {formState && formState.formError && (
          <p className={"text-telegram-destructive-text-color my-2"}>
            {formState.formError}
          </p>
        )}
        <CheckoutButton canCheckout={canCheckout} />
      </div>
    </form>
  );
}
