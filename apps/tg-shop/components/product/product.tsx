"use client";
import { useState } from "react";

import AddToCartButton from "@/components/cart/add-to-cart-button";
import ProductImages from "@/components/product/product-images";
import ProductVariants from "@/components/product/product-variants";
import { Product } from "@ditch/lib";

export default function CatalogProduct({ product }: { product: Product }) {
  /**
   *  Need to check if the product has more than one variant
   *  If it does, we need to make sure the user selects a variant before adding to cart
   *  Else if it doesn't, we can just add the product to the cart
   */
  const doesProductHaveVariants = !!(
    product.variants && product.variants.length > 1
  );

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants && product.variants.length > 0
      ? product.variants[0]?.id
      : undefined,
  );

  return (
    <div className="shadow-lg group transform transition-transform duration-300 rounded-xl bg-telegram-secondary-bg-color">
      <ProductImages images={product.images || []} />
      <div className="p-4 bg-telegram-secondary-bg-color rounded-b-lg">
        <h3 className="font-semibold text-telegram-text-color text-lg">
          {product.title}
        </h3>
        <p className="text-telegram-hint-color">${product.price}</p>
        <ProductVariants
          variants={product.variants}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
        />
        <AddToCartButton
          productId={product.id}
          doesProductHaveVariants={doesProductHaveVariants}
          selectedVariantId={selectedVariant}
        />
      </div>
    </div>
  );
}
