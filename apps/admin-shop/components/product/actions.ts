"use server";

import { productCreate, productDelete, productUpdate, TAGS } from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { RedirectType } from "next/navigation";
import { getLocale } from "next-intl/server";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import storeRedirect from "@/components/navigation/redirect";
import revalidateStorePath from "@/components/navigation/revalidatePath";
import {
  ProductFieldErrors,
  ProductScheme
} from "@/components/product/schemes";
import { getStoreId } from "@/components/store/helpers";

export type ProductFormErrorResponse = {
  fieldErrors?: ProductFieldErrors;
  formError?: string;
};

export const createProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse | undefined> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const rawFormData = Object.fromEntries(formData.entries());

  const validatedData = ProductScheme.safeParse({
    title: rawFormData["title"],
    shortDescription: rawFormData["short-description"],
    description: rawFormData["description"],
    price: rawFormData["price"],
    sku: rawFormData["sku"],
    variants: productVariantsGetFromFormData(rawFormData),
    imageUrls: productImagesGetFromFormData(rawFormData),
    state: rawFormData["state"]
  });

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  try {
    await authenticated(accessToken, productCreate, {
      input: {
        storeId,
        ...validatedData.data
      }
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { formError: "Could not create product" };
  }

  revalidateTag(TAGS.PRODUCT);
  storeRedirect(`/products`, RedirectType.push);
};

export const updateProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse | undefined> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const rawFormData = Object.fromEntries(formData.entries());

  const productId = rawFormData["id"];

  if (!productId || typeof productId !== "string") {
    return { formError: "Product not found. Try reloading the page" };
  }

  const validatedData = ProductScheme.safeParse({
    title: rawFormData["title"],
    shortDescription: rawFormData["short-description"],
    description: rawFormData["description"],
    price: rawFormData["price"],
    sku: rawFormData["sku"],
    variants: productVariantsGetFromFormData(rawFormData),
    imageUrls: productImagesGetFromFormData(rawFormData),
    state: rawFormData["state"]
  });

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  try {
    await authenticated(accessToken, productUpdate, {
      input: {
        storeId,
        ...validatedData.data,
        productId
      }
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { formError: "Could not edit product" };
  }

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
    await authenticated(accessToken, productDelete, {
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

const productVariantsGetFromFormData = (rawFormData: any) => {
  const variants = [];

  const variantKeys = Object.keys(rawFormData).filter((key) =>
    key.startsWith("variant")
  );

  for (let i = 0; i < variantKeys.length / 3; i += 1) {
    if (
      rawFormData[`variant-color-${i}`] !== "" ||
      rawFormData[`variant-size-${i}`] !== "" ||
      rawFormData[`variant-material-${i}`] !== ""
    ) {
      const variant = {
        color: rawFormData[`variant-color-${i}`],
        size: rawFormData[`variant-size-${i}`],
        material: rawFormData[`variant-material-${i}`],
        quantity: parseInt(rawFormData[`variant-quantity-${i}`])
      };

      variants.push(variant);
    }
  }

  return variants;
};

const productImagesGetFromFormData = (rawFormData: any) => {
  const images = [];

  const imageKeys = Object.keys(rawFormData).filter((key) =>
    key.startsWith("image")
  );

  for (let i = 0; i < imageKeys.length; i++) {
    images.push(rawFormData[`image-${i}`]);
  }

  return images;
};
