"use client";
import { ProductVariant } from "@ditch/lib";

import AddToCartButton from "@/components/cart/add-to-cart-button";
import Link from "@/components/navigation/link";
import ProductImages from "@/components/product/product-images";
import VariantSelectDrawer from "@/components/product/ProductVariantSelectDrawer";

export default function CatalogProduct({
  product
}: {
  product: ProductVariant;
}) {
  /**
   *  Need to check if the product has more than one variant
   *  If it does, we need to make sure the user selects a variant before adding to cart
   *  Else if it doesn't, we can just add the product to the cart
   */
  const hasVariants = product.sizes.length > 1;

  return (
    <div className="shadow-lg group transform transition-transform duration-300 rounded-xl grid gap-2 focus:opacity-75">
      <Link href={`/product/${product.id}`} className={"grid gap-2"}>
        <ProductImages images={product.images || []} />
        <div className={"p-1"}>
          <h3 className="font-semibold text-telegram-text-color text-sm line-clamp-1">
            {product.name}
          </h3>
          <p className="text-telegram-hint-color text-sm">
            ${product.sizes[0].price}
          </p>
        </div>
      </Link>
      <div className={"hover:opacity-100 p-1"}>
        {hasVariants ? (
          <VariantSelectDrawer sizes={product.sizes} productId={product.id} />
        ) : (
          <AddToCartButton
            productVariantId={product.id}
            doesProductHaveVariants={hasVariants}
            productVariantSizeId={product.sizes[0].id}
            size={"sm"}
            className={"text-xs"}
          />
        )}
      </div>
    </div>
  );
}
