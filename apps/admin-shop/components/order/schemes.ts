import { z } from "zod";

export const ShippingTrackingScheme = z.object({
  shippingId: z
    .string({
      invalid_type_error: "Shipping ID must be a string",
      required_error: "Shipping ID is required"
    })
    .min(1),
  carrier: z
    .string({
      invalid_type_error: "Carrier must be a string",
      required_error: "Please enter the name of the carrier"
    })
    .min(1, { message: "Please provide a shipping carrier" }),
  trackingNumber: z
    .string({
      invalid_type_error: "Tracking number must be a string",
      required_error: "Please enter the tracking number"
    })
    .min(1, { message: "Please provide a tracking number" })
});

export type ShippingTracking = z.infer<typeof ShippingTrackingScheme>;

export type ShippingTrackingFieldErrors = z.inferFlattenedErrors<
  typeof ShippingTrackingScheme
>["fieldErrors"];
