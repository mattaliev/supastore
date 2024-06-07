import { ProductVariant } from "@ditch/lib";

export default function ProductVariants({
  variants,
  selectedVariant,
  setSelectedVariant,
}: {
  variants: ProductVariant[] | null | undefined;
  selectedVariant: string | undefined;
  setSelectedVariant: (id: string) => void;
}) {
  const uniqueSizes = variants?.reduce((acc, variant) => {
    if (!acc.find((v) => v.size === variant.size)) {
      acc.push(variant);
    }
    return acc;
  }, [] as ProductVariant[]);

  return (
    <div className="flex justify-start gap-x-3">
      {variants && variants.length > 0 && (
        <p className="text-telegram-text-color">Size: </p>
      )}
      {uniqueSizes &&
        uniqueSizes.map((variant) => (
          <p
            key={variant.size}
            className={
              variant.id === selectedVariant
                ? "text-telegram-accent-text-color"
                : "text-telegram-text-color"
            }
            onClick={() => setSelectedVariant(variant.id)}
          >
            {variant.size}
          </p>
        ))}
    </div>
  );
}
