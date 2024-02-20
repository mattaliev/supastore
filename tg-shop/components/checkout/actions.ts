"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  orderCreate,
  orderGetByCartId,
  shippingDetailsCreate,
  shippingDetailsUpdate,
} from "@/lib/api";
import { ShippingDetails } from "@/lib/api/types";

import { ShippingDetailsFieldErrors, ShippingDetailsScheme } from "./schemes";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createOrder = async (prevState: any): Promise<string | void> => {
  const cartId = cookies().get("cartId")?.value;
  const userId = cookies().get("userId")?.value;

  if (!cartId) {
    return "No cart found";
  }

  let redirectPath = "/checkout/shipping";

  try {
    let order;
    console.log("Getting order by cart id");
    order = await orderGetByCartId(cartId);

    if (!order) {
      console.log("Creating new order");
      order = await orderCreate(cartId, userId);
    }

    cookies().set("orderId", order.id);

    if (order.hasDefaultShippingDetails) {
      redirectPath = "/checkout/payment";
    }
  } catch (e) {
    console.error(e);
    return "Could not create order";
  }

  redirect(redirectPath);
};

export type FormErrorResponse = {
  fieldErrors?: ShippingDetailsFieldErrors;
  formError?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createShippingDetails = async (
  prevState: any,
  formData: FormData
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
    postcode: formData.get("postcode") || "",
  });

  if (!orderId) {
    return { formError: "No order found" };
  }

  if (!validatedData.success) {
    console.log(validatedData.error.issues);
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  const shippingDetailsId = String(formData.get("id"));

  try {
    if (shippingDetailsId) {
      // Update existing shipping details
      console.log("Updating shipping details");
      await shippingDetailsUpdate({
        ...(validatedData.data as ShippingDetails),
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
  redirect("/checkout/payment");
};
