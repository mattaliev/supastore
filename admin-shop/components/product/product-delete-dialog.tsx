import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProduct } from "@/components/product/actions";
import { useEffect } from "react";

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
  isProductsPage,
}: {
  title: string;
  productId: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  isProductsPage: boolean;
}) {
  const [formStatus, formAction] = useFormState(deleteProduct, null);
  const actionWithProductId = formAction.bind(null, {
    productId,
    isProductsPage,
  });

  useEffect(() => {
    if (formStatus?.success) {
      if (dialogOpen) {
        setDialogOpen(false);
      }
    }
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Do you want to delete {title}? Deleting this entry cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <ProductDeleteForm
        productId={productId}
        isProductsPage={isProductsPage}
      />
    </DialogContent>
  );
}

function ProductDeleteForm({
  productId,
  isProductsPage,
}: {
  productId: string;
  isProductsPage: boolean;
}) {
  const [formStatus, formAction] = useFormState(deleteProduct, null);
  const actionWithProductId = formAction.bind(null, {
    productId,
    isProductsPage,
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
