"use client";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { addShippingTracking } from "@/components/order/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddTrackingDrawerDialog({
  shippingId
}: {
  shippingId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;
  const t = useTranslations("OrderEditPage.OrderShipping.AddTracking");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" size="sm">
            {t("addTrackingButton")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addTrackingTitle")}</DialogTitle>
          </DialogHeader>
          <AddTrackingForm shippingId={shippingId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"} type={"button"}>
          {t("addTrackingButton")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("addTrackingTitle")}</DrawerTitle>
        </DrawerHeader>
        <AddTrackingForm shippingId={shippingId} className={"px-4"} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddTrackingForm({
  shippingId,
  className
}: {
  shippingId: string;
  className?: string;
}) {
  const [formState, formAction] = useFormState(addShippingTracking, null);
  const t = useTranslations("OrderEditPage.OrderShipping.AddTracking");

  return (
    <form
      action={formAction}
      className={twMerge("grid items-start gap-4 ", className)}
    >
      <input type="hidden" name="shipping-id" value={shippingId} />
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="carrier">{t("shippingCarrier")}</Label>
        {formState?.fieldErrors?.carrier && (
          <p className={"text-destructive text-xs"}>
            {t("shippingCarrierError")}
          </p>
        )}
        <Input type="text" name="carrier" id="carrier" />
      </div>
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="tracking-number">{t("trackingNumber")}</Label>
        {formState?.fieldErrors?.trackingNumber && (
          <p className={"text-destructive text-xs"}>
            {t("trackingNumberError")}
          </p>
        )}
        <Input type="text" name="tracking-number" id="tracking-number" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="notify-user" name="notify-user" />
        <Label htmlFor="notify-user">{t("notifyUser")}</Label>
      </div>
      {formState?.formError && (
        <p className={"text-destructive text-xs"}>{t("addTrackingError")}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("OrderEditPage.OrderShipping.AddTracking");

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        {t("addingTrackingButton")}
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"} className={"w-full"}>
      {t("addTrackingButton")}
    </Button>
  );
}
