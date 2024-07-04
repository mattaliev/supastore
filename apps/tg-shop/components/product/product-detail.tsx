"use client";
import { ProductVariant } from "@ditch/lib";
import { useTranslations } from "next-intl";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";

import AddToCartButton from "@/components/cart/add-to-cart-button";
import ProductDetailImages from "@/components/product/product-detail-images";
import ProductDetailSizes from "@/components/product/product-detail-sizes";
import ProductCharacteristics from "@/components/product/ProductCharacteristics";
import ProductVariants from "@/components/product/ProductVariants";

export default function ProductDetail({
  product,
}: {
  product: ProductVariant;
}) {
  const t = useTranslations("ProductDetailPage");
  const [size, setSize] = useState(product.sizes[0]);
  const [serializedDescription, setSerializedDescription] =
    useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const getAndSerializeSource = async () => {
      return await serialize(product.description || "", {
        mdxOptions: {
          development: process.env.NODE_ENV === "development",
        },
      });
    };

    getAndSerializeSource().then((data) => setSerializedDescription(data));
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-6">
        <ProductDetailImages productImages={product.images || []} />
        <div className="grid gap-2">
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold text-telegram-text-color">
              {product.name}
            </h1>
            <p className="text-telegram-hint-color">
              {product.shortDescription || ""}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-telegram-text-color">
              ${size.price}
            </span>
          </div>
          <ProductVariants
            variants={product.product.variants}
            selectedVariantId={product.id}
          />
          <ProductDetailSizes
            sizes={product.sizes}
            selectedSize={size}
            setSelectedSize={setSize}
          />
          {/*<ProductCharacteristics*/}
          {/*  characteristics={product.productCharacteristics}*/}
          {/*/>*/}
          {serializedDescription && (
            <div className={"grid gap-2"}>
              {/*<h2 className="text-lg font-semibold text-telegram-text-color">*/}
              {/*  {t("description")}*/}
              {/*</h2>*/}
              <MDXRemote
                {...serializedDescription}
                components={{
                  p: (props) => (
                    <p
                      className="text-telegram-text-color text-sm"
                      {...props}
                    />
                  ),
                }}
              />
            </div>
          )}
          <ProductCharacteristics
            characteristics={product.productCharacteristics}
          />
          <div className={"sticky bottom-0 pt-2 pb-6 bg-telegram-bg-color"}>
            <AddToCartButton
              productVariantId={product.id}
              doesProductHaveVariants={product.sizes.length > 1}
              productVariantSizeId={size?.id}
              size={"lg"}
              className={"w-full"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
