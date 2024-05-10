"use server";

import {
  Cart,
  cartAddItem,
  cartCreate,
  cartRemoveItem,
  cartUpdateItem,
  TAGS,
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { tmaAuthenticated } from "@/lib/auth";

export const addToCart = async (
  prevState: any,
  payload: {
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

  const { productId, selectedVariantId, doesProductHaveVariants, quantity } =
    payload;

  let cart: Cart | undefined;

  if (!productId) {
    return "No product found, please try to refresh the page";
  }

  if (doesProductHaveVariants && !selectedVariantId) {
    return "Please select size";
  }

  if (!cartId) {
    cart = await tmaAuthenticated(initDataRaw, cartCreate, {});
    cartId = cart.id;
    cookies().set("cartId", cartId);
  }

  try {
    await tmaAuthenticated(initDataRaw, cartAddItem, {
      input: {
        cartId,
        productId,
        variantId: selectedVariantId || null,
        quantity: quantity || 1,
      },
    });
    revalidateTag(TAGS.CART);
  } catch (e) {
    return "Could not add item to cart";
  }
};

export const removeFromCart = async (
  prevState: any,
  payload: {
    cartItemId?: string;
    quantity?: number;
  }
): Promise<string | void> => {
  const { cartItemId, quantity } = payload;

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
    await tmaAuthenticated(initDataRaw, cartRemoveItem, {
      input: {
        cartId,
        cartItemId,
        quantity: quantity || 1,
      },
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
    await tmaAuthenticated(initDataRaw, cartUpdateItem, {
      input: {
        cartId,
        cartItemId,
        quantity: quantity || 1,
      },
    });
    revalidateTag(TAGS.CART);
  } catch (e) {
    return "Could not update item in cart";
  }
};
