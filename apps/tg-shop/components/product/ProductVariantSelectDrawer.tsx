import { ProductVariantSize } from "@ditch/lib";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import AddToCartButton from "@/components/cart/add-to-cart-button";
import ProductDetailSizes from "@/components/product/product-detail-sizes";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function VariantSelectDrawer({
  sizes,
  productId,
}: {
  sizes: ProductVariantSize[];
  productId: string;
}) {
  const [selectedSize, setSelectedSize] = useState<ProductVariantSize>(
    sizes[0],
  );

  const t = useTranslations("ProductCatalogPage");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={"sm"}
          className={"text-xs w-full text-telegram-text-color h-10"}
          variant="ghost"
          type={"button"}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={
          "p-4 bg-telegram-bg-color text-telegram-text-color border-none"
        }
      >
        <DrawerHeader>
          <DrawerTitle>{t("selectVariant")}</DrawerTitle>
        </DrawerHeader>
        <div className={"grid gap-2 mb-5"}>
          <ProductDetailSizes
            sizes={sizes}
            setSelectedSize={setSelectedSize}
            selectedSize={selectedSize}
          />
          <AddToCartButton
            productVariantId={productId}
            doesProductHaveVariants={sizes.length > 0}
            productVariantSizeId={selectedSize.id}
            size={"lg"}
            className={"w-full"}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
