"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { deleteContactInformation } from "@/components/checkout/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function ContactInformationDeleteDialog({
  id,
  open,
  onOpenChange
}: {
  id?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!id) return null;

  const hapticFeedback = useHapticFeedback();
  const [formState, formAction] = useFormState(deleteContactInformation, null);

  const actionWithId = formAction.bind(null, id);

  const t = useTranslations("ContactInfoPage");

  useEffect(() => {
    if (formState) hapticFeedback.notificationOccurred("error");
  }, [formState]);

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
              {t("deleteContactInfoError")}
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
  const t = useTranslations("ContactInfoPage");

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
      onClick={() => hapticFeedback.impactOccurred("light")}
      type={"submit"}
      variant={"destructive"}
    >
      {t("delete")}
    </Button>
  );
}
