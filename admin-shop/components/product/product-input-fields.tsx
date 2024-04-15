import ProductDetails from "@/components/product/product-details";
import ProductVariants from "@/components/product/product-variants";
import ProductStatus from "@/components/product/product-status";
import ProductImages from "@/components/product/product-images";
import { ProductFieldErrors } from "@/components/product/schemes";
import { Product } from "@/lib/api/types";

export default function ProductInputFields({
  product,
  fieldErrors,
}: {
  product?: Product;
  fieldErrors?: ProductFieldErrors;
}) {
  const { variants, images, state, ...productDetails } = product || {};

  const {
    variants: variantsFieldError,
    imageUrls: imagesFieldError,
    state: stateFieldError,
    ...productDetailsFieldErrors
  } = fieldErrors || {};

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <ProductDetails
          product={product}
          productDetailsFieldErrors={productDetailsFieldErrors}
        />
        <ProductVariants
          variants={variants || []}
          variantsFieldError={variantsFieldError}
        />
      </div>
      <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
        <ProductStatus productState={state} stateFieldError={stateFieldError} />
        <ProductImages
          images={images || []}
          imagesFieldError={imagesFieldError}
        />
      </div>
    </div>
  );
}
