"use client";

import { PaymentStatus } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { updatePaymentStatus } from "@/components/payment/actions";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";

export default function MarkAsPaidDrawerDialog({
  paymentId,
}: {
  paymentId: string;
}) {
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;
  const [open, setOpen] = useState<boolean>(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"sm"} type={"button"}>
            Mark as paid
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark order as paid</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this order as paid?
            </DialogDescription>
          </DialogHeader>
          <MarkAsPaidForm paymentId={paymentId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"} type={"button"}>
          Mark as paid
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Mark order as paid</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to mark this order as paid?
          </DrawerDescription>
        </DrawerHeader>
        <MarkAsPaidForm paymentId={paymentId} className={"px-4"} />
        <DrawerFooter className={"pt-2"}>
          <DrawerClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MarkAsPaidForm({
  paymentId,
  className,
}: {
  paymentId: string;
  className?: string;
}) {
  const storeId = useStore();
  const [formState, formAction] = useFormState(updatePaymentStatus, {
    storeId,
    paymentId,
    paymentStatus: PaymentStatus.PAID,
  });

  return (
    <form
      action={formAction}
      className={twMerge("grid items-start gap-4", className)}
    >
      <div className="flex items-center space-x-2">
        <Checkbox id="notify-user" name="notify-user" />
        <Label htmlFor="notify-user">
          Notify customer about receiving a payment?
        </Label>
      </div>
      {formState?.error && (
        <p className={"text-destructive text-end text-xs"}>{formState.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1"}
        disabled
        size={"sm"}
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        Marking as paid...
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"}>
      Mark as paid
    </Button>
  );
}
