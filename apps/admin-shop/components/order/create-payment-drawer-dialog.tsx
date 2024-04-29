"use client";

import { PaymentMethod } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { createPaymentManually } from "@/components/payment/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePaymentDrawerDialog({
  orderId,
  paymentMethods,
}: {
  orderId: string;
  paymentMethods: PaymentMethod[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" size="sm">
            Create invoice
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create invoice</DialogTitle>
            <DialogDescription>
              Note: Once you create payment, the customer will not be able to
              change the order
            </DialogDescription>
          </DialogHeader>
          <CreatePaymentForm
            orderId={orderId}
            paymentMethods={paymentMethods}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"} type={"button"}>
          Create Invoice
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
        <CreatePaymentForm
          orderId={orderId}
          paymentMethods={paymentMethods}
          className={"px-4"}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Go back</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CreatePaymentForm({
  orderId,
  paymentMethods,
  className,
}: {
  orderId: string;
  paymentMethods: PaymentMethod[];
  className?: string;
}) {
  const [formState, formAction] = useFormState(createPaymentManually, {
    orderId,
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("");

  return (
    <form
      action={formAction}
      className={twMerge("grid items-start gap-4", className)}
    >
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="tracking-number">Payment Provider</Label>
        <Select
          name="payment-method"
          onValueChange={(value) => setPaymentMethod(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a payment provider" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
          <input
            type={"hidden"}
            value={paymentMethod}
            name={"payment-method"}
            id={"payment-method"}
          />
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="notify-customer"
          name="notify-customer"
          defaultChecked={true}
        />
        <Label htmlFor="notify-user">Send invoice to customer?</Label>
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
        Creating invoice...
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"}>
      Create invoice
    </Button>
  );
}
