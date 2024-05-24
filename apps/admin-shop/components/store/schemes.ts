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

export type StoreType = z.infer<typeof StoreScheme>;
export type StoreApplicationType = z.infer<typeof StoreApplicationScheme>;

export type StoreFieldErrors = z.inferFlattenedErrors<
  typeof StoreScheme
>["fieldErrors"];
export type StoreApplicationFieldErrors = z.inferFlattenedErrors<
  typeof StoreApplicationScheme
>["fieldErrors"];
