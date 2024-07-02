import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ContactInformationScheme = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid name"
    })
    .min(1, { message: "Name is required" }),
  email: z.string().email({
    message: "Invalid email address"
  }),
  phone: z.string().regex(phoneRegex, { message: "Invalid phone number" })
});
