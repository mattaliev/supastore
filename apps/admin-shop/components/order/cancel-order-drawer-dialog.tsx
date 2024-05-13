"use client";
import { FulfilmentStatus } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { updateOrderStatus } from "@/components/order/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";

export function CancelOrderDrawerDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" type="button" size="sm">
            Cancel
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to cancel this order?
            </DialogTitle>
            <DialogDescription>
              The refund for the order will have to be disputed through a
              payment system that the customer used
            </DialogDescription>
          </DialogHeader>
          <CancelOrderForm orderId={orderId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive" size={"sm"} type={"button"}>
          Cancel
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Are you sure you want to cancel this order?</DrawerTitle>
          <DrawerDescription>
            The refund for the order will have to be disputed through a payment
            system that the customer used
          </DrawerDescription>
        </DrawerHeader>
        <CancelOrderForm orderId={orderId} className={"px-4"} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Go back</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CancelOrderForm({
  orderId,
  className
}: {
  orderId: string;
  className?: string;
}) {
  const [formStatus, formAction] = useFormState(updateOrderStatus, {
    orderId,
    fulfilmentStatus: FulfilmentStatus.CANCELLED
  });
  return (
    <form
      action={formAction}
      className={twMerge("grid items-start gap-4", className)}
    >
      <div className="flex items-center space-x-2">
        <Checkbox id="notify-user" name="notify-user" />
        <Label htmlFor="notify-user">Notify customer about cancellation?</Label>
      </div>
      {formStatus?.error && (
        <p className={"text-destructive text-center sm:text-start text-xs"}>
          {formStatus.error}
        </p>
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
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        onClick={(e) => e.preventDefault()}
        variant={"destructive"}
      >
        <LoaderCircle className="animate-spin" />
        Canceling order...
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
      Cancel order
    </Button>
  );
}
