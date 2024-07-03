"use client";
import {
  categoriesGet,
  Category,
  categoryCharacteristicsGet,
  EntityState,
  Paginated,
  Product,
  productsPaginatedGet,
  ProductVariant,
  ProductVariantSize,
  productVariantsOrderSet
} from "@ditch/lib";
import { MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { createProduct, updateProduct } from "@/components/product/actions";
import { useStore } from "@/components/store/store-context";

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

export function useProductInfiniteScroll({
  paginatedProducts,
  page,
  state,
  limit
}: {
  paginatedProducts: Paginated<ProductVariant>;
  state: EntityState;
  page: number | undefined;
  limit: number | undefined;
}) {
  const [products, setProducts] = useState(paginatedProducts.objects);
  const observer = useRef<IntersectionObserver>();
  const storeId = useStore();

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["products"],
      queryFn: async ({ pageParam }) =>
        await productsPaginatedGet({
          storeId,
          page: pageParam,
          limit,
          state
        }),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.hasNext ? lastPage.page + 1 : undefined,
      initialData: {
        pages: [paginatedProducts],
        pageParams: [page]
      },
      initialPageParam: page
    });

  useEffect(() => {
    setProducts(
      data?.pages.reduce((acc, page) => {
        return [...acc, ...page.objects];
      }, [] as ProductVariant[])
    );
  }, [data]);

  const lastElementRef = useCallback(
    (node: HTMLTableCellElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  return {
    products,
    setProducts,
    lastElementRef,
    isFetching,
    isLoading
  };
}

export function useProductListDragAndDrop({
  products,
  setProducts
}: {
  products: ProductVariant[];
  setProducts: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
}) {
  const [productOrderChanged, setProductOrderChanged] = useState(false);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { data } = useSession();
  const storeId = useStore();

  const { mutate } = useMutation({
    mutationKey: ["productVariantsOrderSet"],
    mutationFn: async (productIds: string[]) =>
      productVariantsOrderSet(
        { productIds, storeId },
        { Authorization: `Bearer ${data?.user.accessToken}` }
      )
  });

  const handleDrag = (event: any) => {
    const { active, over } = event;

    if (active === null || over === null) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = products.findIndex(
        (product) => product.id === active.id
      );
      const newIndex = products.findIndex((product) => product.id === over.id);
      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);
      setProductOrderChanged(true);
    }
  };

  useEffect(() => {
    if (productOrderChanged) {
      mutate(products.map((product) => product.id));
      setProductOrderChanged(false);
    }
  }, [productOrderChanged]);

  return {
    sensors,
    handleDrag
  };
}
