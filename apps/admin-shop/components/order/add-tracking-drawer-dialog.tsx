"use client";
import { LoaderCircle } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddTrackingDrawerDialog({
  storeId,
  shippingId,
}: {
  storeId: string;
  shippingId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" size="sm">
            Add tracking
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add shipping tracking number</DialogTitle>
          </DialogHeader>
          <AddTrackingForm shippingId={shippingId} storeId={storeId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"} type={"button"}>
          Add tracking
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add shipping tracking number</DrawerTitle>
        </DrawerHeader>
        <AddTrackingForm
          shippingId={shippingId}
          className={"px-4"}
          storeId={storeId}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddTrackingForm({
  shippingId,
  className,
  storeId,
}: {
  storeId: string;
  shippingId: string;
  className?: string;
}) {
  const [formState, formAction] = useFormState(addShippingTracking, {
    shippingId,
    storeId,
  });

  return (
    <form
      action={formAction}
      className={twMerge("grid items-start gap-4 ", className)}
    >
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="carrier">Shipping carrier</Label>
        {formState?.fieldErrors?.carrier && (
          <p className={"text-destructive text-xs"}>
            {formState.fieldErrors.carrier}
          </p>
        )}
        <Input type="text" name="carrier" id="carrier" />
      </div>
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="tracking-number">Tracking number</Label>
        {formState?.fieldErrors?.trackingNumber && (
          <p className={"text-destructive text-xs"}>
            {formState.fieldErrors.trackingNumber}
          </p>
        )}
        <Input type="text" name="tracking-number" id="tracking-number" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="notify-user" name="notify-user" />
        <Label htmlFor="notify-user">
          Send tracking number to the customer?
        </Label>
      </div>
      {formState?.formError && (
        <p className={"text-destructive text-xs"}>{formState.formError}</p>
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
      >
        <LoaderCircle className="animate-spin" />
        Adding tracking...
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"} className={"w-full"}>
      Add tracking
    </Button>
  );
}
