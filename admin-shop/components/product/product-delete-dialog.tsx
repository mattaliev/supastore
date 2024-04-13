import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProduct } from "@/components/product/actions";
import { useEffect } from "react";

function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className={twMerge("items-center gap-2", className)}>
        <Button
          className={"cursor-not-allowed flex items-center gap-1"}
          disabled
          onClick={(e) => e.preventDefault()}
        >
          <LoaderCircle className="animate-spin" />
          Deleting...
        </Button>
      </div>
    );
  }

  return (
    <div className={twMerge("items-center gap-2", className)}>
      <Button size="sm" type={"submit"}>
        Delete
      </Button>
    </div>
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
      <DialogFooter>
        {formStatus?.formError && (
          <p className={"text-destructive text-start m-2 text-xs"}>
            {formStatus.formError}
          </p>
        )}
        <DialogClose asChild>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </DialogClose>
        <form action={actionWithProductId}>
          <SubmitButton />
        </form>
      </DialogFooter>
    </DialogContent>
  );
}
