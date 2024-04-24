"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useFormState, useFormStatus } from "react-dom";
import { updateOrderStatus } from "@/components/order/actions";
import { PaymentStatus } from "@/lib/api/types";
import { twMerge } from "tailwind-merge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";

export default function MarkAsPaidDrawerDialog({
  orderId,
}: {
  orderId: string;
}) {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
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
          <MarkAsPaidForm orderId={orderId} />
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
        <MarkAsPaidForm orderId={orderId} className={"px-4"} />
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
  orderId,
  className,
}: {
  orderId: string;
  className?: string;
}) {
  const [formState, formAction] = useFormState(updateOrderStatus, {
    orderId,
    fulfilmentStatus: undefined,
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
