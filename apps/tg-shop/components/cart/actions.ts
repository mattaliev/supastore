"use server";

import {
  Cart,
  cartAddItem,
  cartCreate,
  cartGet,
  cartGetByUserId,
  cartRemoveItem,
  cartUpdateItem,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { getInitDataRaw } from "@/components/auth/getInitDataRaw";
import { getStoreId } from "@/components/store/getStoreId";
import { tmaAuthenticated } from "@/lib/auth";

export const addToCart = async (
  prevState: any,
  payload: {
    storeId: string;
    productVariantId: string;
    productVariantSizeId: string;
    doesProductHaveVariants?: boolean;
    quantity?: number;
  }
): Promise<string | undefined> => {
  let cartId = cookies().get("cartId")?.value;
  const initDataRaw = await getInitDataRaw();
  const t = await getTranslations("ProductCatalogPage.AddToCartErrors");

  const {
    storeId,
    productVariantId,
    productVariantSizeId,
    doesProductHaveVariants,
    quantity
  } = payload;

  let cart: Cart | undefined;

  if (!productVariantId) {
    return t("noProductFound");
  }

  if (doesProductHaveVariants && !productVariantSizeId) {
    return t("noVariantSelected");
  }

  if (cartId) {
    cart = await cartGet({ cartId, storeId });
  }

  if (!cart) {
    cart = await tmaAuthenticated(initDataRaw, storeId, cartGetByUserId, {
      storeId
    });
  }

  if (!cart) {
    cart = await tmaAuthenticated(initDataRaw, storeId, cartCreate, {
      storeId
    });
  }

  if (!cart) return t("couldNotCreateCart");

  cartId = cart.id;
  cookies().set("cartId", cartId);

  try {
    await tmaAuthenticated(initDataRaw, storeId, cartAddItem, {
      input: {
        cartId,
        productVariantId,
        productVariantSizeId,
        quantity: quantity || 1
      }
    });
    revalidateTag(TAGS.CART);
  } catch (e) {
    return t("couldNotAddToCart");
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
  const initDataRaw = await getInitDataRaw();
  const t = await getTranslations("ProductCatalogPage.RemoveFromCartErrors");

  if (!cartId) {
    return t("noCartFound");
  }

  if (!cartItemId) {
    return t("noItemFound");
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
    return t("couldNotRemoveFromCart");
  }
};

export const updateCartItem = async (
  prevState: any,
  formData: FormData
): Promise<string | void> => {
  const storeId = await getStoreId();
  const initDataRaw = await getInitDataRaw();
  const t = await getTranslations("ProductCatalogPage.UpdateCartItemErrors");

  const cartId = cookies().get("cartId")?.value;

  const cartItemId = String(formData.get("cartItemId"));
  const quantity = Number(formData.get("quantity"));

  if (!cartId) {
    return t("noCartFound");
  }

  if (!cartItemId) {
    return t("noProductFound");
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
    return t("couldNotUpdateCartItem");
  }
};
