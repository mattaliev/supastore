import { z } from "zod";

export const StoreScheme = z.object({
  storeName: z
    .string({
      required_error: "Store name is required",
      invalid_type_error: "Store name must be a string"
    })
    .min(1, {
      message: "Please enter a valid store name"
    })
    .optional()
    .nullable(),
  storeDescription: z
    .string({
      required_error: "Store description is required",
      invalid_type_error: "Store description must be a string"
    })
    .optional()
    .nullable(),
  logoDark: z.instanceof(File).optional().nullable(),
  logoLight: z.instanceof(File).optional().nullable(),
  botToken: z
    .string({
      invalid_type_error: "Bot token must be a string"
    })
    .optional()
    .nullable(),
  botUsername: z
    .string({
      invalid_type_error: "Bot username must be a string"
    })
    .optional()
    .nullable(),
  storeTimezone: z
    .string({
      required_error: "Store timezone is required",
      invalid_type_error: "Store timezone must be a string"
    })
    .optional()
    .nullable(),
  telegramStoreUrl: z
    .string({
      invalid_type_error: "Telegram store URL must be a string"
    })
    .optional()
    .nullable()
});

export const StoreApplicationScheme = z.object({
  storeName: z
    .string({
      required_error: "Store name is required",
      invalid_type_error: "Store name must be a string"
    })
    .min(1, {
      message: "Please enter a valid store name"
    }),
  storeDescription: z
    .string({
      required_error: "Store description is required",
      invalid_type_error: "Store description must be a string"
    })
    .optional(),
  channels: z.string({
    required_error: "Telegram channels are required",
    invalid_type_error: "Telegram channels must be a string"
  }),
  productCategory: z.string().min(1, {
    message: "Please select a product category"
  })
});

const messageLinkRegex = new RegExp(/https:\/\/t\.me\/c\/\d+\/\d+(?:\/\d+)?/);

export const StoreSupportBotScheme = z.object({
  botUsername: z.string().min(1, {
    message: "Please enter a valid bot username"
  }),
  botToken: z.string().min(1, {
    message: "Please enter a valid bot token"
  }),
  greetingMessage: z.string().optional(),
  messageLink: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) =>
        value === "" ||
        value === undefined ||
        value === null ||
        messageLinkRegex.test(value),
      {
        message: "Please enter a valid message link"
      }
    ),
  isForum: z.boolean().optional()
});

export type StoreSupportBotType = z.infer<typeof StoreSupportBotScheme>;
export type StoreSupportBotFieldErrors = z.inferFlattenedErrors<
  typeof StoreSupportBotScheme
>["fieldErrors"];

export type StoreType = z.infer<typeof StoreScheme>;
export type StoreApplicationType = z.infer<typeof StoreApplicationScheme>;

export type StoreFieldErrors = z.inferFlattenedErrors<
  typeof StoreScheme
>["fieldErrors"];
export type StoreApplicationFieldErrors = z.inferFlattenedErrors<
  typeof StoreApplicationScheme
>["fieldErrors"];
