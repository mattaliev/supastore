import {
  BankTransferPaymentMethod,
  CryptoTransferPaymentMethod,
  ParsedPaymentMethod,
  PaymentProvider,
  TelegramPaymentMethod,
  WalletPayPaymentMethod
} from "@ditch/lib";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PaymentFieldErrors } from "@/components/payment/schemes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function PaymentMethodFields({
  paymentMethod,
  provider,
  setProvider,
  fieldErrors
}: {
  paymentMethod?: ParsedPaymentMethod;
  provider: string | null;
  setProvider: (provider: string) => void;
  fieldErrors?: PaymentFieldErrors;
}) {
  const [state, setState] = useState<string>("ACTIVE");
  const t = useTranslations("PaymentSystemsPage.FormFields");

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">{t("Name.label")}</Label>
        {fieldErrors && "name" in fieldErrors && (
          <p className="text-destructive text-xs">{t("Name.error")}</p>
        )}
        <Input
          id="name"
          name="name"
          placeholder={t("Name.placeholder")}
          defaultValue={paymentMethod?.name || ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="provider">{t("Provider.label")}</Label>
        {fieldErrors && "provider" in fieldErrors && (
          <p className="text-destructive text-xs">{t("Provider.error")}</p>
        )}
        <Select
          onValueChange={(value) => setProvider(value)}
          defaultValue={provider || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Provider.placeholder")} />
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
            <Label htmlFor="button-text">{t("ButtonText.label")}</Label>
            <p className="text-muted-foreground text-xs">
              {t("ButtonText.description")}
            </p>
            {fieldErrors && "buttonText" in fieldErrors && (
              <p className="text-destructive text-xs">
                {t("ButtonText.error")}
              </p>
            )}
            <Input
              id="buttonText"
              name="buttonText"
              placeholder={t("ButtonText.placeholder")}
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
            <Label htmlFor="state">{t("Status.label")}</Label>
            {fieldErrors && "state" in fieldErrors && (
              <p className="text-destructive text-xs">{t("Status.error")}</p>
            )}
            <Select
              onValueChange={(value) => setState(value)}
              defaultValue="ACTIVE"
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Status.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">{t("Status.active")}</SelectItem>
                <SelectItem value="INACTIVE">{t("Status.draft")}</SelectItem>
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
  paymentMethod
}: {
  paymentMethod: TelegramPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const [gateway, setGateway] = useState<string>(
    paymentMethod?.otherInfo.paymentGateway || ""
  );
  const [hidden, setHidden] = useState<boolean>(true);
  const t = useTranslations("PaymentSystemsPage.FormFields.TelegramPayments");

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="paymentGateway">{t("PaymentGateway.label")}</Label>
        {fieldErrors && "paymentGateway" in fieldErrors && (
          <p className="text-destructive text-xs">
            {t("PaymentGateway.error")}
          </p>
        )}
        <Select
          onValueChange={(value) => setGateway(value)}
          defaultValue={gateway}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("PaymentGateway.placeholder")} />
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
        <Label htmlFor="providerToken">{t("ProviderToken.label")}</Label>
        {fieldErrors && "providerToken" in fieldErrors && (
          <p className="text-destructive text-xs">{t("ProviderToken.error")}</p>
        )}
        <div className="relative">
          <Input
            id="providerToken"
            name="providerToken"
            placeholder={t("ProviderToken.placeholder")}
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
  paymentMethod
}: {
  paymentMethod?: CryptoTransferPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const network = paymentMethod?.otherInfo?.network || "";
  const address = paymentMethod?.otherInfo?.address || "";
  const t = useTranslations("PaymentSystemsPage.FormFields.CryptoTransfer");

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="network">{t("Network.label")}</Label>
        {fieldErrors && "network" in fieldErrors && (
          <p className="text-destructive text-xs">{t("Network.error")}</p>
        )}
        <Input
          id="network"
          name="network"
          placeholder={t("Network.placeholder")}
          defaultValue={network}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">{t("Address.label")}</Label>
        {fieldErrors && "address" in fieldErrors && (
          <p className="text-destructive text-xs">{t("Address.error")}</p>
        )}
        <Input
          id="address"
          name="address"
          placeholder={t("Address.placeholder")}
          defaultValue={address}
        />
      </div>
    </>
  );
}

function BankTransferFields({
  fieldErrors,
  paymentMethod
}: {
  paymentMethod?: BankTransferPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const message = paymentMethod?.otherInfo?.message || "";
  const t = useTranslations("PaymentSystemsPage.FormFields.BankTransfer");

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">{t("Message.label")}</Label>
        <p className="text-muted-foreground text-xs">
          {t("Message.description")}
        </p>
        {fieldErrors && "message" in fieldErrors && (
          <p className="text-destructive text-xs">{t("Message.error")}</p>
        )}
        <Textarea
          id="message"
          name="message"
          placeholder={t("Message.placeholder")}
          defaultValue={message}
        />
      </div>
    </>
  );
}

function WalletPayFields({
  fieldErrors,
  paymentMethod
}: {
  paymentMethod?: WalletPayPaymentMethod;
  fieldErrors?: PaymentFieldErrors;
}) {
  const [currency, setCurrency] = useState<string>(
    paymentMethod?.otherInfo?.autoConversionCurrency || ""
  );
  const [hidden, setHidden] = useState<boolean>(true);
  const t = useTranslations("PaymentSystemsPage.FormFields.WalletPay");

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="apiKey">{t("ApiKey.label")}</Label>
        {fieldErrors && "apiKey" in fieldErrors && (
          <p className="text-destructive text-xs">{t("ApiKey.error")}</p>
        )}
        <div className="relative">
          <Input
            id="apiKey"
            name="apiKey"
            placeholder={t("ApiKey.placeholder")}
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
        <Label htmlFor="address">{t("AutoConversionCurrency.label")}</Label>
        <p className="text-muted-foreground text-xs">
          {t("AutoConversionCurrency.description")}
        </p>
        {fieldErrors && "autoConversionCurrency" in fieldErrors && (
          <p className="text-destructive text-xs">
            {t("AutoConversionCurrency.error")}
          </p>
        )}
        <Select onValueChange={(value) => setCurrency(value)}>
          <SelectTrigger>
            <SelectValue
              placeholder={t("AutoConversionCurrency.placeholder")}
            />
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
  "Chapa"
];
