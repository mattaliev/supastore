import { Characteristic } from "@ditch/lib";
import z, { ZodArray, ZodNumber, ZodString } from "zod";

const decimalRegex = new RegExp(/^\d+(\.\d{1,2})?$|^\d+$/);

const baseProductVariantScheme = {
  productVariantId: z.string().optional(),
  name: z.string().min(1),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(1),
  description: z.string().max(3000).optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  sizes: z
    .array(
      z
        .object({
          productVariantSizeId: z.string().optional(),
          sizeEn: z.string().optional(),
          sizeRu: z.string().optional(),
          price: z
            .string({
              invalid_type_error: "Invalid price",
            })
            .min(1, { message: "Price is required" })
            .regex(decimalRegex, {
              message:
                "Price must be either a whole number or decimal with up to 2 decimal places",
            }),
        })
        .transform((data) => {
          const { productVariantSizeId, ...rest } = data;
          return productVariantSizeId
            ? { ...rest, productVariantSizeId }
            : rest;
        }),
    )
    .min(1),
  characteristics: z
    .array(
      z.object({
        id: z.string(),
        value: z.union([
          z.string(),
          z.array(z.string()),
          z.number(),
          z.array(z.number()),
        ]),
      }),
    )
    .optional(),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    invalid_type_error: "Status is required",
    required_error: "Status is required",
  }),
};

const baseVariant = z.object(baseProductVariantScheme);

export type ProductVariantType = z.infer<typeof baseVariant>;

export type ProductVariantFieldErrors = z.inferFlattenedErrors<
  typeof baseVariant,
  { message: string; code: string; path: string[] }
>["fieldErrors"];

const characteristicValidator = (characteristic: Characteristic) => {
  switch (characteristic.type) {
    case "STRING":
      return buildScalarCharacteristic(characteristic, z.string());
    case "NUMBER":
      return buildScalarCharacteristic(
        characteristic,
        z.string().regex(decimalRegex),
      );
    case "ARRAY_STRING":
      return buildArrayCharacteristic(characteristic, z.array(z.string()));
    case "ARRAY_NUMBER":
      return buildArrayCharacteristic(
        characteristic,
        z.array(z.string().regex(decimalRegex)),
      );
  }
};

const buildScalarCharacteristic = (
  characteristic: Characteristic,
  scalar: z.ZodNumber | z.ZodString,
) => {
  if (characteristic.required) {
    return scalar.min(1);
  }

  return scalar.optional().nullable();
};

const buildArrayCharacteristic = (
  characteristic: Characteristic,
  charc: ZodArray<ZodString | ZodNumber, "many">,
) => {
  let newCharc;

  if (!characteristic.required) {
    newCharc = charc.optional().nullable();
  } else {
    newCharc = charc.min(1);
  }

  if (characteristic.maxCount && characteristic.maxCount > 0) {
    newCharc = charc.max(characteristic.maxCount);
  }
  return newCharc;
};

export const buildProductVariantScheme = (
  characteristics: Characteristic[],
) => {
  const characteristicsScheme = characteristics.reduce(
    (acc, characteristic) => {
      return {
        ...acc,
        [characteristic.id]: characteristicValidator(characteristic),
      };
    },
    {},
  );

  return z
    .object({
      ...baseProductVariantScheme,
      characteristics: z
        .object(characteristicsScheme)
        .optional()
        .transform(
          (
            data:
              | Record<string, string | string[] | number | number[]>
              | undefined,
          ) => {
            if (!data) return;

            return Object.keys(data).map((key) => ({
              characteristicId: key,
              value: Array.isArray(data[key]) ? data[key] : [data[key]],
            }));
          },
        ),
    })
    .transform((data) => {
      const { productVariantId, ...rest } = data;
      return productVariantId ? { ...rest, productVariantId } : rest;
    });
};

export const productFromFormDataGet = (
  categoryCharacteristics: Characteristic[],
  formData: FormData,
  variantIndex: number,
) => {
  const baseProductVariantCharacteristics =
    baseProductVariantCharacteristicsGet(formData, variantIndex);
  const sizes = productSizesGet(formData, variantIndex);

  const productCategoryCharacteristics = categoryCharacteristics.reduce(
    (acc, char) => {
      if (char.type === "ARRAY_STRING" || char.type === "ARRAY_NUMBER") {
        acc[char.id] = formData.getAll(variantIndex + char.nameEn);
      } else {
        acc[char.id] = formData.get(variantIndex + char.nameEn);
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return {
    ...baseProductVariantCharacteristics,
    sizes,
    characteristics: {
      ...productCategoryCharacteristics,
    },
  };
};

const baseProductVariantCharacteristicsGet = (
  formData: FormData,
  index?: number,
) => {
  return {
    productVariantId: formData.get(index + "variantId"),
    name: formData.get(index + "name"),
    shortDescription: formData.get(index + "shortDescription"),
    sku: formData.get(index + "sku"),
    description: formData.get(index + "description"),
    brand: formData.get(index + "brand"),
    images: formData.getAll(index + "images"),
    state: formData.get(index + "state"),
  };
};

const productSizesGet = (formData: FormData, index: number) => {
  const sizeEn = formData.getAll(index + "sizeEn");
  const sizeRu = formData.getAll(index + "sizeRu");
  const prices = formData.getAll(index + "price");
  const sizeIds = formData.getAll(index + "sizeId");

  return prices.map((price, index) => ({
    productVariantSizeId: sizeIds[index],
    sizeEn: sizeEn[index],
    sizeRu: sizeRu[index],
    price,
  }));
};
