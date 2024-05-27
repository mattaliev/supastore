"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { deleteOrder } from "@/components/order/actions";
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

export default function OrderDeleteDrawerDialog({
  orderId
}: {
  orderId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"sm"} type={"button"} variant={"destructive"}>
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this order?
            </DialogTitle>
            <DialogDescription>
              Once you delete the order, you want be able to see it again
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
          Delete
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure you want to delete this order?</DrawerTitle>
          <DrawerDescription>
            Once you delete the order, you want be able to see it again
          </DrawerDescription>
        </DrawerHeader>
        <DeleteOrderForm orderId={orderId} className="px-4 mt-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" type={"button"}>
              Go back
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
  const storeId = useStore();
  const [formStatus, formAction] = useFormState(deleteOrder, null);

  const actionWithOrderId = formAction.bind(null, { orderId, storeId });

  return (
    <form
      action={actionWithOrderId}
      className={twMerge("grid items-start gap-4", className)}
    >
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
