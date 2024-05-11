import { z } from "zod";

export const BasePaymentMethodScheme = z.object({
  provider: z
    .string({
      required_error: "Please select a provider"
    })
    .min(1, {
      message: "Please select a provider"
    }),
  name: z
    .string({
      required_error: "Please provide a name"
    })
    .min(1, {
      message: "Please enter a name"
    }),
  buttonText: z
    .string({
      required_error: "Please enter button text"
    })
    .min(1, {
      message: "Please enter button text"
    }),
  state: z.string().optional()
});

export const TelegramPaymentsScheme = z.object({
  paymentGateway: z
    .string({
      required_error: "Please select a payment gateway"
    })
    .min(1, {
      message: "Please select a payment gateway"
    }),
  providerToken: z
    .string({
      required_error: "Please enter provider token"
    })
    .min(1, {
      message: "Please enter provider token"
    })
  // .refine((value) => !value.includes("TEST"), {
  //   message: "Please provide a live provider token",
  // }),
});

export const CryptoTransferScheme = z.object({
  network: z
    .string({
      required_error: "Please enter network"
    })
    .min(1, {
      message: "Please enter network"
    }),
  address: z
    .string({
      required_error: "Please enter address"
    })
    .min(1, {
      message: "Please enter address"
    })
});

export const BankTransferScheme = z.object({
  message: z
    .string({
      required_error: "Please enter message"
    })
    .min(1, {
      message: "Please enter message"
    })
});

export const WalletPayScheme = z.object({
  apiKey: z
    .string({
      required_error: "Please enter API key"
    })
    .min(1, {
      message: "Please enter API key"
    }),
  autoConversionCurrency: z.string()
});

export const PaymentSchemes = {
  TELEGRAM_INVOICE: TelegramPaymentsScheme,
  CRYPTO_TRANSFER: CryptoTransferScheme,
  BANK_TRANSFER: BankTransferScheme,
  WALLET_PAY: WalletPayScheme
};

export type BasePaymentFieldErrors = z.inferFlattenedErrors<
  typeof BasePaymentMethodScheme
>["fieldErrors"];
export type TelegramPaymentFieldErrors = z.inferFlattenedErrors<
  typeof TelegramPaymentsScheme
>["fieldErrors"];
export type CryptoTransferFieldErrors = z.inferFlattenedErrors<
  typeof CryptoTransferScheme
>["fieldErrors"];
export type BankTransferFieldErrors = z.inferFlattenedErrors<
  typeof BankTransferScheme
>["fieldErrors"];
export type WalletPayFieldErrors = z.inferFlattenedErrors<
  typeof WalletPayScheme
>["fieldErrors"];
export type PaymentFieldErrors =
  | BasePaymentFieldErrors
  | TelegramPaymentFieldErrors
  | CryptoTransferFieldErrors
  | BankTransferFieldErrors
  | WalletPayFieldErrors;
