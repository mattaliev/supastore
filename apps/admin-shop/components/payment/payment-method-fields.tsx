import {
  BankTransferPaymentMethod,
  CryptoTransferPaymentMethod,
  ParsedPaymentMethod,
  PaymentProvider,
  TelegramPaymentMethod,
  WalletPayPaymentMethod,
} from "@ditch/lib";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { PaymentFieldErrors } from "@/components/payment/schemes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function PaymentMethodFields({
  paymentMethod,
  provider,
  setProvider,
  fieldErrors,
}: {
  paymentMethod?: ParsedPaymentMethod;
  provider: string | null;
  setProvider: (provider: string) => void;
  fieldErrors?: PaymentFieldErrors;
}) {
  const [state, setState] = useState<string>("ACTIVE");

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        {fieldErrors && "name" in fieldErrors && (
          <p className="text-destructive text-xs">{fieldErrors?.name}</p>
        )}
        <Input
          id="name"
          name="name"
          placeholder="Enter a name for payment gateway"
          defaultValue={paymentMethod?.name || ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="provider">Provider</Label>
        {fieldErrors && "provider" in fieldErrors && (
          <p className="text-destructive text-xs">{fieldErrors?.provider}</p>
        )}
        <Select
          onValueChange={(value) => setProvider(value)}
          defaultValue={provider || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a payment provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TELEGRAM_INVOICE">Telegram Payments</SelectItem>
            <SelectItem value="CRYPTO_TRANSFER">Crypto Transfer</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="WALLET_PAY">Wallet Pay</SelectItem>
          </SelectContent>
          <input
            type={"hidden"}
            value={provider || ""}
            name={"provider"}
            id={"provider"}
          />
        </Select>
      </div>
      {provider && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="button-text">Button text</Label>
            <p className="text-muted-foreground text-xs">
              This text will be displayed on the payment button
            </p>
            {fieldErrors && "buttonText" in fieldErrors && (
              <p className="text-destructive text-xs">
                {fieldErrors?.buttonText}
              </p>
            )}
            <Input
              id="buttonText"
              name="buttonText"
              placeholder="Enter button text"
              defaultValue={paymentMethod?.buttonText || ""}
            />
          </div>
          {provider === PaymentProvider.TELEGRAM_INVOICE && (
            <TelegramPaymentsFields
              fieldErrors={fieldErrors}
              paymentMethod={paymentMethod as TelegramPaymentMethod}
            />
          )}
          {provider === PaymentProvider.CRYPTO_TRANSFER && (
            <CryptoTransferFields
              fieldErrors={fieldErrors}
              paymentMethod={paymentMethod as CryptoTransferPaymentMethod}
            />
          )}
          {provider === PaymentProvider.BANK_TRANSFER && (
            <BankTransferFields
              fieldErrors={fieldErrors}
              paymentMethod={paymentMethod as BankTransferPaymentMethod}
            />
          )}
          {provider === PaymentProvider.WALLET_PAY && (
            <WalletPayFields
              fieldErrors={fieldErrors}
              paymentMethod={paymentMethod as WalletPayPaymentMethod}
            />
          )}

          <div className="grid gap-2">
            <Label htmlFor="state">Status</Label>
            {fieldErrors && "state" in fieldErrors && (
              <p className="text-destructive text-xs">{fieldErrors?.state}</p>
            )}
            <Select
              onValueChange={(value) => setState(value)}
              defaultValue="ACTIVE"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Draft</SelectItem>
              </SelectContent>
              <input type="hidden" name="state" id="state" value={state} />
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

function TelegramPaymentsFields({
  fieldErrors,
  paymentMethod,
}: {
  paymentMethod: TelegramPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const [gateway, setGateway] = useState<string>(
    paymentMethod?.otherInfo.paymentGateway || ""
  );
  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="paymentGateway">Payment Gateway</Label>
        {fieldErrors && "paymentGateway" in fieldErrors && (
          <p className="text-destructive text-xs">
            {fieldErrors?.paymentGateway}
          </p>
        )}
        <Select
          onValueChange={(value) => setGateway(value)}
          defaultValue={gateway}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment gateway" />
          </SelectTrigger>
          <SelectContent>
            {telegramPaymentProviders.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
          <input
            type="hidden"
            name="paymentGateway"
            id="paymentGateway"
            value={gateway}
          />
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="providerToken">Provider Token</Label>
        {fieldErrors && "providerToken" in fieldErrors && (
          <p className="text-destructive text-xs">
            {fieldErrors?.providerToken}
          </p>
        )}
        <div className="relative">
          <Input
            id="providerToken"
            name="providerToken"
            placeholder="Enter provider token"
            defaultValue={paymentMethod?.otherInfo.provider_token || ""}
            type={hidden ? "password" : "text"}
          />
          <div className={"absolute right-2.5 top-2.5"}>
            {hidden && (
              <EyeOff
                className={
                  "h-5 w-5 text-muted-foreground hover:text-accent-foreground"
                }
                onClick={() => setHidden(false)}
              />
            )}
            {!hidden && (
              <Eye
                className={
                  "h-5 w-5 text-muted-foreground hover:text-accent-foreground"
                }
                onClick={() => setHidden(true)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CryptoTransferFields({
  fieldErrors,
  paymentMethod,
}: {
  paymentMethod?: CryptoTransferPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const network = paymentMethod?.otherInfo?.network || "";
  const address = paymentMethod?.otherInfo?.address || "";

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="network">Network</Label>
        {fieldErrors && "network" in fieldErrors && (
          <p className="text-destructive text-xs">{fieldErrors?.network}</p>
        )}
        <Input
          id="network"
          name="network"
          placeholder="Enter network"
          defaultValue={network}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        {fieldErrors && "address" in fieldErrors && (
          <p className="text-destructive text-xs">{fieldErrors?.address}</p>
        )}
        <Input
          id="address"
          name="address"
          placeholder="Enter address on selected network"
          defaultValue={address}
        />
      </div>
    </>
  );
}

function BankTransferFields({
  fieldErrors,
  paymentMethod,
}: {
  paymentMethod?: BankTransferPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const message = paymentMethod?.otherInfo?.message || "";

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Message</Label>
        <p className="text-muted-foreground text-xs">
          This message with your requisites will be sent to the user when they
          checkout. It is recommended that you include all the necessary
          information for the user to make a successful payment.
        </p>
        {fieldErrors && "message" in fieldErrors && (
          <p className="text-destructive text-xs">{fieldErrors?.message}</p>
        )}
        <Textarea
          id="message"
          name="message"
          placeholder="Enter message"
          defaultValue={message}
        />
      </div>
    </>
  );
}

function WalletPayFields({
  fieldErrors,
  paymentMethod,
}: {
  paymentMethod?: WalletPayPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const [currency, setCurrency] = useState<string>(
    paymentMethod?.otherInfo?.autoConversionCurrency || ""
  );
  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="apiKey">API key</Label>
        {fieldErrors && "apiKey" in fieldErrors && (
          <p className="text-destructive text-xs">{fieldErrors?.apiKey}</p>
        )}
        <div className="relative">
          <Input
            id="apiKey"
            name="apiKey"
            placeholder="Enter Wallet Pay API Key"
            defaultValue={paymentMethod?.otherInfo?.api_key || ""}
            type={hidden ? "password" : "text"}
          />
          <div className={"absolute right-2.5 top-2.5"}>
            {hidden && (
              <EyeOff
                className={
                  "h-5 w-5 text-muted-foreground hover:text-accent-foreground"
                }
                onClick={() => setHidden(false)}
              />
            )}
            {!hidden && (
              <Eye
                className={
                  "h-5 w-5 text-muted-foreground hover:text-accent-foreground"
                }
                onClick={() => setHidden(true)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Auto Conversion Currency</Label>
        <p className="text-muted-foreground text-xs">
          All payments will be converted to the selected currency
        </p>
        {fieldErrors && "autoConversionCurrency" in fieldErrors && (
          <p className="text-destructive text-xs">
            {fieldErrors?.autoConversionCurrency}
          </p>
        )}
        <Select onValueChange={(value) => setCurrency(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="TON">TON</SelectItem>
            <SelectItem value="BTC">BTC</SelectItem>
          </SelectContent>
          <input
            type="hidden"
            name="autoConversionCurrency"
            id="autoConversionCurrency"
            value={currency}
          />
        </Select>
      </div>
    </>
  );
}

const telegramPaymentProviders = [
  "Stripe",
  "Smart Glocal",
  "Unlimint",
  "Tranzo",
  "PayKassma",
  "YooMoney",
  "Sberbank",
  "PSB",
  "Bank 131",
  "Payme",
  "CLICK",
  "LiqPay",
  "LeoGaming",
  "Cascad",
  "Portmone",
  "Paymega",
  "ECOMMPAY",
  "PayMaster",
  "Global Pay UZ",
  "iPay88",
  "PayBox.money",
  "Freedom Pay",
  "bill_line",
  "Chapa",
];
