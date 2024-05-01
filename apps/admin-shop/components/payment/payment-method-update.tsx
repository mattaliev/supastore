"use client";
import { ParsedPaymentMethod } from "@ditch/lib";
import { FilePenIcon, LoaderCircle } from "lucide-react";
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

export default function PaymentMethodUpdateDialogDrawer({
  paymentMethod,
}: {
  paymentMethod: ParsedPaymentMethod;
}) {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const [open, setOpen] = useState<boolean>(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" size="icon">
            <FilePenIcon className="w-5 h-5" />
            <span className="sr-only">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
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
          <span className="sr-only">Edit</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Payment Method</DrawerTitle>
        </DrawerHeader>
        <PaymentMethodUpdateForm
          paymentMethod={paymentMethod}
          className="px-4 mt-4"
          setOpen={setOpen}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" type={"button"}>
              Discard
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
  className,
}: {
  paymentMethod: ParsedPaymentMethod;
  setOpen: (open: boolean) => void;
  className?: string;
}) {
  const [provider, setProvider] = useState<string>(paymentMethod.provider);
  const [formState, formAction] = useFormState(updatePaymentMethod, null);

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
        <p className="text-destructive text-xs">{formState.formError}</p>
      )}
      {provider && <SubmitButton />}
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
        Updating Payment Gateway...
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"} className={"w-full"}>
      Update Payment Gateway
    </Button>
  );
}
