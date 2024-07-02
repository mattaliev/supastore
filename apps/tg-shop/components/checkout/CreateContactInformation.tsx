"use client";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading } from "react-icons/ai";

import { createContactInformation } from "@/components/checkout/actions";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateContactInformation({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("ContactInfoPage");

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={
          "text-telegram-text-color bg-telegram-bg-color rounded-xl border-none"
        }
      >
        <DrawerHeader>
          <DrawerTitle className={"text-telegram-text-color"}>
            {t("addContactInfo")}
          </DrawerTitle>
        </DrawerHeader>
        <CreateContactInformationForm />
      </DrawerContent>
    </Drawer>
  );
}

function CreateContactInformationForm() {
  const [formState, formAction] = useFormState(createContactInformation, null);
  const t = useTranslations("ContactInfoPage.CreateForm");

  return (
    <form className={"grid gap-4 p-4"} action={formAction}>
      <div className={"flex flex-col gap-1"}>
        <Label htmlFor={"name"}>{t("fullName.label")}</Label>
        <Input
          type={"text"}
          id={"name"}
          name={"name"}
          className={"bg-telegram-bg-color text-telegram-text-color text-base"}
          placeholder={t("fullName.placeholder")}
        />
        {formState && formState.fieldErrors?.name && (
          <p className={"text-telegram-destructive-text-color text-sm"}>
            {t("fullName.errorMessage")}
          </p>
        )}
      </div>
      <div className={"flex flex-col gap-1"}>
        <Label htmlFor={"email"}>{t("email.label")}</Label>
        <Input
          type={"email"}
          id={"email"}
          name={"email"}
          className={"bg-telegram-bg-color text-telegram-text-color text-base"}
          placeholder={t("email.placeholder")}
        />
        {formState && formState.fieldErrors?.email && (
          <p className={"text-telegram-destructive-text-color text-sm"}>
            {t("email.errorMessage")}
          </p>
        )}
      </div>
      <div className={"flex flex-col gap-1"}>
        <Label htmlFor={"phone"}>{t("phone.label")}</Label>
        <Input
          type={"tel"}
          id={"phone"}
          name={"phone"}
          className={"bg-telegram-bg-color text-telegram-text-color text-base"}
          placeholder={t("phone.placeholder")}
        />
        {formState && formState.fieldErrors?.phone && (
          <p className={"text-telegram-destructive-text-color text-sm"}>
            {t("phone.errorMessage")}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const hapticFeedback = useHapticFeedback();
  const { pending } = useFormStatus();
  const t = useTranslations("ContactInfoPage.CreateForm");

  if (pending) {
    return (
      <Button
        className={"w-full flex items-center gap-2 justify-center"}
        disabled
      >
        <AiOutlineLoading className={"animate-spin"} />
        {t("saving")}
      </Button>
    );
  }

  return (
    <Button
      className={"w-full"}
      type={"submit"}
      onClick={() => hapticFeedback.impactOccurred("medium")}
    >
      {t("save")}
    </Button>
  );
}
