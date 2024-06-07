"use client";
import { Product } from "@ditch/lib";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";

import AddToCartButton from "@/components/cart/add-to-cart-button";
import ProductDetailImages from "@/components/product/product-detail-images";
import ProductDetailVariants from "@/components/product/product-detail-variants";

export default function ProductDetail({
  product,
  storeId
}: {
  product: Product;
  storeId: string;
}) {
  const [variant, setVariant] = useState(
    product.variants && product.variants[0]
  );
  const [serializedDescription, setSerializedDescription] =
    useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const getAndSerializeSource = async () => {
      return await serialize(product.description || "", {
        mdxOptions: {
          development: process.env.NODE_ENV === "development"
        }
      });
    };

    getAndSerializeSource().then((data) => setSerializedDescription(data));
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-6">
        <ProductDetailImages productImages={product.images || []} />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold text-telegram-text-color">
              {product.title}
            </h1>
            <p className="text-telegram-hint-color">
              {product.shortDescription || ""}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-telegram-text-color">
                ${product.price}
              </span>
              <div className="flex items-center w-1/2 justify-stretch">
                <AddToCartButton
                  productId={product.id}
                  doesProductHaveVariants={
                    (product.variants && product.variants.length > 0) as boolean
                  }
                  selectedVariantId={variant?.id}
                />
              </div>
            </div>
          </div>
          <ProductDetailVariants
            variants={product.variants || []}
            selectedVariant={variant}
            setSelectedVariant={setVariant}
          />
          {serializedDescription && (
            <MDXRemote
              {...serializedDescription}
              components={{
                p: (props) => (
                  <p className="text-telegram-text-color text-sm" {...props} />
                )
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
