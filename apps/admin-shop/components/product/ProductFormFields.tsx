"use client";
import { Product } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

import Link from "@/components/navigation/link";
import { useProductForm } from "@/components/product/hooks";
import ProductVariantFields from "@/components/product/ProductVariantFormFields";
import ProductVariantSelect from "@/components/product/ProductVariantSelect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SubmitButton({
  action,
  className
}: {
  action: "CREATE" | "UPDATE";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const t = useTranslations("ProductForm");

  if (pending) {
    return (
      <Button
        className={cn(
          "cursor-not-allowed flex items-center gap-1 w-full",
          className
        )}
        disabled
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        {action === "CREATE" ? t("creating") : t("saving")}
      </Button>
    );
  }

  return (
    <Button type={"submit"} className={cn("w-full", className)}>
      {action === "CREATE" ? t("create") : t("save")}
    </Button>
  );
}

function ProductFormFields({ product }: { product?: Product }) {
  const {
    formState,
    formAction,
    variants,
    selectedVariantIndex,
    setSelectedVariantIndex,
    productCategory,
    setProductCategory,
    updateVariantField,
    addVariant,
    deleteVariant
  } = useProductForm({ product });
  const t = useTranslations("ProductForm");

  return (
    <div className={"grid lg:grid-cols-[300px_1fr] gap-2"}>
      <ProductVariantSelect
        variants={variants}
        productCategory={productCategory}
        selectedVariant={selectedVariantIndex}
        setSelectedVariant={setSelectedVariantIndex}
        addVariant={addVariant}
        deleteVariant={deleteVariant}
      />
      <form action={formAction} className={"grid gap-0"}>
        <input type={"hidden"} value={variants.length} name={"variantCount"} />
        <input
          type={"hidden"}
          value={productCategory?.id || ""}
          name={"category"}
        />
        <input type={"hidden"} value={product?.id || ""} name={"productId"} />
        {variants.map((variant, index) => (
          <ProductVariantFields
            fieldErrors={formState?.fieldErrors?.[index]}
            categoryError={formState?.fieldErrors?.category}
            key={index}
            variant={variant}
            updateVariantField={updateVariantField}
            variantIndex={index}
            isSelected={index === selectedVariantIndex}
            productCategory={productCategory}
            setProductCategory={setProductCategory}
          />
        ))}
        <div
          className={
            "p-4 bg-primary-foreground sticky lg:static bottom-0 rounded-md grid gap-2"
          }
        >
          {formState?.formError && (
            <p className={"text-sm text-destructive"}>{formState.formError}</p>
          )}
          <div
            className={"grid gap-2 lg:flex lg:items-center lg:justify-start"}
          >
            <SubmitButton
              action={product ? "UPDATE" : "CREATE"}
              className={"w-full lg:w-fit"}
            />
            <Link href={"/products"}>
              <Button
                type={"button"}
                variant={"primary-outline"}
                className={"w-full lg:w-fit"}
              >
                {t("back-to-products")}
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductFormFields;
