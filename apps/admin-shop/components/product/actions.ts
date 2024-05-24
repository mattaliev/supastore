"use server";

import { productCreate, productDelete, productUpdate, TAGS } from "@ditch/lib";
import { revalidatePath, revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect, RedirectType } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import {
  ProductFieldErrors,
  ProductScheme
} from "@/components/product/schemes";

export type ProductFormErrorResponse = {
  storeId: string;
  fieldErrors?: ProductFieldErrors;
  formError?: string;
};

export const createProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse> => {
  const storeId = prevState.storeId;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect(
      `/auth/signIn?callbackUrl=${encodeURIComponent(`/store/${storeId}/products`)}`,
      RedirectType.push
    );
  }

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
    return { storeId, fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  try {
    await authenticated(session.user.accessToken, productCreate, {
      input: {
        storeId,
        ...validatedData.data
      }
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { storeId, formError: "Could not create product" };
  }

  revalidateTag(TAGS.PRODUCT);
  redirect(`/store/${storeId}/products`, RedirectType.push);
};

export const updateProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse> => {
  const storeId = prevState.storeId;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect(
      `/auth/signIn?callbackUrl=${encodeURIComponent(`/store/${storeId}/products`)}`,
      RedirectType.push
    );
  }

  const rawFormData = Object.fromEntries(formData.entries());

  const productId = rawFormData["id"];

  if (!productId || typeof productId !== "string") {
    return { storeId, formError: "Product not found. Try reloading the page" };
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
    return { storeId, fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  try {
    await authenticated(session.user.accessToken, productUpdate, {
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

    return { storeId, formError: "Could not edit product" };
  }

  revalidateTag(TAGS.PRODUCT);
  redirect(`/store/${storeId}/products`, RedirectType.push);
};

export const deleteProduct = async (
  prevState: any,
  payload: {
    storeId: string;
    productId: string;
    isProductsPage: boolean;
  }
): Promise<{
  success?: boolean;
  formError?: string;
}> => {
  const { productId, isProductsPage, storeId } = payload;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect(
      `/auth/signIn?callbackUrl=${encodeURIComponent(`/store/${storeId}/products`)}`,
      RedirectType.push
    );
  }

  try {
    await authenticated(session.user.accessToken, productDelete, {
      storeId,
      id: productId
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { formError: "Could not delete product" };
  }

  revalidatePath(`/store/${storeId}/products`);

  if (isProductsPage) {
    return { success: true };
  }

  redirect(`/store/${storeId}/products`);
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
