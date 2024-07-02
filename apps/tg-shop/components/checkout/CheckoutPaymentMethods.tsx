import { shopPaymentMethodsList } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import WithAuth, { WithAuthProps } from "@/components/auth/WithAuth";
import { getStoreId } from "@/components/store/getStoreId";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { tmaAuthenticated } from "@/lib/auth";

async function CheckoutPaymentMethods({ initDataRaw }: WithAuthProps<{}>) {
  const storeId = await getStoreId();
  const t = await getTranslations("CartPage");

  const paymentMethods = await tmaAuthenticated(
    initDataRaw,
    storeId,
    shopPaymentMethodsList,
    {
      storeId
    }
  );

  if (!paymentMethods) {
    return (
      <div className={"m-4 text-telegram-text-color text-base font-semibold"}>
        {t("noPaymentMethods")}
      </div>
    );
  }

  return (
    <RadioGroup className={"grid gap-2"} name={"payment-method-id"}>
      {paymentMethods.map((paymentMethod) => (
        <div key={paymentMethod.id} className="flex items-center space-x-2">
          <RadioGroupItem
            value={paymentMethod.id}
            className={"text-telegram-text-color border-telegram-text-color"}
          />
          <Label
            className={"text-telegram-hint-color"}
            htmlFor={paymentMethod.id}
          >
            {paymentMethod.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default WithAuth<{}>(CheckoutPaymentMethods);
