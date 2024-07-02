"use client";
import { Category, ProductVariant } from "@ditch/lib";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent } from "react";

import CategoryCharacteristics from "@/components/product/CategoryCharacteristics";
import { ProductVariantStateUpdate } from "@/components/product/hooks";
import ProductCategorySelect from "@/components/product/ProductCategorySelect";
import ProductImages from "@/components/product/ProductImages";
import { ProductVariantFieldErrors } from "@/components/product/productValidator";
import { Card } from "@/components/ui/card";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { cn } from "@/lib/utils";

export default function ProductVariantFields({
  variant,
  fieldErrors,
  categoryError,
  updateVariantField,
  variantIndex,
  isSelected,
  productCategory,
  setProductCategory
}: {
  variant?: Partial<ProductVariant>;
  fieldErrors?: ProductVariantFieldErrors;
  categoryError?: string;
  updateVariantField: (args: ProductVariantStateUpdate) => void;
  variantIndex: number;
  isSelected: boolean;
  productCategory?: Partial<Category>;
  setProductCategory: (category: Partial<Category>) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("ProductForm");

  return (
    <Card
      key={variantIndex}
      className={cn(
        "grid grid-cols-1 xl:grid-cols-[40%_1fr] gap-4 max-w-[59rem] p-6",
        {
          hidden: !isSelected
        }
      )}
    >
      <input
        type={"hidden"}
        value={variant?.id}
        name={variantIndex + "variantId"}
      />
      <ProductImages
        variant={variant}
        variantIndex={variantIndex}
        updateVariantField={updateVariantField}
      />
      <div className={"grid gap-4"}>
        <h1 className={"text-base font-semibold"}>{t("Fields.title")}</h1>
        <FormInput
          labelEn={"Name"}
          labelRu={"Наименование"}
          error={
            fieldErrors?.name && fieldErrors?.name.length > 0
              ? fieldErrors?.name[0].message
              : undefined
          }
          name={"name"}
          locale={locale}
          variantIndex={variantIndex}
          defaultValue={variant?.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateVariantField({
              field: "name",
              value: e.target.value,
              variantIndex
            })
          }
        />
        <ProductCategorySelect
          error={categoryError}
          category={productCategory}
          setCategory={setProductCategory}
        />
        <FormInput
          labelEn={"SKU"}
          labelRu={"Артикул"}
          name={"sku"}
          locale={locale}
          variantIndex={variantIndex}
          error={
            fieldErrors?.sku && fieldErrors?.sku.length > 0
              ? fieldErrors?.sku[0].message
              : undefined
          }
          defaultValue={variant?.sku}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateVariantField({
              field: "sku",
              value: e.target.value,
              variantIndex
            })
          }
        />
        <FormInput
          labelEn={"Brand"}
          labelRu={"Бренд"}
          name={"brand"}
          locale={locale}
          error={
            fieldErrors?.brand && fieldErrors?.brand.length > 0
              ? fieldErrors?.brand[0].message
              : undefined
          }
          variantIndex={variantIndex}
          defaultValue={variant?.brand}
        />
        <FormTextarea
          className={"h-24"}
          labelEn={"Short Description"}
          labelRu={"Краткое Описание"}
          name={"shortDescription"}
          error={
            fieldErrors?.shortDescription &&
            fieldErrors?.shortDescription.length > 0
              ? fieldErrors?.shortDescription[0].message
              : undefined
          }
          maxCount={500}
          locale={locale}
          variantIndex={variantIndex}
          defaultValue={variant?.shortDescription}
        />
        <FormTextarea
          className={"h-36"}
          labelEn={"Description"}
          labelRu={"Описание"}
          name={"description"}
          error={
            fieldErrors?.description && fieldErrors?.description.length > 0
              ? fieldErrors?.description[0].message
              : undefined
          }
          maxCount={3000}
          locale={locale}
          variantIndex={variantIndex}
          defaultValue={variant?.description}
        />
        <CategoryCharacteristics
          fieldErrors={fieldErrors}
          category={productCategory}
          variant={variant}
          variantIndex={variantIndex}
        />
      </div>
    </Card>
  );
}
