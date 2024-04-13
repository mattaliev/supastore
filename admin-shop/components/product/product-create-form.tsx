"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import ProductInputFields from "@/components/product/product-input-fields";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";
import { useFormState } from "react-dom";
import { createProduct } from "@/components/product/actions";

export default function ProductCreateForm() {
  const [formErrors, formAction] = useFormState(createProduct, null);

  return (
    <form action={formAction}>
      <div className="grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            type="button"
          >
            <Link href="/products">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Create Product
          </h1>
          <SubmitButton className={"hidden md:ml-auto md:flex"} />
        </div>
        <ProductInputFields fieldErrors={formErrors?.fieldErrors} />
        {formErrors?.formError && (
          <p className={"text-destructive text-start m-2 text-xs"}>
            {formErrors.formError}
          </p>
        )}
        <SubmitButton className={"flex"} />
      </div>
    </form>
  );
}

function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className={twMerge("items-center gap-2", className)}>
        <Button
          className={"cursor-not-allowed flex items-center gap-1"}
          disabled
        >
          <LoaderCircle className="animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <div className={twMerge("items-center gap-2", className)}>
      <Button size="sm" type={"submit"}>
        Create Product
      </Button>
    </div>
  );
}
