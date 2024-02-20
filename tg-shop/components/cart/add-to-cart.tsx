"use client";

import { clsx } from "clsx";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { addToCart } from "@/components/cart/actions";
import { Button } from "@/components/ui/button";

function SubmitButton({
  selectedVariantId,
  doesProductHaveVariants,
}: {
  selectedVariantId?: string;
  doesProductHaveVariants: boolean;
}) {
  const { pending } = useFormStatus();
  const buttonClass =
    "mt-4 w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
  const disabledClass =
    "bg-telegram-hint-color text-telegram-text-color cursor-not-allowed";

  if (pending) {
    return (
      <Button className={clsx(buttonClass, disabledClass)}>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </Button>
    );
  }

  if (doesProductHaveVariants && !selectedVariantId) {
    return (
      <Button className={clsx(buttonClass, disabledClass)}>
        Select a Variant
      </Button>
    );
  }

  return <Button className={clsx(buttonClass)}>Add to Cart</Button>;
}

export default function AddToCart({
  productId,
  selectedVariantId,
  doesProductHaveVariants,
}: {
  productId: string;
  selectedVariantId?: string;
  doesProductHaveVariants: boolean;
}): JSX.Element {
  const [message, formAction] = useFormState(addToCart, null);

  const payload = {
    productId,
    selectedVariantId,
    doesProductHaveVariants,
    quantity: 1,
  };

  const actionWithProductVariant = formAction.bind(null, payload);

  return (
    <form action={actionWithProductVariant}>
      <SubmitButton
        selectedVariantId={selectedVariantId}
        doesProductHaveVariants={doesProductHaveVariants}
      />
      <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
        {message || ""}
      </p>
    </form>
  );
}
