"use server";

import {
  contactInformationCreate,
  contactInformationDefaultSet,
  contactInformationDelete,
  orderCreate,
  PaymentProvider,
  shippingAddressCreate,
  shippingAddressDefaultSet,
  shippingAddressDelete,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/auth";
import { getInitDataRaw } from "@/components/auth/getInitDataRaw";
import storeRedirect from "@/components/navigation/redirect";
import { getStoreId } from "@/components/store/getStoreId";
import { tmaAuthenticated } from "@/lib/auth";

import { ContactInformationScheme } from "./schemes";

export const createOrder = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      success: boolean;
      formError?: string;
      paymentLink?: string;
    }
  | undefined
> => {
  const storeId = await getStoreId();
  const cartId = cookies().get("cartId")?.value;
  const initDataRaw = await getInitDataRaw();
  const paymentMethodId = formData.get("payment-method-id") as string;
  const t = await getTranslations("CartPage.CheckoutForm");

  if (!cartId) {
    return { success: false, formError: t("errors.noCartFound") };
  }

  if (!paymentMethodId) {
    return { success: false, formError: t("errors.noPaymentMethodSelected") };
  }

  const result = await tmaAuthenticated(initDataRaw, storeId, orderCreate, {
    storeId,
    cartId,
    paymentMethodId
  });

  if (!result) {
    return { success: false, formError: t("errors.couldNotCreateOrder") };
  }

  const { paymentProvider, paymentInfo } = result;

  if (
    paymentProvider === PaymentProvider.BANK_TRANSFER ||
    paymentProvider === PaymentProvider.CRYPTO_TRANSFER
  ) {
    return { success: true };
  }

  const parsedPaymentInfo = JSON.parse(paymentInfo);

  if (paymentProvider === PaymentProvider.TELEGRAM_INVOICE) {
    return {
      success: true,
      paymentLink: parsedPaymentInfo.payment_link
    };
  }

  return {
    success: true,
    paymentLink: parsedPaymentInfo.direct_payment_link
  };
};

export const setDefaultShippingAddress = async (
  prevState: any,
  formData: FormData
) => {
  const storeId = await getStoreId();
  const shippingAddressId = formData.get("shipping-address-id") as string;
  const session = await getServerSession(authOptions);
  const t = await getTranslations("ShippingPage");

  if (!session) {
    redirect("/unauthenticated");
  }

  const shippingAddress = await tmaAuthenticated(
    session.user.initDataRaw,
    storeId,
    shippingAddressDefaultSet,
    {
      storeId,
      shippingAddressId
    }
  );

  if (!shippingAddress) {
    return t("selectAddressError");
  }

  revalidateTag(TAGS.SHIPPING);
  return await storeRedirect("/cart", RedirectType.push);
};

export const createShippingAddress = async (
  prevState: any,
  formData: FormData
) => {
  const storeId = await getStoreId();
  const initDataRaw = await getInitDataRaw();
  const t = await getTranslations("ShippingCreatePage.CreateForm");

  const address = formData.get("address") as string;
  const houseNumber = formData.get("house-number") as unknown as number;
  const privateHouse = Boolean(formData.get("private-house"));

  if (!houseNumber && !privateHouse) {
    return {
      fieldErrors: {
        houseNumber: t("houseNumber.errorMessage")
      }
    };
  }

  const floor = formData.get("floor") as unknown as number;
  const entrance = formData.get("entrance") as unknown as number;
  const intercom = formData.get("intercom") as unknown as number;

  const house = privateHouse
    ? t("privateHouse.label") + " "
    : `${t("houseNumber.label")}: ${houseNumber} `;
  const floorString = floor ? `${t("floor.label")}: ${floor} ` : "";
  const entranceString = entrance ? `${t("entrance.label")}: ${entrance} ` : "";
  const intercomString = intercom ? `${t("intercom.label")}: ${intercom}` : "";

  const additionalInfo = `${house}${floorString}${entranceString}${intercomString}`;

  const shippingAddress = await tmaAuthenticated(
    initDataRaw,
    storeId,
    shippingAddressCreate,
    {
      input: {
        storeId,
        address,
        additionalInfo
      }
    }
  );

  if (!shippingAddress) {
    return { formError: t("formError") };
  }

  revalidateTag(TAGS.SHIPPING);
  return await storeRedirect("/shipping", RedirectType.push);
};

export const deleteShippingAddress = async (
  prevState: any,
  shippingAddressId: string
) => {
  const initDataRaw = await getInitDataRaw();
  const storeId = await getStoreId();
  const t = await getTranslations("ShippingPage");
  const success = await tmaAuthenticated(
    initDataRaw,
    storeId,
    shippingAddressDelete,
    {
      shippingAddressId
    }
  );

  if (!success) return t("deleteAddressError");

  revalidateTag(TAGS.SHIPPING);
};

export const createContactInformation = async (
  prevState: any,
  formData: FormData
) => {
  const storeId = await getStoreId();
  const initDataRaw = await getInitDataRaw();
  const t = await getTranslations("ContactInfoPage.CreateForm");

  const validatedData = ContactInformationScheme.safeParse({
    name: formData.get("name") || "",
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined
  });

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  const contactInformation = await tmaAuthenticated(
    initDataRaw,
    storeId,
    contactInformationCreate,
    {
      input: {
        ...validatedData.data,
        storeId
      }
    }
  );

  if (!contactInformation) return { formError: t("formError") };

  revalidateTag(TAGS.SHIPPING);
  return await storeRedirect("/contact-info", RedirectType.push);
};

export const setDefaultContactInformation = async (
  prevState: any,
  formData: FormData
) => {
  const storeId = await getStoreId();
  const initDataRaw = await getInitDataRaw();
  const t = await getTranslations("ContactInfoPage");

  const contactInformationId = formData.get("contact-information-id") as string;

  const contactInformation = await tmaAuthenticated(
    initDataRaw,
    storeId,
    contactInformationDefaultSet,
    {
      storeId,
      contactInformationId
    }
  );

  if (!contactInformation) return { formError: t("selectContactInfoError") };

  revalidateTag(TAGS.SHIPPING);
  return await storeRedirect("/cart", RedirectType.push);
};

export const deleteContactInformation = async (
  prevState: any,
  contactInformationId: string
) => {
  const initDataRaw = await getInitDataRaw();
  const storeId = await getStoreId();
  const t = await getTranslations("ContactInfoPage");
  const success = await tmaAuthenticated(
    initDataRaw,
    storeId,
    contactInformationDelete,
    {
      contactInformationId
    }
  );

  if (!success) return t("deleteContactInfoError");

  revalidateTag(TAGS.SHIPPING);
};
