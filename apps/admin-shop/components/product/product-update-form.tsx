"use client";
import { Product } from "@ditch/lib";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { updateProduct } from "@/components/product/actions";
import ProductDeleteDialog from "@/components/product/product-delete-dialog";
import ProductInputFields from "@/components/product/product-input-fields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function ProductUpdateForm({ product }: { product: Product }) {
  const { back } = useRouter();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [formErrors, formAction] = useFormState(updateProduct, null);

  return (
    <Dialog>
      <form action={formAction}>
        <div className="grid flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              type="button"
              onClick={() => back()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {product.title}
            </h1>
            <div className={"hidden md:ml-auto md:flex items-center gap-2"}>
              <Link href={"/products"}>
                <Button size={"sm"} type={"button"} variant="outline">
                  Discard
                </Button>
              </Link>
              <UpdateProductButton className={""} />

              <DialogTrigger asChild>
                <Button variant="destructive" size={"sm"} type={"button"}>
                  Delete
                </Button>
              </DialogTrigger>
            </div>
          </div>
          <input type="hidden" name="id" value={product.id} />
          <ProductInputFields
            fieldErrors={formErrors?.fieldErrors}
            product={product}
          />
          {formErrors?.formError && (
            <p className={"text-destructive text-start m-2 text-xs"}>
              {formErrors.formError}
            </p>
          )}
          <div className={"items-center gap-2 flex"}>
            <Link href={"/products"}>
              <Button size={"sm"} type={"button"} variant="outline">
                Discard
              </Button>
            </Link>
            <UpdateProductButton className={"flex"} />
            <DialogTrigger asChild>
              <Button size={"sm"} type={"button"} variant={"destructive"}>
                Delete
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </form>
      <ProductDeleteDialog
        title={product.title}
        productId={product.id}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        isProductsPage={false}
      />
    </Dialog>
  );
}

function UpdateProductButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className={twMerge("items-center gap-2", className)}>
        <Button
          className={"cursor-not-allowed flex items-center gap-1"}
          disabled
        >
          <LoaderCircle className="animate-spin" />
          Editing...
        </Button>
      </div>
    );
  }

  return (
    <div className={twMerge("items-center gap-2", className)}>
      <Button size="sm" type={"submit"}>
        Edit Product
      </Button>
    </div>
  );
}
