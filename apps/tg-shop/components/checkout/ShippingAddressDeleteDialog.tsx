"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { deleteShippingAddress } from "@/components/checkout/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function ShippingAddressDeleteDialog({
  id,
  open,
  onOpenChange
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!id) return null;

  const [formState, formAction] = useFormState(deleteShippingAddress, null);
  const actionWithId = formAction.bind(null, id);

  const t = useTranslations("ShippingPage");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          "bg-telegram-bg-color text-telegram-text-color rounded-xl border-none"
        }
      >
        <DialogHeader>
          <DialogTitle>{t("deleteMessage")}</DialogTitle>
        </DialogHeader>
        <form action={actionWithId}>
          {formState && (
            <p className={"text-telegram-destructive-text-color"}>
              {formState}
            </p>
          )}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const hapticFeedback = useHapticFeedback();
  const { pending } = useFormStatus();
  const t = useTranslations("ShippingPage");

  if (pending) {
    return (
      <Button
        className={"w-full flex items-center gap-2 justify-center"}
        disabled
        type={"submit"}
        variant={"destructive"}
      >
        <AiOutlineLoading3Quarters className={"animate-spin"} />
        {t("deleting")}
      </Button>
    );
  }

  return (
    <Button
      className={"w-full"}
      variant={"destructive"}
      type={"submit"}
      onClick={() => hapticFeedback.impactOccurred("light")}
    >
      {t("delete")}
    </Button>
  );
}
