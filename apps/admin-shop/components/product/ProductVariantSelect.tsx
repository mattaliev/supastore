import { Category, ProductVariant } from "@ditch/lib";
import { AlignJustify, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NoImage } from "@/components/ui/NoImage";
import { cn } from "@/lib/utils";

type ProductVariantSelectProps = {
  productCategory?: Partial<Category>;
  variants: Partial<ProductVariant>[];
  selectedVariant: number;
  setSelectedVariant: (variantIndex: number) => void;
  addVariant: () => void;
  deleteVariant: (variantIndex: number) => void;
};

type ProductVariantOptionProps = {
  variantIndex: number;
  selectedVariant: number;
  setSelectedVariant: (variantIndex: number) => void;
  variant: Partial<ProductVariant>;
  productCategory?: Partial<Category>;
  canDelete?: boolean;
  deleteVariant: (variantIndex: number) => void;
};

export default function ProductVariantSelect(props: ProductVariantSelectProps) {
  const { variants, addVariant, ...rest } = props;
  const t = useTranslations("ProductForm.VariantSelector");

  return (
    <div className={"sticky top-2 z-10"}>
      <div className={"hidden lg:grid grid-cols-1 gap-4 auto-rows-max px-4"}>
        {variants.map((variant, index) => (
          <ProductVariantOption
            key={index}
            variant={variant}
            variantIndex={index}
            canDelete={variants.length > 1}
            {...rest}
          />
        ))}
        <Button
          onClick={addVariant}
          type={"button"}
          size={"sm"}
          className={"w-full mx-auto text-xs"}
        >
          {t("addVariant")}
        </Button>
      </div>
      <div className={"grid lg:hidden"}>
        <ProductVariantSelectDrawer {...props} />
      </div>
    </div>
  );
}

function ProductVariantSelectDrawer(props: ProductVariantSelectProps) {
  const { setSelectedVariant, variants, addVariant, ...rest } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const onVariantSelect = (variantIndex: number) => {
    setSelectedVariant(variantIndex);
    setDrawerOpen(false);
  };

  const t = useTranslations("ProductForm.VariantSelector");

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          size={"sm"}
          className={"w-full flex items-center justify-between"}
        >
          {t("allVariants")}
          <AlignJustify className={"h-4 w-4"} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("allVariants")}</DrawerTitle>
        </DrawerHeader>
        <div className={"grid gap-4 px-4"}>
          {variants.map((variant, index) => (
            <ProductVariantOption
              key={index}
              variant={variant}
              variantIndex={index}
              {...rest}
              setSelectedVariant={onVariantSelect}
              canDelete={variants.length > 1}
            />
          ))}
        </div>
        <DrawerFooter>
          <Button
            onClick={addVariant}
            type={"button"}
            size={"sm"}
            className={"w-full mx-auto text-xs"}
          >
            {t("addVariant")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProductVariantOption({
  variantIndex,
  selectedVariant,
  setSelectedVariant,
  variant,
  productCategory,
  deleteVariant,
  canDelete,
}: ProductVariantOptionProps) {
  const locale = useLocale();
  const t = useTranslations("ProductForm.VariantSelector");

  return (
    <div
      onClick={() => setSelectedVariant(variantIndex)}
      className={cn(
        "w-full min-h-36 bg-card mx-auto rounded-md flex items-start justify-start p-4 cursor-pointer text-sm gap-4 border",
        {
          "border-primary": selectedVariant === variantIndex,
        },
      )}
    >
      <div className={"w-28 h-full"}>
        {variant?.images && variant?.images.length > 0 ? (
          <Image
            src={variant.images[0]}
            alt={"Variant " + variantIndex + " image"}
            width={200}
            height={200}
          />
        ) : (
          <NoImage iconSize={"xs"} />
        )}
      </div>

      <div className={"flex flex-col gap-2 w-full"}>
        <h1 className={"text-sm font-semibold line-clamp-1"}>
          {variant?.name || t("untitled")}
        </h1>
        <p className={"text-muted-foreground line-clamp-1 text-sm"}>
          {locale === "ru" ? productCategory?.nameRu : productCategory?.nameEn}
        </p>
        <p className={"text-muted-foreground text-sm"}>
          {t("sku")}: {variant.sku}
        </p>
        {canDelete && (
          <Button
            size={"icon"}
            variant={"destructive-outline"}
            className={"ml-auto"}
            onClick={() => deleteVariant(variantIndex)}
          >
            <TrashIcon className={"h-4 w-4"} />
            <span className={"sr-only"}>{t("deleteVariant")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
