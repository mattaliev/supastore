import { getTranslations } from "next-intl/server";

import DeliveryPolicy from "@/components/docs/delivery-policy";
import PrivacyPolicy from "@/components/docs/privacy-policy";
import ReturnPolicy from "@/components/docs/return-policy";
import TermsOfService from "@/components/docs/terms-of-service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default async function Policies() {
  const t = await getTranslations("PoliciesPage");

  return (
    <div className="text-telegram-text-color mx-6">
      <h1 className="text-2xl font-semibold leading-none tracking-tight text-telegram-text-color mb-2">
        {t("title")}
      </h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="terms">
          <AccordionTrigger>{t("termsOfService")}</AccordionTrigger>
          <AccordionContent>
            <TermsOfService />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="privacy">
          <AccordionTrigger>{t("privacyPolicy")}</AccordionTrigger>
          <AccordionContent>
            <PrivacyPolicy />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund">
          <AccordionTrigger>{t("returnPolicy")}</AccordionTrigger>
          <AccordionContent>
            <ReturnPolicy />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deliver">
          <AccordionTrigger>{t("deliveryPolicy")}</AccordionTrigger>
          <AccordionContent>
            <DeliveryPolicy />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
