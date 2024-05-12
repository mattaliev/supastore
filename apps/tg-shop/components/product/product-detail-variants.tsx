"use client";
import { ProductVariant } from "@ditch/lib";
import { clsx } from "clsx";

import { Label } from "@/components/ui/label";

export default function ProductDetailVariants({
  variants,
  selectedVariant,
  setSelectedVariant
}: {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant | null;
  setSelectedVariant: (variant: ProductVariant) => void;
}) {
  const sizes = [...new Set(variants.map((variant) => variant.size))].filter(
    (size): size is string => !!size
  );
  const colors = [...new Set(variants.map((variant) => variant.color))].filter(
    (color): color is string => !!color
  );
  const materials = [
    ...new Set(variants.map((variant) => variant.material))
  ].filter((material): material is string => !!material);

  const buttonClasses =
    "border cursor-pointer rounded-md p-2 flex items-center gap-2";
  const disabledButtonClasses =
    "bg-telegram-bg-color/50 cursor-not-allowed border-telegram-hint-color text-telegram-hint-color";
  const selectedButtonClasses =
    "border border-telegram-button-color bg-telegram-button-color text-telegram-button-text-color";

  const handleSizeChange = (size: string) => {
    if (isButtonDisabled({ size })) return;

    const newVariant = variants.filter(
      (variant) =>
        variant.material === selectedVariant?.material &&
        variant.color === selectedVariant?.color &&
        variant.size === size
    )[0];
    setSelectedVariant(newVariant);
  };

  const handleColorChange = (color: string) => {
    if (isButtonDisabled({ color })) return;

    const newVariant = variants.filter(
      (variant) =>
        variant.material === selectedVariant?.material &&
        variant.size === selectedVariant?.size &&
        variant.color === color
    )[0];
    setSelectedVariant(newVariant);
  };

  const handleMaterialChange = (material: string) => {
    if (isButtonDisabled({ material })) return;

    const newVariant = variants.filter(
      (variant) =>
        variant.color === selectedVariant?.color &&
        variant.size === selectedVariant?.size &&
        variant.material === material
    )[0];
    setSelectedVariant(newVariant);
  };

  const isButtonDisabled = ({
    size,
    color,
    material
  }: {
    size?: string;
    color?: string;
    material?: string;
  }) => {
    if (size) {
      const allowedVariants = variants
        .filter(
          (variant) =>
            variant.color === selectedVariant?.color &&
            variant.material === selectedVariant?.material
        )
        .map((variant) => variant.size);
      return !allowedVariants.includes(size);
    }

    if (color) {
      const allowedVariants = variants
        .filter(
          (variant) =>
            variant.size === selectedVariant?.size &&
            variant.material === selectedVariant?.material
        )
        .map((variant) => variant.color);
      return !allowedVariants.includes(color);
    }

    if (material) {
      const allowedVariants = variants
        .filter(
          (variant) =>
            variant.size === selectedVariant?.size &&
            variant.color === selectedVariant?.color
        )
        .map((variant) => variant.material);
      return !allowedVariants.includes(material);
    }
  };

  return (
    <>
      <div className="grid gap-2">
        {sizes && sizes.length > 0 && (
          <>
            <Label className="text-base">Size</Label>
            <div className="flex items-center gap-2">
              {sizes.map((size) => (
                <div key={size}>
                  <Label
                    className={clsx(
                      buttonClasses,
                      selectedVariant?.size === size && selectedButtonClasses,
                      isButtonDisabled({ size }) && disabledButtonClasses
                    )}
                    htmlFor={`size-${size}`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="grid gap-2">
        {colors && colors.length > 0 && (
          <>
            <Label className="text-base">Color</Label>
            <div className="flex items-center gap-2">
              {colors.map((color) => (
                <div key={color}>
                  <Label
                    className={clsx(
                      buttonClasses,
                      selectedVariant?.color === color && selectedButtonClasses,
                      isButtonDisabled({ color }) && disabledButtonClasses
                    )}
                    htmlFor={`color-${color}`}
                    onClick={() => handleColorChange(color)}
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="grid gap-2">
        {materials && materials.length > 0 && (
          <>
            <Label className="text-base">Color</Label>
            <div className="flex items-center gap-2">
              {materials.map((material) => (
                <div key={material}>
                  <Label
                    className={clsx(
                      buttonClasses,
                      selectedVariant?.material === material &&
                        selectedButtonClasses,
                      isButtonDisabled({ material }) && disabledButtonClasses
                    )}
                    htmlFor={`material-${material}`}
                    onClick={() => handleMaterialChange(material)}
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
