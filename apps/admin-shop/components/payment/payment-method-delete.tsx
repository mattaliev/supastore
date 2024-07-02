"use client";

import { LoaderCircle, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { deletePaymentMethod } from "@/components/payment/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

export default function PaymentMethodDelete({
  paymentMethodId
}: {
  paymentMethodId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;
  const t = useTranslations("PaymentSystemsPage.DeletePaymentSystem");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Trash2Icon className="w-5 h-5" />
            <span className="sr-only">{t("delete")}</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <PaymentMethodDeleteForm
            paymentMethodId={paymentMethodId}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline">
          <Trash2Icon className="w-5 h-5" />
          <span className="sr-only">{t("delete")}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>{t("description")}</DrawerDescription>
        </DrawerHeader>
        <PaymentMethodDeleteForm
          setOpen={setOpen}
          paymentMethodId={paymentMethodId}
          className="px-4 mt-4"
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              {t("cancel")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PaymentMethodDeleteForm({
  paymentMethodId,
  className,
  setOpen
}: {
  paymentMethodId: string;
  className?: string;
  setOpen: (value: boolean) => void;
}) {
  const [formState, formAction] = useFormState(deletePaymentMethod, null);
  const t = useTranslations("PaymentSystemsPage.DeletePaymentSystem");

  useEffect(() => {
    if (formState?.success) {
      setOpen(false);
    }
  }, [formState?.success]);

  const actionWithPaymentId = formAction.bind(null, paymentMethodId);
  return (
    <form action={actionWithPaymentId} className={twMerge(className)}>
      {formState?.error && (
        <p className="text-destructive text-xs">{t("deleteError")}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("PaymentSystemsPage.DeletePaymentSystem");

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        onClick={(e) => e.preventDefault()}
        variant={"destructive"}
      >
        <LoaderCircle className="animate-spin" />
        {t("deleting")}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      type={"submit"}
      className={"w-full"}
      variant={"destructive"}
    >
      {t("delete")}
    </Button>
  );
}
