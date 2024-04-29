"use server";

import { productCreate, productDelete, productUpdate, TAGS } from "@ditch/lib";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

import {
  ProductFieldErrors,
  ProductScheme,
} from "@/components/product/schemes";

export type ProductFormErrorResponse = {
  fieldErrors?: ProductFieldErrors;
  formError?: string;
};

export const createProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse> => {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedData = ProductScheme.safeParse({
    title: rawFormData["title"],
    description: rawFormData["description"],
    price: rawFormData["price"],
    sku: rawFormData["sku"],
    variants: productVariantsGetFromFormData(rawFormData),
    imageUrls: productImagesGetFromFormData(rawFormData),
    state: rawFormData["state"],
  });

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  try {
    await productCreate(validatedData.data);
  } catch (e) {
    return { formError: "Could not create product" };
  }

  revalidateTag(TAGS.PRODUCT);
  redirect("/products", RedirectType.push);
};

export const updateProduct = async (
  prevState: any,
  formData: FormData
): Promise<ProductFormErrorResponse> => {
  const rawFormData = Object.fromEntries(formData.entries());

  const productId = rawFormData["id"];

  if (!productId || typeof productId !== "string") {
    return { formError: "Product not found. Try reloading the page" };
  }

  const validatedData = ProductScheme.safeParse({
    title: rawFormData["title"],
    description: rawFormData["description"],
    price: rawFormData["price"],
    sku: rawFormData["sku"],
    variants: productVariantsGetFromFormData(rawFormData),
    imageUrls: productImagesGetFromFormData(rawFormData),
    state: rawFormData["state"],
  });

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  try {
    await productUpdate({
      ...validatedData.data,
      productId,
    });
  } catch (e) {
    return { formError: "Could not edit product" };
  }

  revalidateTag(TAGS.PRODUCT);
  redirect("/products", RedirectType.push);
};

export const deleteProduct = async (
  prevState: any,
  payload: {
    productId: string;
    isProductsPage: boolean;
  }
): Promise<{
  success?: boolean;
  formError?: string;
}> => {
  const { productId, isProductsPage } = payload;

  try {
    await productDelete(productId);
  } catch (e) {
    return { formError: "Could not delete product" };
  }

  revalidatePath("/products");

  if (isProductsPage) {
    return { success: true };
  }

  redirect("/products");
};

const productVariantsGetFromFormData = (rawFormData: any) => {
  const variants = [];

  const variantKeys = Object.keys(rawFormData).filter((key) =>
    key.startsWith("variant")
  );

  for (let i = 0; i < variantKeys.length; i += 4) {
    if (
      rawFormData[`variant-color-${i}`] !== "" &&
      rawFormData[`variant-size-${i}`] !== "" &&
      rawFormData[`variant-material-${i}`] !== ""
    ) {
      const variant = {
        color: rawFormData[`variant-color-${i}`],
        size: rawFormData[`variant-size-${i}`],
        material: rawFormData[`variant-material-${i}`],
        quantity: parseInt(rawFormData[`variant-quantity-${i}`]),
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
