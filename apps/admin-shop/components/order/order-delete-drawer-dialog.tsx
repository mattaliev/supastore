"use client";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { deleteOrder } from "@/components/order/actions";
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

export default function OrderDeleteDrawerDialog({
  orderId
}: {
  orderId: string;
}) {
  const t = useTranslations("OrderEditPage");

  const [open, setOpen] = useState<boolean>(false);
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"sm"} type={"button"} variant={"destructive"}>
            {t("delete")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteConfirmationHeading")}</DialogTitle>
            <DialogDescription>
              {t("deleteConfirmationDescription")}
            </DialogDescription>
          </DialogHeader>
          <DeleteOrderForm orderId={orderId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"} type={"button"} variant={"destructive"}>
          {t("delete")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("deleteConfirmationHeading")}</DrawerTitle>
          <DrawerDescription>
            {t("deleteConfirmationDescription")}{" "}
          </DrawerDescription>
        </DrawerHeader>
        <DeleteOrderForm orderId={orderId} className="px-4 mt-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" type={"button"}>
              {t("goBack")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DeleteOrderForm({
  orderId,
  className
}: {
  orderId: string;
  className?: string;
}) {
  const t = useTranslations("OrderEditPage");
  const [formStatus, formAction] = useFormState(deleteOrder, null);

  const actionWithOrderId = formAction.bind(null, orderId);

  return (
    <form
      action={actionWithOrderId}
      className={twMerge("grid items-start gap-4", className)}
    >
      {formStatus?.error && (
        <p className={"text-destructive text-center sm:text-start text-xs"}>
          {t("deleteFormError")}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("OrderEditPage");

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
