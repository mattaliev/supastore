"use server";

import {
  manualMailingCreate,
  manualMailingPreview,
  manualMailingSend,
  TAGS,
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import {
  ManualMailingCreateScheme,
  ManualMailingPreviewScheme,
} from "@/components/marketing/schemes";
import { getStoreId } from "@/components/store/helpers";

export const createManualMailing = async (
  prevState: any,
  formData: FormData,
) => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const validatedData = ManualMailingCreateScheme.safeParse({
    name: formData.get("name") as string,
    message: formData.get("message") as string,
    audience: formData.getAll("audience") as string[],
    ctaText: formData.get("cta-text") as string,
    ctaUrl: formData.get("cta-url") as string,
    executeImmediately: Boolean(formData.get("execute-immediately")),
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const manualMailing = await authenticated(
      accessToken,
      manualMailingCreate,
      {
        input: {
          ...validatedData.data,
          storeId,
        },
      },
    );

    if (!manualMailing) throw new Error("Could not create manual mailing");
  } catch (e) {
    console.error(e);
    return { formError: "Could not create manual mailing" };
  }

  revalidateTag(TAGS.MARKETING);
};

export const previewManualMailing = async (
  prevState: any,
  formData: FormData,
) => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();
  const t = await getTranslations("MarketingPage.ManualMailingPreview.Form");

  const validatedData = ManualMailingPreviewScheme.safeParse({
    storeId: formData.get("store-id") as string,
    message: formData.get("message") as string,
    ctaText: formData.get("cta-text") as string,
    ctaUrl: formData.get("cta-url") as string,
    sendToAllAdmins: Boolean(formData.get("send-to-all-admins")),
  });

  if (!validatedData.success) {
    return { formError: t("invalidMessageError") };
  }

  try {
    const manualMailing = await authenticated(
      accessToken,
      manualMailingPreview,
      {
        input: {
          ...validatedData.data,
          storeId,
        },
      },
    );

    if (!manualMailing) throw new Error("Could not preview manual mailing");
  } catch (e) {
    console.error(e);
    return { formError: t("formError") };
  }

  revalidateTag(TAGS.MARKETING);
};

export const sendManualMailing = async (prevState: any, formData: FormData) => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const mailingId = formData.get("mailing-id") as string;

  try {
    const manualMailing = await authenticated(accessToken, manualMailingSend, {
      mailingId,
      storeId,
    });
  } catch (e) {
    console.error(e);
    return { formError: "Could not send manual mailing" };
  }

  revalidateTag(TAGS.MARKETING);
};
