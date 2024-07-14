"use server";

import {
  categoryCharacteristicsGet,
  Characteristic,
  productCreate,
  productUpdate,
  productVariantDelete,
  ProductVariantInput,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { RedirectType } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ZodIssue } from "zod";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import storeRedirect from "@/components/navigation/redirect";
import revalidateStorePath from "@/components/navigation/revalidatePath";
import {
  buildProductVariantScheme,
  productFromFormDataGet,
  ProductVariantFieldErrors
} from "@/components/product/productValidator";
import { getStoreId } from "@/components/store/helpers";

export type ProductFormErrorResponse = {
  fieldErrors?: {
    category?: string;
    [key: number]: ProductVariantFieldErrors;
  };
  formError?: string;
};

function mapFieldErrors(validatedData: any[]) {
  return {
    fieldErrors: validatedData.reduce(
      (acc, data, index) => {
        if (data.success) return acc;

        acc[index] = data.error.flatten((issue: ZodIssue) => ({
          code: issue.code,
          path: issue.path,
          message: issue.message
        })).fieldErrors;

        return acc;
      },
      {} as Record<number, object>
    )
  };
}

export const createProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse | undefined> => {
  const variantCount = formData.get("variantCount") as string;
  const categoryId = formData.get("category") as string;

  if (!categoryId)
    return { fieldErrors: { category: "Please select category" } };

  const characteristics = await categoryCharacteristicsGet({ categoryId });
  const filteredCharacteristics = filterCharacteristics(characteristics);
  const productVariantScheme = buildProductVariantScheme(
    filteredCharacteristics
  );

  const productVariants = Array.from(
    { length: parseInt(variantCount) },
    (_, index) => productFromFormDataGet(characteristics, formData, index)
  );

  const validatedData = productVariants.map((variant) =>
    productVariantScheme.safeParse(variant)
  );

  if (validatedData.some((data) => !data.success)) {
    return mapFieldErrors(validatedData);
  }

  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const variants = validatedData.map(
    (data) => data.data
  ) as ProductVariantInput[];

  const createdProduct = await authenticated(accessToken, productCreate, {
    input: {
      categoryId,
      storeId,
      variants
    }
  });

  if (!createdProduct) return { formError: "Could not create product" };

  revalidateTag(TAGS.PRODUCT);
  storeRedirect(`/products`, RedirectType.push);
};

export const updateProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse | undefined> => {
  const variantCount = formData.get("variantCount") as string;
  const categoryId = formData.get("category") as string;
  const productId = formData.get("productId") as string;

  if (!categoryId)
    return { fieldErrors: { category: "Please select category" } };

  const characteristics = await categoryCharacteristicsGet({ categoryId });
  const filteredCharacteristics = filterCharacteristics(characteristics);
  const productVariantScheme = buildProductVariantScheme(
    filteredCharacteristics
  );

  const productVariants = Array.from(
    { length: parseInt(variantCount) },
    (_, index) => productFromFormDataGet(characteristics, formData, index)
  );

  const validatedData = productVariants.map((variant) =>
    productVariantScheme.safeParse(variant)
  );

  if (validatedData.some((data) => !data.success)) {
    return mapFieldErrors(validatedData);
  }

  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const variants = validatedData.map(
    (data) => data.data
  ) as ProductVariantInput[];

  console.log(variants[0].sizes);

  const updatedProduct = await authenticated(accessToken, productUpdate, {
    input: {
      productId,
      categoryId,
      storeId,
      variants
    }
  });

  if (!updatedProduct) return { formError: "Could not update product" };

  revalidateTag(TAGS.PRODUCT);
  storeRedirect(`/products`, RedirectType.push);
};

export const deleteProduct = async (
  prevState: any,
  payload: {
    productId: string;
    isProductsPage: boolean;
  }
): Promise<
  | {
      success?: boolean;
      formError?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const locale = await getLocale();
  const storeId = getStoreId();
  const { productId, isProductsPage } = payload;

  try {
    await authenticated(accessToken, productVariantDelete, {
      storeId,
      id: productId
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { formError: "Could not delete product" };
  }

  await revalidateStorePath(`/products`);

  if (isProductsPage) {
    return { success: true };
  }

  storeRedirect(`/products`);
};

const filterCharacteristics = (characteristics: Characteristic[]) => {
  return characteristics.filter(
    (characteristic) =>
      !["Size", "Ros. size", "SKU"].includes(characteristic.nameEn)
  );
};
