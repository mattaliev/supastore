"use client";

import { LoaderCircle, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { deletePaymentMethod } from "@/components/payment/actions";
import { useStore } from "@/components/store/store-context";
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
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Trash2Icon className="w-5 h-5" />
            <span className="sr-only">Delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this payment method?
            </DialogTitle>
            <DialogDescription>
              Once you delete the payment method, you want be able to see it
              again
            </DialogDescription>
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
          <span className="sr-only">Delete</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Are you sure you want to delete this payment method?
          </DrawerTitle>
          <DrawerDescription>
            Once you delete the payment method, you want be able to see it again
          </DrawerDescription>
        </DrawerHeader>
        <PaymentMethodDeleteForm
          setOpen={setOpen}
          paymentMethodId={paymentMethodId}
          className="px-4 mt-4"
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              Cancel
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
  const storeId = useStore();
  const [formState, formAction] = useFormState(deletePaymentMethod, {
    storeId
  });

  useEffect(() => {
    if (formState?.success) {
      setOpen(false);
    }
  }, [formState?.success]);

  const actionWithPaymentId = formAction.bind(null, paymentMethodId);
  return (
    <form action={actionWithPaymentId} className={twMerge(className)}>
      {formState?.error && (
        <p className="text-destructive text-xs">{formState.error}</p>
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
        Deleting...
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
      Delete
    </Button>
  );
}
