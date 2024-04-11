import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

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
  city: z.string({
    invalid_type_error: "Invalid city",
  }),
  province: z.optional(
    z.string({
      invalid_type_error: "Invalid province",
    }),
  ),
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
    }),
  ),
  phone: z.optional(
    z.string().regex(phoneRegex, { message: "Invalid phone number" }),
  ),
});

export type ShippingDetailsType = z.infer<typeof ShippingDetailsScheme>;

export type ShippingDetailsFieldErrors = z.inferFlattenedErrors<
  typeof ShippingDetailsScheme
>["fieldErrors"];
