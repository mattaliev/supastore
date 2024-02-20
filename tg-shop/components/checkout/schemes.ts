import { z } from "zod";

export const ShippingDetailsScheme = z.object({
  address: z
    .string({
      invalid_type_error: "Invalid address",
    })
    .min(1, { message: "Address is required" }),
  country: z
    .string({
      invalid_type_error: "Invalid country",
    })
    .min(1, { message: "Country is required" }),
  city: z
    .string({
      invalid_type_error: "Invalid city",
    })
    .min(1, { message: "City is required" }),
  postcode: z
    .string({
      invalid_type_error: "Invalid postcode",
    })
    .min(1, { message: "Postal code is required" }),
  firstName: z
    .string({
      invalid_type_error: "Invalid first name",
    })
    .min(1, { message: "First name is required" }),
  lastName: z
    .string({
      invalid_type_error: "Invalid last name",
    })
    .min(1, {
      message: "Last name is required",
    }),
  email: z.optional(
    z.string().email({
      message: "Invalid email address",
    })
  ),
  phone: z.optional(z.number()),
});

export type ShippingDetailsType = z.infer<typeof ShippingDetailsScheme>;

export type ShippingDetailsFieldErrors = z.inferFlattenedErrors<
  typeof ShippingDetailsScheme
>["fieldErrors"];
