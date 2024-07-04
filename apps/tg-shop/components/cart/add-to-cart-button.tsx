"use client";

import { useHapticFeedback } from "@tma.js/sdk-react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { addToCart } from "@/components/cart/actions";
import { useStore } from "@/components/store/store-context";
import { Button, ButtonProps } from "@/components/ui/button";

const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    selectedSizeId: string;
    doesProductHaveVariants: boolean;
    children?: React.ReactNode;
  }
>(
  (
    { selectedSizeId, doesProductHaveVariants, className, children, ...props },
    ref
  ) => {
    console.log(props.variant);

    const { pending } = useFormStatus();
    const hapticFeedback = useHapticFeedback();
    const t = useTranslations("ProductCatalogPage");

    const buttonClass = "";
    // "w-full bg-telegram-button-color text-telegram-button-text-color hover:bg-telegram-button-color";
    const disabledClass =
      "bg-telegram-hint-color text-telegram-text-color cursor-not-allowed";

    if (pending) {
      return (
        <Button
          ref={ref}
          className={clsx(buttonClass, disabledClass, className)}
          {...props}
        >
          <AiOutlineLoading3Quarters className="animate-spin" />
        </Button>
      );
    }

    if (doesProductHaveVariants && !selectedSizeId) {
      return (
        <Button
          {...props}
          className={clsx(buttonClass, disabledClass, className)}
          onClick={() => hapticFeedback.impactOccurred("medium")}
          type={"submit"}
        >
          {t("selectVariantButton")}
        </Button>
      );
    }

    return (
      <Button
        {...props}
        className={clsx(
          buttonClass,
          "flex justify-center space-x-1 m-0 items-center",
          className
        )}
        type={"submit"}
        onClick={() => hapticFeedback.impactOccurred("light")}
      >
        {children ? children : t("addToCart")}
        {/*{t("addToCart")}*/}
      </Button>
    );
  }
);

type AddToCartProps = {
  productVariantId: string;
  productVariantSizeId: string;
  doesProductHaveVariants: boolean;
  children?: React.ReactNode;
};

type AddToCartButtonProps = ButtonProps & AddToCartProps;

const AddToCartButton = React.forwardRef<HTMLFormElement, AddToCartButtonProps>(
  (
    {
      productVariantId,
      productVariantSizeId,
      doesProductHaveVariants,
      children,
      ...props
    },
    ref
  ) => {
    const [message, formAction] = useFormState(addToCart, null);
    const storeId = useStore();

    const payload = {
      storeId,
      productVariantId,
      productVariantSizeId,
      doesProductHaveVariants,
      quantity: 1
    };

    const actionWithProductVariant = formAction.bind(null, payload);

    return (
      <form action={actionWithProductVariant} className="w-full" ref={ref}>
        <SubmitButton
          selectedSizeId={productVariantSizeId}
          doesProductHaveVariants={doesProductHaveVariants}
          {...props}
        >
          {children}
        </SubmitButton>
        {message && (
          <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
            {message}
          </p>
        )}
      </form>
    );
  }
);
AddToCartButton.displayName = "AddToCartButton";

export default AddToCartButton;
