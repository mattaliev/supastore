"use client";
import { ProductVariantSize } from "@ditch/lib";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";

export default function ProductDetailSizes({
  sizes,
  selectedSize,
  setSelectedSize
}: {
  sizes: ProductVariantSize[];
  selectedSize: ProductVariantSize;
  setSelectedSize: (size: ProductVariantSize) => void;
}) {
  const t = useTranslations("ProductCatalogPage");

  const buttonClasses =
    "border cursor-pointer rounded-md p-2 flex items-center gap-2";
  const selectedButtonClasses =
    "border border-telegram-button-color bg-telegram-button-color text-telegram-button-text-color";

  if (sizes.length < 2) {
    return null;
  }

  return (
    <div className="grid gap-2">
      {sizes && sizes.length > 0 && (
        <>
          <Label className="text-lg">{t("sizeTitle")}</Label>
          <div className="flex items-center gap-2">
            {sizes.map((size) => (
              <div key={size.id}>
                <Label
                  className={clsx(
                    buttonClasses,
                    selectedSize.id === size.id ? selectedButtonClasses : ""
                  )}
                  htmlFor={`size-${size}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.sizeEn}
                </Label>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
