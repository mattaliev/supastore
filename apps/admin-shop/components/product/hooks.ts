"use client";
import {
  categoriesGet,
  Category,
  categoryCharacteristicsGet,
  Product,
  ProductVariant,
  ProductVariantSize
} from "@ditch/lib";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { createProduct, updateProduct } from "@/components/product/actions";

export type ProductVariantStateUpdate = {
  field: string;
  value: string | string[];
  variantIndex: number;
};

const emptyVariant = {
  name: "",
  sku: "",
  images: []
};

export function useProductForm({ product }: { product?: Product }) {
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>(
    product?.variants || [emptyVariant]
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const [productCategory, setProductCategory] = useState<
    Partial<Category> | undefined
  >(product?.category);

  const [formState, formAction] = useFormState(
    product ? updateProduct : createProduct,
    null
  );

  const updateVariantField = ({
    field,
    value,
    variantIndex
  }: ProductVariantStateUpdate) => {
    const newVariants = [...variants];
    newVariants[variantIndex] = {
      ...newVariants[variantIndex],
      [field]: value
    };
    setVariants((prevState) => newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, emptyVariant]);
  };

  const deleteVariant = (variantIndex: number) => {
    setVariants(variants.filter((_, i) => i !== variantIndex));
  };

  return {
    formState,
    formAction,
    variants,
    setVariants,
    selectedVariantIndex,
    setSelectedVariantIndex,
    productCategory,
    setProductCategory,
    updateVariantField,
    addVariant,
    deleteVariant
  };
}

export function useCategoriesSelect({
  parent,
  locale
}: {
  parent?: string;
  locale?: string;
}) {
  const [parentId, setParentId] = useState<string | undefined>(parent);
  const [search, setSearch] = useState<string | undefined>();
  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoriesGet({ locale, parentId, search })
  });

  const handleCategorySearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch((prevState) => e.target.value);
  };

  useEffect(() => {
    if (parentId || search) {
      refetch();
    }
  }, [parentId, search]);

  return {
    categories,
    parentId,
    setParentId,
    categoriesLoading,
    handleCategorySearchChange
  };
}

export function useCategoryCharacteristics({
  category
}: {
  category?: Partial<Category>;
}) {
  const {
    data: characteristics,
    isLoading: characteristicsLoading,
    refetch
  } = useQuery({
    queryKey: ["categoryCharacteristics", category?.id],
    queryFn: async () =>
      await categoryCharacteristicsGet({ categoryId: category?.id }),
    enabled: !!category
  });
  const filterCharacteristicsBy = ["Size", "Ros. size", "SKU"];

  const filteredCharacteristics = characteristics?.filter(
    (characteristic) => !filterCharacteristicsBy.includes(characteristic.nameEn)
  );

  const hasSize = characteristics?.some(
    (characteristic) => characteristic.nameEn === "Size"
  );

  useEffect(() => {
    if (category) {
      refetch();
    }
  }, [category]);

  return {
    characteristics,
    filteredCharacteristics,
    characteristicsLoading,
    hasSize
  };
}

const emptySize = {
  sizeEn: "",
  sizeRu: "",
  price: ""
};

export function useProductVariantSizes({
  variant
}: {
  variant?: Partial<ProductVariant>;
}) {
  const [sizes, setSizes] = useState<Partial<ProductVariantSize>[]>(
    (variant?.sizes && variant?.sizes?.length > 0 && variant?.sizes) || [
      emptySize
    ]
  );

  const addSize = () => setSizes([...sizes, emptySize]);
  const deleteSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };
  const onValueChange = (index: number, field: string, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: value
    };
    setSizes(newSizes);
  };
  return { sizes, addSize, deleteSize, onValueChange };
}
