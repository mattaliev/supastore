import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import CheckoutContactInformation from "@/components/checkout/CheckoutContactInformation";
import CheckoutPaymentMethods from "@/components/checkout/CheckoutPaymentMethods";
import CheckoutShippingAddress from "@/components/checkout/CheckoutShippingAddress";
import UpdateContactInformation from "@/components/checkout/UpdateContactInformation";
import UpdateShippingDetailsButton from "@/components/checkout/UpdateShippingDetailsButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default async function CheckoutFields() {
  const t = await getTranslations("CartPage");

  return (
    <Accordion
      type={"multiple"}
      defaultValue={[
        "shipping-address",
        "contact-information",
        "payment-methods"
      ]}
    >
      <AccordionItem
        value={"shipping-address"}
        className={"border-none"}
        id={"shipping-address"}
      >
        <AccordionTrigger className={"text-telegram-text-color font-semibold"}>
          <div className={"flex items-center gap-4"}>
            {t("checkoutShippingAddress")}
            <UpdateShippingDetailsButton />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Suspense fallback={<div>{t("loading")}</div>}>
            <CheckoutShippingAddress />
          </Suspense>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value={"contact-information"} className={"border-none"}>
        <AccordionTrigger className={"text-telegram-text-color font-semibold"}>
          <div className={"flex items-center gap-4"}>
            {t("checkoutContactInformation")}
            <UpdateContactInformation />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Suspense fallback={<div>{t("loading")}</div>}>
            <CheckoutContactInformation />
          </Suspense>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value={"payment-methods"} className={"border-none"}>
        <AccordionTrigger className={"text-telegram-text-color font-semibold"}>
          {t("checkoutPaymentMethods")}
        </AccordionTrigger>
        <AccordionContent>
          <Suspense fallback={<div>{t("loading")}</div>}>
            <CheckoutPaymentMethods />
          </Suspense>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
