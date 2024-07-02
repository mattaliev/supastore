"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Button } from "@/components/ui/button";

export default function CheckoutSubmitButton(): JSX.Element {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();

  const buttonClasses =
    "w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
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
      Checkout
    </Button>
  );
}

// export default function CheckoutButton(): JSX.Element {
//   const formRef = useRef<HTMLFormElement>(null);
//   const [message, formAction] = useFormState(createOrder, null);
//
//   return (
//     <form action={formAction} ref={formRef}>
//       <SubmitButton formRef={formRef} />
//       <p className={"text-telegram-text-color text-center text-xs"}>
//         {message || ""}
//       </p>
//     </form>
//   );
// }
