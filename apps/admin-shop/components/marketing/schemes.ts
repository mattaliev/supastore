import { ManualMailingAudience } from "@ditch/lib";
import { z } from "zod";

export const ManualMailingCreateScheme = z.object({
  name: z
    .string({
      required_error: "Please enter name",
      invalid_type_error: "Invalid name"
    })
    .min(1, {
      message: "Please enter a valid name"
    }),
  message: z
    .string({
      required_error: "Please enter message",
      invalid_type_error: "Invalid message"
    })
    .min(1, {
      message: "Please enter a valid message"
    }),
  audience: z.array(z.nativeEnum(ManualMailingAudience)).min(1, {
    message: "Please select at least one audience"
  }),
  ctaText: z
    .string({
      invalid_type_error: "Invalid cta text"
    })
    .optional(),
  ctaUrl: z
    .string({
      invalid_type_error: "Invalid cta url"
    })
    .optional(),
  executeImmediately: z.boolean()
});

export type ManualMailingCreate = z.infer<typeof ManualMailingCreateScheme>;
export type ManualMailingCreateFieldErrors = z.inferFlattenedErrors<
  typeof ManualMailingCreateScheme
>["fieldErrors"];

export const ManualMailingPreviewScheme = z.object({
  storeId: z
    .string({
      invalid_type_error: "Invalid store id",
      required_error: "Please enter store id"
    })
    .min(1, {
      message: "Please enter a valid store id"
    }),
  message: z
    .string({
      required_error: "Please enter message",
      invalid_type_error: "Invalid message"
    })
    .min(1, {
      message: "Please enter a valid message"
    }),
  ctaText: z
    .string({
      invalid_type_error: "Invalid cta text"
    })
    .optional(),
  ctaUrl: z
    .string({
      invalid_type_error: "Invalid cta url"
    })
    .optional(),
  sendToAllAdmins: z.boolean()
});

export type ManualMailingPreview = z.infer<typeof ManualMailingPreviewScheme>;
export type ManualMailingPreviewFieldErrors = z.inferFlattenedErrors<
  typeof ManualMailingPreviewScheme
>["fieldErrors"];
