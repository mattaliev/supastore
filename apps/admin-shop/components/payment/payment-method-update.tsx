"use client";
import { ParsedPaymentMethod } from "@ditch/lib";
import { FilePenIcon, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { updatePaymentMethod } from "@/components/payment/actions";
import PaymentMethodFields from "@/components/payment/payment-method-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

export default function PaymentMethodUpdateDialogDrawer({
  paymentMethod
}: {
  paymentMethod: ParsedPaymentMethod;
}) {
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations("PaymentSystemsPage.UpdatePaymentSystem");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" size="icon">
            <FilePenIcon className="w-5 h-5" />
            <span className="sr-only">{t("edit")}</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>
          <PaymentMethodUpdateForm
            paymentMethod={paymentMethod}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" type="button" size="icon">
          <FilePenIcon className="w-5 h-5" />
          <span className="sr-only">{t("edit")}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("title")}</DrawerTitle>
        </DrawerHeader>
        <PaymentMethodUpdateForm
          paymentMethod={paymentMethod}
          className="px-4 mt-4"
          setOpen={setOpen}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" type={"button"}>
              {t("discard")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PaymentMethodUpdateForm({
  paymentMethod,
  setOpen,
  className
}: {
  paymentMethod: ParsedPaymentMethod;
  setOpen: (open: boolean) => void;
  className?: string;
}) {
  const [provider, setProvider] = useState<string>(paymentMethod.provider);
  const [formState, formAction] = useFormState(updatePaymentMethod, null);
  const t = useTranslations("PaymentSystemsPage.UpdatePaymentSystem");

  useEffect(() => {
    if (formState?.success) {
      setOpen(false);
    }
  });

  return (
    <form action={formAction} className={twMerge("grid gap-4", className)}>
      <input type="hidden" name="id" value={paymentMethod.id} />
      <PaymentMethodFields
        paymentMethod={paymentMethod}
        fieldErrors={formState?.fieldErrors}
        provider={provider}
        setProvider={setProvider}
      />
      {formState?.formError && (
        <p className="text-destructive text-xs">{t("updateError")}</p>
      )}
      {provider && <SubmitButton />}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("PaymentSystemsPage.UpdatePaymentSystem");

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        {t("updatingPaymentMethod")}
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"} className={"w-full"}>
      {t("updatePaymentMethod")}
    </Button>
  );
}
