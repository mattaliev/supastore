"use server";
import {
  storeApplicationCreate,
  storeConnectToTelegram,
  storeSupportBotUpdate,
  storeUpdate,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import { redirect as intlRedirect } from "@/components/i18n/i18n-navigation";
import { getStoreId } from "@/components/store/helpers";
import {
  StoreApplicationScheme,
  StoreFieldErrors,
  StoreScheme,
  StoreSupportBotScheme
} from "@/components/store/schemes";

export const connectToTelegram = async (prevState: any, storeId: string) => {
  const accessToken = await getAccessToken();

  try {
    const success = await authenticated(accessToken, storeConnectToTelegram, {
      storeId
    });
  } catch (error) {
    console.error(error);
  }

  revalidateTag(TAGS.STORE);
};

export const updateStore = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      fieldErrors?: StoreFieldErrors;
      formError?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const validatedData = StoreScheme.safeParse({
    storeName: formData.get("store-name"),
    storeDescription: formData.get("store-description"),
    storeTimezone: formData.get("store-timezone"),
    logoDark: formData.get("logo-dark"),
    logoLight: formData.get("logo-light"),
    botToken: formData.get("bot-token"),
    botUsername: formData.get("bot-username"),
    telegramStoreUrl: formData.get("telegram-store-url")
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors
    };
  }

  try {
    const store = await authenticated(accessToken, storeUpdate, {
      input: {
        storeId,
        ...validatedData.data
      }
    });

    if (!store) throw new Error("Could not update store");
  } catch (error) {
    console.error(error);
    return { formError: "Could not update store" };
  }

  revalidateTag(TAGS.STORE);
};

export const createStoreApplication = async (
  prevState: any,
  formData: FormData
) => {
  const accessToken = await getAccessToken();

  const validatedData = StoreApplicationScheme.safeParse({
    storeName: formData.get("store-name"),
    storeDescription: formData.get("store-description"),
    channels: formData.get("channels"),
    productCategory: formData.get("product-category")
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors
    };
  }

  try {
    const storeApplication = await authenticated(
      accessToken,
      storeApplicationCreate,
      {
        input: {
          ...validatedData.data
        }
      }
    );

    if (!storeApplication) throw new Error("Could not create store");
  } catch (error) {
    console.error(error);
    return { formError: "Could not create store" };
  }

  revalidateTag(TAGS.STORE);
  intlRedirect(`/store/create/success`);
};

export const updateSupportBot = async (prevState: any, formData: FormData) => {
  const storeId = getStoreId();
  const accessToken = await getAccessToken();

  const validatedData = StoreSupportBotScheme.safeParse({
    botUsername: formData.get("support-bot-username"),
    botToken: formData.get("support-bot-token"),
    greetingMessage: formData.get("support-bot-greeting-message"),
    messageLink: formData.get("support-bot-message-link"),
    isForum: Boolean(formData.get("support-bot-is-forum"))
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors
    };
  }

  try {
    const storeSupportBot = await authenticated(
      accessToken,
      storeSupportBotUpdate,
      {
        input: {
          storeId,
          ...validatedData.data
        }
      }
    );
  } catch (e) {
    console.error(e);
    return { formError: "Could not update support bot" };
  }

  revalidateTag(TAGS.STORE);
};
