import { ProductVariant } from "@ditch/lib";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import { useProductVariantSizes } from "@/components/product/hooks";
import { ProductVariantFieldErrors } from "@/components/product/productValidator";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ProductVariantSizes({
  variant,
  variantIndex,
  hasSizes,
  sizesFieldErrors
}: {
  variant?: Partial<ProductVariant>;
  sizesFieldErrors?: ProductVariantFieldErrors["sizes"];
  variantIndex: number;
  hasSizes?: boolean;
}) {
  const { sizes, addSize, deleteSize, onValueChange } = useProductVariantSizes({
    variant
  });
  const t = useTranslations("ProductForm.Fields.Sizes");

  if (hasSizes) {
    return (
      <div className={"grid gap-4"}>
        <h3 className={"text-base font-semibold"}>{t("sizeAndPrice")}</h3>
        <div
          className={cn("grid grid-cols-3 gap-2", {
            "grid-cols-4": sizes.length > 1
          })}
        >
          <div className={"grid gap-2"}>
            <Label>{t("size")}</Label>
            {sizesFieldErrors?.some((error) =>
              error.path.includes("sizeEn")
            ) && (
              <p className={"text-sm text-destructive"}>
                {
                  sizesFieldErrors?.find((error) =>
                    error.path.includes("sizeEn")
                  )?.message
                }
              </p>
            )}
          </div>
          <div className={"grid gap-2"}>
            <Label>{t("sizeRu")}</Label>
            {sizesFieldErrors?.some((error) =>
              error.path.includes("sizeRu")
            ) && (
              <p className={"text-sm text-destructive"}>
                {
                  sizesFieldErrors.find((error) =>
                    error.path.includes("sizeRu")
                  )?.message
                }
              </p>
            )}
          </div>
          <div className={"grid gap-2"}>
            <Label>{t("price")}</Label>
            {sizesFieldErrors?.some((error) =>
              error.path.includes("price")
            ) && (
              <p className={"text-sm text-destructive"}>
                {
                  sizesFieldErrors.find((error) => error.path.includes("price"))
                    ?.message
                }
              </p>
            )}
          </div>
          {sizes.length > 1 && <Label></Label>}
        </div>
        {sizes.map((size, index) => (
          <div
            className={cn("grid grid-cols-3 gap-2", {
              "grid-cols-4": sizes.length > 1
            })}
          >
            <input
              type={"hidden"}
              name={variantIndex + "sizeId"}
              value={size.id}
            />
            <Input
              name={variantIndex + "sizeEn"}
              onChange={(e) => onValueChange(index, "sizeEn", e.target.value)}
              value={size.sizeEn}
            />
            <Input
              name={variantIndex + "sizeRu"}
              onChange={(e) => onValueChange(index, "sizeRu", e.target.value)}
              value={size.sizeRu}
            />
            <Input
              name={variantIndex + "price"}
              onChange={(e) => onValueChange(index, "price", e.target.value)}
              value={size.price}
            />
            {sizes.length > 1 && (
              <Button
                variant={"destructive-outline"}
                size={"icon"}
                onClick={() => deleteSize(index)}
                type={"button"}
              >
                <Trash className={"h-4 w-4"} />
              </Button>
            )}
          </div>
        ))}
        {sizesFieldErrors?.some(
          (error) => error.path.includes("sizes") && error.path.length === 1
        ) && <p className={"text-destructive text-sm"}>{t("error")}</p>}
        <Button
          variant={"primary-outline"}
          className={"max-w-fit"}
          onClick={addSize}
          type={"button"}
        >
          {t("add")}
        </Button>
      </div>
    );
  }

  return (
    <div className={"grid gap-4"}>
      <h3 className={"text-base font-semibold"}>{t("Price")}</h3>
      {sizesFieldErrors?.some((error) => error.path.includes("price")) && (
        <p className={"text-sm text-destructive"}>
          {
            sizesFieldErrors.find((error) => error.path.includes("price"))
              ?.message
          }
        </p>
      )}
      <input
        type={"hidden"}
        name={variantIndex + "sizesId"}
        value={sizes[0].id}
      />
      <FormInput
        labelEn={"Price"}
        labelRu={"Цена"}
        name={"price"}
        variantIndex={variantIndex}
        defaultValue={sizes[0].price}
      />
    </div>
  );
}
