"use server";

import {
  Cart,
  cartAddItem,
  cartCreate,
  cartRemoveItem,
  cartUpdateItem,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { tmaAuthenticated } from "@/lib/auth";

export const addToCart = async (
  prevState: any,
  payload: {
    storeId: string;
    productId?: string;
    selectedVariantId?: string | null;
    doesProductHaveVariants?: boolean;
    quantity?: number;
  }
): Promise<string | void> => {
  let cartId = cookies().get("cartId")?.value;
  const initDataRaw = cookies().get("initDataRaw")?.value;

  if (!initDataRaw) {
    redirect("/unathenticated");
  }

  const {
    storeId,
    productId,
    selectedVariantId,
    doesProductHaveVariants,
    quantity
  } = payload;

  let cart: Cart | undefined;

  if (!productId) {
    return "No product found, please try to refresh the page";
  }

  if (doesProductHaveVariants && !selectedVariantId) {
    return "Please select size";
  }

  if (!cartId) {
    cart = await tmaAuthenticated(initDataRaw, storeId, cartCreate, {
      storeId
    });
    cartId = cart.id;
    cookies().set("cartId", cartId);
  }

  try {
    await tmaAuthenticated(initDataRaw, storeId, cartAddItem, {
      input: {
        cartId,
        productId,
        variantId: selectedVariantId || null,
        quantity: quantity || 1
      }
    });
    revalidateTag(TAGS.CART);
  } catch (e) {
    return "Could not add item to cart";
  }
};

export const removeFromCart = async (
  prevState: any,
  payload: {
    storeId: string;
    cartItemId?: string;
    quantity?: number;
  }
): Promise<string | void> => {
  const { storeId, cartItemId, quantity } = payload;

  const cartId = cookies().get("cartId")?.value;
  const initDataRaw = cookies().get("initDataRaw")?.value;

  if (!initDataRaw) {
    redirect("/unathenticated");
  }

  if (!cartId) {
    return "No cart found";
  }

  if (!cartItemId) {
    return "No item found";
  }

  try {
    await tmaAuthenticated(initDataRaw, storeId, cartRemoveItem, {
      input: {
        cartId,
        cartItemId,
        quantity: quantity || 1
      }
    });
    revalidateTag(TAGS.CART);
  } catch (e) {
    return "Could not remove item from cart";
  }
};

export const updateCartItem = async (
  prevState: any,
  formData: FormData
): Promise<string | void> => {
  const storeId = formData.get("storeId") as string;
  const cartItemId = String(formData.get("cartItemId"));
  const quantity = Number(formData.get("quantity"));

  const cartId = cookies().get("cartId")?.value;
  const initDataRaw = cookies().get("initDataRaw")?.value;

  if (!initDataRaw) {
    redirect("/unathenticated");
  }

  if (!cartId) {
    return "No cart found";
  }

  if (!cartItemId) {
    return "No item found";
  }

  try {
    await tmaAuthenticated(initDataRaw, storeId, cartUpdateItem, {
      input: {
        cartId,
        cartItemId,
        quantity: quantity || 1
      }
    });
    revalidateTag(TAGS.CART);
  } catch (e) {
    return "Could not update item in cart";
  }
};
