import { z } from "zod";

const priceRegex = new RegExp(/^\d+(\.\d{1,2})?$|^\d+$/);

const zodArray = z.array(z.string());

export const ProductScheme = z.object({
  title: z
    .string({
      invalid_type_error: "Invalid title"
    })
    .min(1, { message: "Title is required" }),
  shortDescription: z.string({
    invalid_type_error: "Invalid description"
  }),
  description: z.string({
    invalid_type_error: "Invalid description"
  }),
  price: z
    .string({
      invalid_type_error: "Invalid price"
    })
    .min(1, { message: "Price is required" })
    .regex(priceRegex, {
      message:
        "Price must be either a whole number or decimal with up to 2 decimal places"
    }),
  sku: z
    .string({
      invalid_type_error: "Invalid sku"
    })
    .min(1, { message: "SKU is required" }),
  variants: z.array(
    z.object({
      color: z
        .string({
          invalid_type_error: "Invalid color"
        })
        .optional(),
      size: z
        .string({
          invalid_type_error: "Invalid size"
        })
        .optional(),
      material: z
        .string({
          invalid_type_error: "Invalid material"
        })
        .optional(),
      quantity: z.number({
        invalid_type_error: "Invalid quantity",
        required_error: "Quantity is required"
      })
    })
  ),
  imageUrls: z.array(z.string()),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    invalid_type_error: "Status is required",
    required_error: "Status is required"
  })
});

export type ProductType = z.infer<typeof ProductScheme>;

export type ProductFieldErrors = z.inferFlattenedErrors<
  typeof ProductScheme
>["fieldErrors"];
