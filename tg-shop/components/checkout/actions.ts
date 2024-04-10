"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import {
  orderCreate,
  shippingDetailsCreate,
  shippingDetailsUpdate,
  TAGS,
} from "@/lib/api";
import { ShippingDetails } from "@/lib/api/types";

import { ShippingDetailsFieldErrors, ShippingDetailsScheme } from "./schemes";

export const createOrder = async (prevState: any): Promise<string | void> => {
  const cartId = cookies().get("cartId")?.value;
  const userId = cookies().get("userId")?.value;

  if (!cartId) {
    return "No cart found";
  }

  let redirectPath = "/checkout/shipping";

  try {
    const order = await orderCreate(cartId, userId);

    cookies().set("orderId", order.id);

    if (order.hasDefaultShippingDetails) {
      redirectPath = "/checkout/payment";
    }
  } catch (e) {
    console.error(e);
    return "Could not create order";
  }

  revalidateTag(TAGS.ORDER);
  redirect(redirectPath, RedirectType.push);
};

export type FormErrorResponse = {
  fieldErrors?: ShippingDetailsFieldErrors;
  formError?: string;
};

export const createOrUpdateShippingDetails = async (
  prevState: any,
  formData: FormData,
): Promise<FormErrorResponse> => {
  const orderId = cookies().get("orderId")?.value;
  const userId = cookies().get("userId")?.value;

  const validatedData = ShippingDetailsScheme.safeParse({
    firstName: formData.get("first-name") || "",
    lastName: formData.get("last-name") || "",
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || "",
    country: formData.get("country") || "",
    city: formData.get("city") || "",
    province: formData.get("province") || "",
    postcode: formData.get("postcode") || "",
  });

  if (!orderId) {
    return { formError: "No order found" };
  }

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  const shippingDetailsId = String(formData.get("id"));

  try {
    if (shippingDetailsId) {
      await shippingDetailsUpdate({
        ...(validatedData.data as ShippingDetails),
        orderId,
        shippingDetailsId,
        userId,
        isDefault: Boolean(formData.get("is-default")),
      });
    } else {
      await shippingDetailsCreate({
        ...(validatedData.data as ShippingDetails),
        orderId,
        userId,
        isDefault: Boolean(formData.get("is-default")),
      });
    }
  } catch (e) {
    return { formError: "Could not create shipping details" };
  }

  revalidateTag(TAGS.ORDER);
  redirect("/checkout/payment", RedirectType.push);
};
