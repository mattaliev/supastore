"use client";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { deleteProduct } from "@/components/product/actions";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        variant={"destructive"}
        onClick={(e) => e.preventDefault()}
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
      variant={"destructive"}
      className={"w-full"}
    >
      Delete
    </Button>
  );
}

export default function ProductDeleteDialog({
  title,
  productId,
  dialogOpen,
  setDialogOpen,
  isProductsPage
}: {
  title: string;
  productId: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  isProductsPage: boolean;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Do you want to delete {title}? Deleting this entry cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <ProductDeleteForm
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        productId={productId}
        isProductsPage={isProductsPage}
      />
    </DialogContent>
  );
}

function ProductDeleteForm({
  productId,
  isProductsPage,
  dialogOpen,
  setDialogOpen
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  productId: string;
  isProductsPage: boolean;
}) {
  const storeId = useStore();
  const [formStatus, formAction] = useFormState(deleteProduct, null);
  const actionWithProductId = formAction.bind(null, {
    productId,
    isProductsPage,
    storeId
  });

  useEffect(() => {
    if (formStatus?.success && dialogOpen) {
      setDialogOpen(false);
    }
  });

  return (
    <form action={actionWithProductId} className={"grid items-start gap-4"}>
      {formStatus?.formError && (
        <p className={"text-destructive text-center sm:text-start text-xs"}>
          {formStatus.formError}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
